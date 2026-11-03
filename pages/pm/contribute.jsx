import { useEffect, useState } from "react";
import { Shell, Btn, Empty, Field, Panel, Select, Table } from "../../components/pm/ui";
import LocationPick from "../../components/pm/LocationPick";
import { api, can, getUser, useApi, when } from "../../lib/pm";

const KINDS = { material: "Material", supplier: "Supplier", location: "Location (district)" };
const TONE = { pending: "bg-yellow-100 text-yellow-800", approved: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-700" };
const EMPTY = { material: { name: "", category: "", unit: "", size: "", description: "" }, supplier: { name: "", contact: "", phone: "", location_id: "", notes: "" }, location: { region: "", district: "" } };
const describe = (p) => p.payload.name || [p.payload.district, p.payload.region].filter(Boolean).join(", ");

export default function Contribute() {
  const src = useApi("/api/sourcing");
  const mine = useApi("/api/proposals");
  const [kind, setKind] = useState("material");
  const [f, setF] = useState(EMPTY.material);
  const [msg, setMsg] = useState({ ok: "", err: "" });
  const [instant, setInstant] = useState(false);
  useEffect(() => setInstant(can(getUser(), "proposals:review")), []);
  const set = (k) => (v) => setF({ ...f, [k]: v });
  const pick = (k) => { setKind(k); setF(EMPTY[k]); setMsg({ ok: "", err: "" }); };

  async function submit(e) {
    e.preventDefault();
    try {
      await api("/api/proposals", { method: "POST", body: { kind, payload: f } });
      setMsg({ ok: instant ? "Added to the catalog." : "Thank you. An admin will review it before it appears in the catalog.", err: "" });
      setF(EMPTY[kind]); mine.reload(); src.reload();
    } catch (x) { setMsg({ ok: "", err: x.message }); }
  }
  const withdraw = (id) => api(`/api/proposals/${id}`, { method: "DELETE" }).then(mine.reload).catch((x) => setMsg({ ok: "", err: x.message }));
  const regions = [...new Set((src.data?.locations || []).map((l) => l.region))];

  return (
    <Shell title="Suggest Additions" error={msg.err || src.error || mine.error}>
      <p className="text-sm text-gray-600">Know a material, supplier or district that is missing? Send it in. {instant ? "As an admin, your additions go in straight away." : "An admin checks every suggestion before it joins the catalog."}</p>
      {msg.ok && <div className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg p-3">{msg.ok}</div>}
      <Panel>
        <div className="flex gap-2 mb-4">{Object.entries(KINDS).map(([k, l]) => <button key={k} onClick={() => pick(k)} className={`rounded-full px-4 py-1.5 text-sm border ${kind === k ? "bg-yellow-500 border-yellow-500 font-semibold" : "bg-white hover:bg-gray-50"}`}>{l}</button>)}</div>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end">
          {kind === "material" && <>
            <Field label="Name" required value={f.name} onChange={set("name")} /><Field label="Category" value={f.category} onChange={set("category")} />
            <Field label="Unit (bags, m3, pcs)" required value={f.unit} onChange={set("unit")} /><Field label="Size (e.g. 200 X 200 X 400)" value={f.size} onChange={set("size")} />
            <Field label="Description" value={f.description} onChange={set("description")} />
          </>}
          {kind === "supplier" && <>
            <Field label="Supplier name" required value={f.name} onChange={set("name")} /><Field label="Contact person" value={f.contact} onChange={set("contact")} />
            <Field label="Phone" value={f.phone} onChange={set("phone")} />
            {src.data && <LocationPick locations={src.data.locations} value={f.location_id} onChange={set("location_id")} />}
            <Field label="Notes" value={f.notes} onChange={set("notes")} />
          </>}
          {kind === "location" && <>
            <Select label="Region" required value={f.region} blank="Select region" onChange={set("region")} options={regions.map((r) => ({ v: r, l: r }))} />
            <Field label="District name" required value={f.district} onChange={set("district")} />
          </>}
          <Btn>{instant ? "Add" : "Submit for approval"}</Btn>
        </form>
      </Panel>
      <h2 className="font-semibold text-gray-800">{instant ? "Recent additions" : "My submissions"}</h2>
      {!mine.data?.length ? <Empty>Nothing submitted yet.</Empty> : (
        <Table head={["Type", "What", "Status", "Submitted", "Admin note", ""]}>
          {mine.data.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-2.5">{KINDS[p.kind]}</td><td className="p-2.5 font-medium">{describe(p)}</td>
              <td className="p-2.5"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TONE[p.status]}`}>{p.status}</span></td>
              <td className="p-2.5 whitespace-nowrap text-gray-500">{when(p.submitted_at)}</td><td className="p-2.5 text-gray-600">{p.review_note}</td>
              <td className="p-2.5">{p.status === "pending" && <button className="text-xs text-red-600 hover:underline" onClick={() => withdraw(p.id)}>Withdraw</button>}</td>
            </tr>
          ))}
        </Table>
      )}
    </Shell>
  );
}
