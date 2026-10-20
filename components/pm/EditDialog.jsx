import { useState } from "react";
import { Btn, Field, Select } from "./ui";

/** Edit one record using the same field list as the Add form. Only changed fields are sent. */
export default function EditDialog({ title, fields, row, onSave, onClose }) {
  const [v, setV] = useState(() => Object.fromEntries(fields.map((f) => [f.k, row[f.k] ?? ""])));
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const patch = {};
    for (const f of fields) if (String(v[f.k] ?? "") !== String(row[f.k] ?? "")) patch[f.k] = v[f.k];
    setBusy(true);
    try { if (Object.keys(patch).length) await onSave(patch); onClose(); } finally { setBusy(false); }
  }
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4">
        <h2 className="text-lg font-bold">{title}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map((f) => f.options
            ? <Select key={f.k} label={f.label} required={f.req} value={v[f.k]} options={f.options} onChange={(x) => setV({ ...v, [f.k]: x })} />
            : <Field key={f.k} label={f.label} type={f.type} required={f.req} value={v[f.k]} onChange={(x) => setV({ ...v, [f.k]: x })} />)}
        </div>
        <div className="flex justify-end gap-2"><Btn kind="secondary" type="button" onClick={onClose}>Cancel</Btn><Btn disabled={busy}>{busy ? "Saving..." : "Save changes"}</Btn></div>
      </form>
    </div>
  );
}
