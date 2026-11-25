import { useState } from "react";

/**
 * Draws any site form from its template (GET /api/form_templates): plain fields, repeating tables and pass/fail checklists.
 * The answers object has the same shape the API stores: { [sectionId]: { field: value } | [rows] | { item: { result, note } } }.
 * Templates live in the API (src/domain/forms/templates.js), so a new or changed form needs no website change.
 */

const box = "w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-50 disabled:text-gray-700";

/** Is this field/section required at the given status? Mirrors the API rule: `required` = from the first status after draft. */
export function isRequired(template, def, status) {
  const at = template.statuses.indexOf(status);
  if (def.requiredAt) return at >= template.statuses.indexOf(def.requiredAt);
  return !!def.required;
}
const Star = ({ on }) => (on ? <span className="text-red-600" title="Required before the form leaves draft"> *</span> : null);

const YN = [["yes", "Yes"], ["no", "No"], ["na", "N/A"]];
const RESULT = [["pass", "Pass", "bg-green-600 text-white border-green-600"], ["fail", "Fail", "bg-red-600 text-white border-red-600"], ["na", "N/A", "bg-gray-600 text-white border-gray-600"]];

function Toggle({ value, onChange, choices, disabled }) {
  return (
    <div className="inline-flex rounded-md overflow-hidden border border-gray-300">
      {choices.map(([v, label, on]) => (
        <button key={v} type="button" aria-pressed={value === v} disabled={disabled} onClick={() => onChange(value === v ? "" : v)}
          className={`px-3 py-1.5 text-xs font-semibold border-l first:border-l-0 transition ${value === v ? on || "bg-yellow-500 text-black border-yellow-500" : "bg-white text-gray-700 hover:bg-gray-50"} disabled:cursor-default`}>{label}</button>
      ))}
    </div>
  );
}

