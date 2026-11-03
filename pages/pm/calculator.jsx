import { useEffect, useState } from "react";
import { Shell, Btn, Empty, Field, Panel, Select, Table } from "../../components/pm/ui";
import LocationPick from "../../components/pm/LocationPick";
import { api, can, getUser, money, today, useApi } from "../../lib/pm";

const LABEL = { length: "Length (m)", width: "Width (m)", height: "Height / thickness (m)" };
const SCOPE = { district: "", region: "region price", anywhere: "price from another area", none: "no rate" };

export default function Calculator() {
  const src = useApi("/api/sourcing");
  const structures = useApi("/api/structures");
  const [canBudget, setCanBudget] = useState(false);
  useEffect(() => setCanBudget(can(getUser(), "projects:write")), []);
  const projects = useApi(canBudget ? "/api/projects" : null, [canBudget]);
  const [f, setF] = useState({ structure: "Internal Wall", length: "", width: "", height: "", block: "", mix: "", wastage: "5", location_id: "" });
  const [res, setRes] = useState(null);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [project, setProject] = useState("");

  const def = structures.data?.find((s) => s.name === f.structure);
  const blocks = (src.data?.materials || []).filter((m) => ["Blocks", "Bricks"].includes(m.category));
  useEffect(() => { if (!f.block && blocks.length) setF((x) => ({ ...x, block: blocks.find((b) => /Hollow Block 200/.test(b.name))?.name || blocks[0].name })); }, [blocks.length]); // eslint-disable-line react-hooks/exhaustive-deps

  async function calc(e) {
    e.preventDefault(); setErr(""); setOk("");
    try {
      const body = { structure: f.structure, mix: f.mix || undefined, wastage: Number(f.wastage || 0) / 100, location_id: f.location_id || undefined, block: def?.needs_block ? f.block : undefined };
      for (const k of def.inputs) body[k] = f[k];
      setRes(await api("/api/quantities", { method: "POST", body }));
    } catch (x) { setRes(null); setErr(x.message); }
  }

  async function addToBudget() {
    setErr(""); setOk("");
    try {
      const lines = res.items.filter((i) => i.total);
      for (const i of lines) await api("/api/costs", { method: "POST", body: { project, category: "Materials", item: `${res.structure}: ${i.label}`, amount: i.total, date: today(), supplier: i.supplier || "" } });
      setOk(`${lines.length} cost line${lines.length === 1 ? "" : "s"} added to the project budget.`);
    } catch (x) { setErr(x.message); }
  }

  return (
    <Shell title="Quantity Calculator" error={err || src.error || structures.error}>
      {ok && <div className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg p-3">{ok}</div>}
      <Panel title="What are you building?">
        {!def ? <Empty>Loading...</Empty> : (
          <form onSubmit={calc} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end">
            <Select label="Structure" value={f.structure} blank={null} onChange={(v) => { setF({ ...f, structure: v, mix: "" }); setRes(null); }} options={structures.data.map((s) => ({ v: s.name, l: s.name }))} />
            {def.inputs.map((k) => <Field key={k} label={LABEL[k]} type="number" step="any" min="0" required value={f[k]} onChange={(v) => setF({ ...f, [k]: v })} />)}
            {def.needs_block && <Select label="Block / brick" required blank={null} value={f.block} onChange={(v) => setF({ ...f, block: v })} options={blocks.map((b) => ({ v: b.name, l: b.name }))} />}
            <Field label={`Mix (default ${def.mix})`} value={f.mix} onChange={(v) => setF({ ...f, mix: v })} placeholder={def.mix} />
            <Field label="Wastage %" type="number" min="0" max="50" value={f.wastage} onChange={(v) => setF({ ...f, wastage: v })} />
            {src.data && <LocationPick locations={src.data.locations} value={f.location_id} onChange={(v) => setF({ ...f, location_id: v })} />}
            <Btn>Calculate</Btn>
          </form>
        )}
        {def && <p className="text-xs text-gray-500 mt-3">{def.help} Choose a district to price from local rates; without one the cheapest known rate is used.</p>}
      </Panel>

      {res && (
        <>
          <Table head={["Material", "Unit", "Quantity", "Rate (UGX)", "Total (UGX)", "Source"]}>
            {res.items.map((i) => (
              <tr key={i.key} className="border-t">
                <td className="p-2.5 font-medium">{i.label}</td><td className="p-2.5">{i.unit}</td><td className="p-2.5">{i.quantity.toLocaleString()}</td>
                <td className="p-2.5">{i.rate === null ? <span className="text-gray-400">{i.material ? "no rate yet" : "-"}</span> : money(i.rate)}</td>
                <td className="p-2.5 font-semibold">{i.total === null ? "-" : money(i.total)}</td>
                <td className="p-2.5 text-xs text-gray-500">{[i.supplier, SCOPE[i.rate_scope]].filter(Boolean).join(", ") || (i.rate !== null ? "market rate" : "")}</td>
              </tr>
            ))}
            <tr className="border-t bg-gray-50"><td className="p-2.5 font-bold" colSpan={4}>Estimated material cost</td><td className="p-2.5 font-bold">{money(res.total)}</td><td /></tr>
          </Table>
          <ul className="text-xs text-gray-500 list-disc pl-5">{res.notes.map((n) => <li key={n}>{n}</li>)}</ul>
          {res.unpriced > 0 && <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">{res.unpriced} material{res.unpriced > 1 ? "s have" : " has"} no rate yet, so the total is incomplete. Add rates under Material Rates.</div>}
          {canBudget && <Panel title="Add these costs to a project budget">
            <div className="flex flex-wrap items-end gap-3">
              <div className="min-w-[14rem]"><Select label="Project" value={project} onChange={setProject} blank="Choose project" options={(projects.data || []).map((p) => ({ v: p.id, l: p.name }))} /></div>
              <Btn disabled={!project || !res.total} onClick={addToBudget}>Add to budget</Btn>
            </div>
          </Panel>}
        </>
      )}
    </Shell>
  );
}
