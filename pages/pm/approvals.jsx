import { useState } from "react";
import { Shell, Empty, Panel, Table } from "../../components/pm/ui";
import { api, useApi, when } from "../../lib/pm";

const KINDS = { material: "Material", supplier: "Supplier", location: "Location", rate: "Price" };
const TONE = { approved: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-700" };
const FIELDS = { material: ["name", "category", "unit", "size", "description"], supplier: ["name", "contact", "phone", "notes"], location: ["region", "district"], rate: ["supplier_name", "district", "region", "note"] };
/** One line naming what was suggested (a price shows the material and amount). */
const title = (p) => (p.kind === "rate" ? `${p.payload.material_name}: UGX ${Number(p.payload.price).toLocaleString("en-UG")}${p.payload.unit ? ` per ${p.payload.unit}` : ""}` : p.payload.name || `${p.payload.district}, ${p.payload.region}`);

export default function Approvals() {
  const pending = useApi("/api/proposals?status=pending");
  const all = useApi("/api/proposals");
  const [err, setErr] = useState("");
  const decide = (p, action) => {
    const note = action === "reject" ? prompt("Reason (shown to the person who suggested it):") : "";
    if (action === "reject" && note === null) return;
    api(`/api/proposals/${p.id}/${action}`, { method: "POST", body: { note } })
      .then(() => { setErr(""); pending.reload(); all.reload(); }).catch((e) => setErr(e.message));
  };
  const history = (all.data || []).filter((p) => p.status !== "pending").slice(0, 30);

  return (
    <Shell title="Approvals" error={err || pending.error}>
      <p className="text-sm text-gray-600">Suggestions from users wait here. Approving creates the real catalog record.</p>
      {!pending.data?.length ? <Empty>Nothing waiting for review.</Empty> : pending.data.map((p) => (
        <Panel key={p.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="text-sm space-y-1">
              <div><span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold">{KINDS[p.kind]}</span> <b className="ml-1">{title(p)}</b></div>
              <div className="text-gray-600">{FIELDS[p.kind].filter((k) => p.payload[k] && k !== "name").map((k) => `${k.replace("_name", "")}: ${p.payload[k]}`).join(" | ")}</div>
              <div className="text-xs text-gray-500">from {p.submitted_by_email || "unknown"}, {when(p.submitted_at)}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => decide(p, "approve")} className="rounded-md bg-green-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-green-700">Approve</button>
              <button onClick={() => decide(p, "reject")} className="rounded-md border border-red-300 px-4 py-1.5 text-sm text-red-700 hover:bg-red-50">Reject</button>
            </div>
          </div>
        </Panel>
      ))}
      <h2 className="font-semibold text-gray-800">Recently decided</h2>
      {!history.length ? <Empty>No decisions yet.</Empty> : (
        <Table head={["Type", "What", "Decision", "From", "Decided", "Note"]}>
          {history.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2.5">{KINDS[p.kind]}</td><td className="p-2.5">{title(p)}</td>
              <td className="p-2.5"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TONE[p.status]}`}>{p.status}</span></td>
              <td className="p-2.5">{p.submitted_by_email}</td><td className="p-2.5 whitespace-nowrap text-gray-500">{when(p.reviewed_at)}</td><td className="p-2.5 text-gray-600">{p.review_note}</td>
            </tr>
          ))}
        </Table>
      )}
    </Shell>
  );
}
