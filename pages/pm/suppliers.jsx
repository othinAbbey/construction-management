import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell, Btn, Del, Empty, Field, Panel, Table } from "../../components/pm/ui";
import LocationPick from "../../components/pm/LocationPick";
import { api, can, getUser, useApi } from "../../lib/pm";

export default function Suppliers() {
  const { data, error, reload } = useApi("/api/sourcing");
  const [err, setErr] = useState("");
  const [canWrite, setCanWrite] = useState(false);
  useEffect(() => setCanWrite(can(getUser(), "catalog:write")), []);
  const [f, setF] = useState({ name: "", contact: "", phone: "", location_id: "", notes: "" });
  const run = (fn) => fn().then(() => { setErr(""); return reload(); }).catch((e) => setErr(e.message));
  if (!data) return <Shell title="Suppliers" error={error}><Empty>Loading...</Empty></Shell>;
  const loc = Object.fromEntries(data.locations.map((l) => [l.id, l]));
  return (
    <Shell title="Suppliers" error={err || error}>
      {!canWrite && <div className="text-sm text-gray-700 bg-white border rounded-lg p-3">Know a supplier that is missing? <Link href="/pm/contribute" className="underline font-medium">Suggest it</Link>; an admin reviews it.</div>}
      {canWrite && <Panel title="Add a supplier">
        <form onSubmit={(e) => { e.preventDefault(); run(async () => { await api("/api/suppliers", { method: "POST", body: f }); setF({ name: "", contact: "", phone: "", location_id: "", notes: "" }); }); }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <Field label="Supplier name" required value={f.name} onChange={(v) => setF({ ...f, name: v })} />
          <Field label="Contact person" value={f.contact} onChange={(v) => setF({ ...f, contact: v })} />
          <Field label="Phone" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
          <LocationPick locations={data.locations} value={f.location_id} onChange={(v) => setF({ ...f, location_id: v })} />
          <Field label="Notes" value={f.notes} onChange={(v) => setF({ ...f, notes: v })} />
          <Btn>Add supplier</Btn>
        </form>
      </Panel>}
      {!data.suppliers.length ? <Empty>No suppliers yet.</Empty> : (
        <Table head={["Supplier", "Contact", "Phone", "Location", "Rates", "Notes", ""]}>
          {data.suppliers.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-2.5 font-medium">{s.name}</td><td className="p-2.5">{s.contact}</td><td className="p-2.5">{s.phone && <a className="text-blue-700" href={`tel:${s.phone}`}>{s.phone}</a>}</td>
              <td className="p-2.5">{loc[s.location_id] ? `${loc[s.location_id].district}, ${loc[s.location_id].region}` : "-"}</td>
              <td className="p-2.5">{data.rates.filter((r) => r.supplier === s.id).length}</td><td className="p-2.5">{s.notes}</td>
              <td className="p-2.5">{canWrite && <Del onClick={() => run(() => api(`/api/suppliers/${s.id}`, { method: "DELETE" }))} />}</td>
            </tr>
          ))}
        </Table>
      )}
    </Shell>
  );
}