/** One input for one field definition. */
export function Input({ def, value, onChange, disabled, compact }) {
  const v = value ?? "";
  switch (def.type) {
    case "longtext": return <textarea className={`${box} ${compact ? "min-h-[2.25rem]" : "min-h-[5rem]"}`} rows={compact ? 1 : 3} value={v} disabled={disabled} onChange={(e) => onChange(e.target.value)} />;
    case "select": return (
      <select className={box} value={v} disabled={disabled} onChange={(e) => onChange(e.target.value)}>
        <option value="">-</option>
        {def.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
    case "yesno": return <Toggle value={v} onChange={onChange} choices={YN} disabled={disabled} />;
    case "number": return (
      <div className="flex items-center gap-1.5">
        <input className={box} type="number" step="any" inputMode="decimal" value={v} disabled={disabled} onChange={(e) => onChange(e.target.value)} />
        {def.unit && <span className="text-xs text-gray-500 whitespace-nowrap">{def.unit}</span>}
      </div>
    );
    case "date": case "time": return <input className={box} type={def.type} value={v} disabled={disabled} onChange={(e) => onChange(e.target.value)} />;
    default: return <input className={box} type="text" value={v} disabled={disabled} onChange={(e) => onChange(e.target.value)} />;
  }
}

function FieldsSection({ template, section, value = {}, onChange, status, disabled }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {section.fields.map((f) => {
        // Yes/No buttons must not sit inside a <label>: clicking the question would press "Yes", and screen readers would misname the buttons.
        const Tag = f.type === "yesno" ? "div" : "label";
        return (
          <Tag key={f.id} role={f.type === "yesno" ? "group" : undefined} aria-label={f.type === "yesno" ? f.label : undefined}
            className={`text-sm text-gray-600 ${f.type === "longtext" ? "sm:col-span-2" : ""}`}>
            <span>{f.label}<Star on={isRequired(template, f, status)} /></span>
            <div className="mt-1"><Input def={f} value={value[f.id]} disabled={disabled} onChange={(x) => onChange({ ...value, [f.id]: x })} /></div>
          </Tag>
        );
      })}
    </div>
  );
}

function TableSection({ template, section, value, onChange, status, disabled }) {
  const rows = Array.isArray(value) ? value : [];
  const set = (i, col, x) => onChange(rows.map((r, j) => (j === i ? { ...r, [col]: x } : r)));
  const need = section.minRows && isRequired(template, { ...section, required: true }, status);
  return (
    <div>
      {need && <p className="text-xs text-gray-500 mb-2">At least {section.minRows} row{section.minRows > 1 ? "s" : ""} needed<Star on /></p>}
      {rows.length > 0 && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-600">
              <tr>
                <th className="p-2 w-8">#</th>
                {section.columns.map((c) => <th key={c.id} className="p-2 font-medium whitespace-nowrap">{c.label}{c.unit ? ` (${c.unit})` : ""}<Star on={c.required} /></th>)}
                {!disabled && <th className="p-2 w-8" />}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t align-top">
                  <td className="p-2 text-xs text-gray-500">{i + 1}</td>
                  {section.columns.map((c) => (
                    <td key={c.id} className={`p-1.5 ${c.type === "longtext" || c.id === "description" || c.id === "action" ? "min-w-[14rem]" : "min-w-[8rem]"}`}>
                      <Input def={{ ...c, unit: undefined }} compact value={r[c.id]} disabled={disabled} onChange={(x) => set(i, c.id, x)} />
                    </td>
                  ))}
                  {!disabled && <td className="p-1.5"><button type="button" title="Remove row" onClick={() => onChange(rows.filter((_, j) => j !== i))} className="px-2 py-1 text-red-600 hover:bg-red-50 rounded">✕</button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!rows.length && <p className="text-sm text-gray-500">No rows yet.</p>}
      {!disabled && <button type="button" onClick={() => onChange([...rows, {}])} className="mt-2 text-sm font-medium text-blue-700 hover:underline">+ Add row</button>}
    </div>
  );
}

function ChecklistSection({ section, value = {}, onChange, disabled }) {
  const [noting, setNoting] = useState({});                  // items where someone clicked "+ Add note"
  const set = (id, patch) => onChange({ ...value, [id]: { ...(value[id] || {}), ...patch } });
  const done = section.items.filter((i) => value[i.id]?.result).length;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500">Answer every item. A failed item needs a note.</p>
        <span className="text-xs text-gray-500">{done} / {section.items.length} answered</span>
      </div>
      {!disabled && (
        <button type="button" onClick={() => onChange(Object.fromEntries(section.items.map((i) => [i.id, { ...(value[i.id] || {}), result: value[i.id]?.result || "pass" }])))}
          className="mb-2 text-xs font-medium text-blue-700 hover:underline">Mark the unanswered ones as Pass</button>
      )}
      <div className="divide-y border rounded-lg">
        {section.items.map((item, n) => {
          const a = value[item.id] || {}, needNote = a.result === "fail" && !a.note;
          return (
            <div key={item.id} className="p-2.5 grid gap-2 md:grid-cols-[1fr_auto] md:items-center">
              <div className="text-sm text-gray-800"><span className="text-gray-400 mr-2">{n + 1}.</span>{item.label}</div>
              <Toggle value={a.result || ""} onChange={(x) => set(item.id, { result: x })} choices={RESULT} disabled={disabled} />
              {!disabled && a.result && a.result !== "fail" && !a.note && !noting[item.id] && (
                <button type="button" onClick={() => setNoting({ ...noting, [item.id]: true })} className="justify-self-start text-xs text-gray-500 hover:text-gray-800 hover:underline md:col-span-2">+ Add note</button>
              )}
              {(a.result === "fail" || a.note || noting[item.id]) && (
                <input className={`${box} md:col-span-2 ${needNote ? "border-red-400 ring-1 ring-red-300" : ""}`} placeholder={a.result === "fail" ? "What is wrong and what will be done? (required)" : "Note (optional)"}
                  value={a.note || ""} disabled={disabled} onChange={(e) => set(item.id, { note: e.target.value })} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** The whole form: one card per section. */
export default function SiteForm({ template, data, onChange, status, disabled }) {
  return (
    <div className="space-y-4">
      {template.sections.map((s) => {
        const props = { template, section: s, value: data[s.id], status, disabled, onChange: (v) => onChange({ ...data, [s.id]: v }) };
        return (
          <section key={s.id} className="bg-white border rounded-xl p-4 shadow-sm break-inside-avoid">
            <h3 className="font-semibold text-gray-800 mb-3">{s.title}</h3>
            {s.type === "table" ? <TableSection {...props} /> : s.type === "checklist" ? <ChecklistSection {...props} /> : <FieldsSection {...props} />}
          </section>
        );
      })}
    </div>
  );
}
