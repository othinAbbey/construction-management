import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Shell, Btn, Del, Empty, Field, Panel, Select, Table } from "../../components/pm/ui";
import LocationPick from "../../components/pm/LocationPick";
import { api, can, getUser, money, useApi, when } from "../../lib/pm";

export default function Sourcing() {
  const { data, error, reload } = useApi("/api/sourcing");
  const [err, setErr] = useState("");
  const [canWrite, setCanWrite] = useState(false);
  useEffect(() => setCanWrite(can(getUser(), "catalog:write")), []);
  const [f, setF] = useState({ region: "", district: "", material: "" });
  const [rate, setRate] = useState({ material: "", supplier: "", location_id: "", price: "", note: "" });
  const [mat, setMat] = useState({ name: "", category: "", unit: "", size: "", description: "" });
  const run = (fn) => fn().then(() => { setErr(""); return reload(); }).catch((e) => setErr(e.message));

  const idx = useMemo(() => {
    if (!data) return null;
    return { loc: Object.fromEntries(data.locations.map((l) => [l.id, l])), mat: Object.fromEntries(data.materials.map((m) => [m.id, m])), sup: Object.fromEntries(data.suppliers.map((s) => [s.id, s])) };
  }, [data]);

  const rows = useMemo(() => {
    if (!data) return [];
    const list = data.rates.map((r) => ({ ...r, m: idx.mat[r.material], l: idx.loc[r.location_id], s: r.supplier ? idx.sup[r.supplier] : null }))
      .filter((r) => r.m && r.l && (!f.region || r.l.region === f.region) && (!f.district || String(r.location_id) === f.district) && (!f.material || r.material === f.material));
    const best = {}; for (const r of list) if (!(r.material in best) || r.price < best[r.material]) best[r.material] = r.price;
    return list.sort((a, b) => a.m.name.localeCompare(b.m.name) || a.price - b.price).map((r) => ({ ...r, best: r.price === best[r.material] }));
  }, [data, idx, f]);

  if (!data) return <Shell title="Material Rates" error={error}><Empty>Loading...</Empty></Shell>;
  const regions = [...new Set(data.locations.map((l) => l.region))];

  return (
    <Shell title="Material Rates" error={err || error}>
      {!canWrite && <div className="text-sm text-gray-700 bg-white border rounded-lg p-3">You can browse every rate. To add or correct something, <Link href="/pm/contribute" className="underline font-medium">suggest an addition</Link>; an admin reviews it.</div>}
      <Panel title="Find rates">
        <div className="grid gap-3 sm:grid-cols-3">
          <Select label="Region" value={f.region} blank="All regions" onChange={(v) => setF({ ...f, region: v, district: "" })} options={regions.map((r) => ({ v: r, l: r }))} />
          <Select label="District" value={f.district} blank="All districts" onChange={(v) => setF({ ...f, district: v })} options={data.locations.filter((l) => !f.region || l.region === f.region).map((l) => ({ v: l.id, l: l.district }))} />
          <Select label="Material" value={f.material} blank="All materials" onChange={(v) => setF({ ...f, material: v })} options={data.materials.map((m) => ({ v: m.id, l: m.name }))} />
        </div>
      </Panel>

      {!rows.length ? <Empty>No rates match. Add one below.</Empty> : (
        <Table head={["Material", "Unit", "District", "Region", "Supplier", "Price (UGX)", "Updated", ""]}>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-2.5 font-medium">{r.m.name}</td><td className="p-2.5">{r.m.unit}</td><td className="p-2.5">{r.l.district}</td><td className="p-2.5">{r.l.region}</td>
              <td className="p-2.5">{r.s?.name || <span className="text-gray-400">market rate</span>}{r.note && <div className="text-xs text-gray-500">{r.note}</div>}</td>
              <td className="p-2.5 whitespace-nowrap">{money(r.price)} {r.best && rows.filter((x) => x.material === r.material).length > 1 && <span className="ml-1 rounded bg-green-100 text-green-800 text-xs px-1.5 py-0.5">lowest</span>}</td>
              <td className="p-2.5 whitespace-nowrap text-gray-500">{when(r.updated || r.created)}</td>
              <td className="p-2.5 whitespace-nowrap space-x-3">{canWrite && <>
                <button className="text-xs text-blue-700 hover:underline" onClick={() => { const v = prompt(`New price for ${r.m.name} (${r.m.unit})`, r.price); if (v !== null && v !== "") run(() => api(`/api/rates/${r.id}`, { method: "PATCH", body: { price: v } })); }}>Edit price</button>
                <Del onClick={() => run(() => api(`/api/rates/${r.id}`, { method: "DELETE" }))} /></>}
              </td>
            </tr>
          ))}
        </Table>
      )}

      {canWrite && <Panel title="Add a rate">
        <form onSubmit={(e) => { e.preventDefault(); run(async () => { await api("/api/rates", { method: "POST", body: { ...rate, supplier: rate.supplier || null } }); setRate({ ...rate, price: "", note: "" }); }); }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <Select label="Material" required value={rate.material} onChange={(v) => setRate({ ...rate, material: v })} options={data.materials.map((m) => ({ v: m.id, l: `${m.name} (${m.unit})` }))} />
          <Select label="Supplier (optional)" value={rate.supplier} blank="Market rate" onChange={(v) => setRate({ ...rate, supplier: v })} options={data.suppliers.map((s) => ({ v: s.id, l: s.name }))} />
          <LocationPick locations={data.locations} value={rate.location_id} required onChange={(v) => setRate({ ...rate, location_id: v })} />
          <Field label="Price (UGX)" type="number" min="0" required value={rate.price} onChange={(v) => setRate({ ...rate, price: v })} />
          <Field label="Note" value={rate.note} onChange={(v) => setRate({ ...rate, note: v })} placeholder="Quote ref, date..." />
          <Btn>Add rate</Btn>
        </form>
      </Panel>}

      <Panel title={`Materials (${data.materials.length})`}>
        {canWrite && <form onSubmit={(e) => { e.preventDefault(); run(async () => { await api("/api/materials", { method: "POST", body: mat }); setMat({ name: "", category: "", unit: "", size: "", description: "" }); }); }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6 items-end mb-4">
          <Field label="Name" required value={mat.name} onChange={(v) => setMat({ ...mat, name: v })} />
          <Field label="Category" value={mat.category} onChange={(v) => setMat({ ...mat, category: v })} />
          <Field label="Unit (bags, m3, pcs)" required value={mat.unit} onChange={(v) => setMat({ ...mat, unit: v })} />
          <Field label="Size (e.g. 200 X 200 X 400)" value={mat.size} onChange={(v) => setMat({ ...mat, size: v })} />
          <Field label="Description" value={mat.description} onChange={(v) => setMat({ ...mat, description: v })} />
          <Btn>Add material</Btn>
        </form>}
        <div className="flex flex-wrap gap-2 text-sm">
          {data.materials.map((m) => (
            <span key={m.id} className="inline-flex items-center gap-2 rounded-full border bg-gray-50 px-3 py-1">{m.name} <span className="text-gray-400">{m.unit}</span>
              {canWrite && <button className="text-red-500 hover:text-red-700" title="Delete material and its rates" onClick={() => confirm(`Delete ${m.name} and all its rates?`) && run(() => api(`/api/materials/${m.id}`, { method: "DELETE" }))}>&times;</button>}</span>
          ))}
        </div>
      </Panel>
      <p className="text-xs text-gray-500">The starter prices for Kampala are samples so the calculator works on day one. Replace them with real supplier quotes.</p>
    </Shell>
  );
}
