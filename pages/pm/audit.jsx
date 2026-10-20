import { useEffect, useState } from "react";
import { Shell, Btn, Empty, Select, Table } from "../../components/pm/ui";
import { api, useApi, when } from "../../lib/pm";

const ENTITIES = ["projects", "tasks", "costs", "logs", "issues", "files", "materials", "suppliers", "rates", "users", "messages"];
const TONE = { create: "bg-green-100 text-green-800", update: "bg-blue-100 text-blue-800", delete: "bg-red-100 text-red-700", upload: "bg-green-100 text-green-800", login_failed: "bg-red-100 text-red-700" };
const show = (v) => (v === null || v === undefined || v === "" ? "empty" : String(v));

export default function Audit() {
  const projects = useApi("/api/projects");
  const [f, setF] = useState({ entity: "", project: "", user: "" });
  const [rows, setRows] = useState([]);
  const [next, setNext] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const query = (before) => { const q = new URLSearchParams({ limit: "50" }); for (const [k, v] of Object.entries(f)) if (v) q.set(k, v); if (before) q.set("before", before); return q.toString(); };
  const load = async (more) => {
    setBusy(true);
    try { const r = await api(`/api/audit?${query(more ? next : null)}`); setRows(more ? [...rows, ...r.items] : r.items); setNext(r.next); setErr(""); }
    catch (e) { setErr(e.message); } finally { setBusy(false); }
  };
  useEffect(() => { load(false); }, [f.entity, f.project]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Shell title="Audit Trail" error={err}>
      <div className="grid gap-3 sm:grid-cols-4 items-end">
        <Select label="What" value={f.entity} onChange={(v) => setF({ ...f, entity: v })} blank="Everything" options={ENTITIES.map((e) => ({ v: e, l: e }))} />
        <Select label="Project" value={f.project} onChange={(v) => setF({ ...f, project: v })} blank="All projects" options={(projects.data || []).map((p) => ({ v: p.id, l: p.name }))} />
        <label className="text-sm text-gray-600">Who (email contains)<input className="mt-1 w-full border border-gray-300 rounded-md px-2.5 py-1.5" value={f.user} onChange={(e) => setF({ ...f, user: e.target.value })} onKeyDown={(e) => e.key === "Enter" && load(false)} /></label>
        <Btn kind="secondary" onClick={() => load(false)}>Search</Btn>
      </div>
      {!rows.length ? <Empty>{busy ? "Loading..." : "No activity matches."}</Empty> : (
        <Table head={["When", "Who", "Action", "What", "Details"]}>
          {rows.map((r) => (
            <tr key={r.id} className="border-t align-top">
              <td className="p-2.5 whitespace-nowrap text-gray-500">{when(r.at)}</td>
              <td className="p-2.5">{r.user_email || "system"}</td>
              <td className="p-2.5"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TONE[r.action] || "bg-gray-100 text-gray-700"}`}>{r.action}</span></td>
              <td className="p-2.5">{r.entity}</td>
              <td className="p-2.5">{r.summary}
                {r.action === "update" && r.changes && <div className="mt-1 text-xs text-gray-600 space-y-0.5">{Object.entries(r.changes).map(([k, [a, b]]) => <div key={k}><b>{k}</b>: {show(a)} → {show(b)}</div>)}</div>}
              </td>
            </tr>
          ))}
        </Table>
      )}
      {next && <Btn kind="secondary" disabled={busy} onClick={() => load(true)}>Load older activity</Btn>}
      <p className="text-xs text-gray-500">The trail is append-only: entries cannot be edited or deleted. Deleted records are kept inside their delete entry.</p>
    </Shell>
  );
}
