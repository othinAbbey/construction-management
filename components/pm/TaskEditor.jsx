import { useState } from "react";
import { Btn, Field, Select } from "./ui";
import { api } from "../../lib/pm";

const TYPES = [["FS", "Finish-to-start (FS)"], ["SS", "Start-to-start (SS)"], ["FF", "Finish-to-finish (FF)"], ["SF", "Start-to-finish (SF)"]];
const STATUS = [["todo", "To do"], ["doing", "In progress"], ["done", "Done"]];

/** Create or edit one task: dates, duration, percent complete, milestone, parent (summary task) and its dependencies. */
export default function TaskEditor({ task, project, tasks, links, onClose, onChanged }) {
  const editing = !!task;
  const [v, setV] = useState(() => ({
    title: task?.title ?? "", assignee: task?.assignee ?? "", priority: task?.priority ?? "medium", start: task?.start ?? "", duration: task?.duration ?? "",
    percent: task?.percent ?? 0, milestone: task?.milestone ? 1 : 0, parent: task?.parent ?? "", status: task?.status ?? "todo", sort_order: task?.sort_order ?? 0,
  }));
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [nl, setNl] = useState({ predecessor: "", type: "FS", lag: 0 });
  const set = (k) => (x) => setV({ ...v, [k]: x });
  const fail = (e) => setErr(e.message);

  async function save(e) {
    e.preventDefault(); setBusy(true); setErr("");
    try {
      if (editing) {
        const patch = {};
        for (const k of Object.keys(v)) if (String(v[k] ?? "") !== String(task[k] ?? (k === "milestone" ? 0 : ""))) patch[k] = v[k];
        if (Object.keys(patch).length) await api(`/api/tasks/${task.id}`, { method: "PATCH", body: patch });
      } else await api("/api/tasks", { method: "POST", body: { ...v, project } });
      await onChanged(); onClose();
    } catch (x) { fail(x); } finally { setBusy(false); }
  }
  const act = (fn) => fn().then(() => { setErr(""); return onChanged(); }).catch(fail);
  const mine = editing ? links.filter((l) => l.successor === task.id) : [];
  const after = editing ? links.filter((l) => l.predecessor === task.id) : [];
  const name = (id) => tasks.find((t) => t.id === id)?.title || "?";
  const options = tasks.filter((t) => !editing || t.id !== task.id);
  const cls = "mt-1 border border-gray-300 rounded-md px-2 py-1 text-sm bg-white";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[92vh] overflow-y-auto space-y-5">
        <h2 className="text-lg font-bold">{editing ? "Edit task" : "New task"}</h2>
        {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{err}</div>}

        <form onSubmit={save} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2"><Field label="Task name" required value={v.title} onChange={set("title")} /></div>
            <Field label="Start no earlier than" type="date" value={v.start} onChange={set("start")} />
            <Field label="Duration (working days)" type="number" min="0" value={v.duration} onChange={set("duration")} placeholder="from the dates" />
            <Field label="% complete" type="number" min="0" max="100" value={v.percent} onChange={(x) => set("percent")(x === "" ? 0 : Number(x))} />
            <Select label="Status" value={v.status} blank={null} onChange={set("status")} options={STATUS.map(([a, b]) => ({ v: a, l: b }))} />
            <Select label="Inside summary task" value={v.parent} blank="(top level)" onChange={set("parent")} options={options.map((t) => ({ v: t.id, l: `${t.wbs}  ${t.title}` }))} />
            <Field label="Assigned to" value={v.assignee} onChange={set("assignee")} />
            <Select label="Priority" value={v.priority} blank={null} onChange={set("priority")} options={["low", "medium", "high"].map((p) => ({ v: p, l: p }))} />
            <Field label="Order (lower = higher up)" type="number" value={v.sort_order} onChange={(x) => set("sort_order")(x === "" ? 0 : Number(x))} />
            <label className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2"><input type="checkbox" checked={!!v.milestone} onChange={(e) => set("milestone")(e.target.checked ? 1 : 0)} /> Milestone (a point in time, zero duration)</label>
          </div>
          <div className="flex justify-between gap-2">
            <div>{editing && <button type="button" className="text-sm text-red-600 hover:underline" onClick={() => confirm("Delete this task and its links?") && act(() => api(`/api/tasks/${task.id}`, { method: "DELETE" }).then(onClose))}>Delete task</button>}</div>
            <div className="flex gap-2"><Btn kind="secondary" type="button" onClick={onClose}>Cancel</Btn><Btn disabled={busy}>{busy ? "Saving..." : editing ? "Save changes" : "Add task"}</Btn></div>
          </div>
        </form>

        {editing && (
          <div className="border-t pt-4 space-y-3">
            <h3 className="font-semibold text-sm">Predecessors <span className="font-normal text-gray-500">(this task waits for)</span></h3>
            {!mine.length ? <div className="text-sm text-gray-500">None. It starts on its own date.</div> : mine.map((l) => (
              <div key={l.id} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="min-w-[10rem] flex-1 truncate">{name(l.predecessor)}</span>
                <select defaultValue={l.type} onChange={(e) => act(() => api(`/api/task_links/${l.id}`, { method: "PATCH", body: { type: e.target.value } }))} className={cls}>{TYPES.map(([a, b]) => <option key={a} value={a}>{b}</option>)}</select>
                <label className="text-xs text-gray-500">lag <input type="number" defaultValue={l.lag} onBlur={(e) => String(l.lag) !== e.target.value && act(() => api(`/api/task_links/${l.id}`, { method: "PATCH", body: { lag: e.target.value } }))} className={`${cls} w-16`} /> d</label>
                <button className="text-red-600 text-xs hover:underline" onClick={() => act(() => api(`/api/task_links/${l.id}`, { method: "DELETE" }))}>Remove</button>
              </div>
            ))}
            <div className="flex flex-wrap items-end gap-2 text-sm bg-gray-50 rounded-lg p-3">
              <Select label="Add predecessor" value={nl.predecessor} blank="Choose task" onChange={(x) => setNl({ ...nl, predecessor: x })} options={options.filter((t) => !t.summary).map((t) => ({ v: t.id, l: `${t.wbs}  ${t.title}` }))} />
              <Select label="Type" value={nl.type} blank={null} onChange={(x) => setNl({ ...nl, type: x })} options={TYPES.map(([a, b]) => ({ v: a, l: b }))} />
              <Field label="Lag (days)" type="number" value={nl.lag} onChange={(x) => setNl({ ...nl, lag: x })} />
              <Btn type="button" disabled={!nl.predecessor} onClick={() => act(() => api("/api/task_links", { method: "POST", body: { predecessor: nl.predecessor, successor: task.id, type: nl.type, lag: nl.lag } }).then(() => setNl({ predecessor: "", type: "FS", lag: 0 })))}>Link</Btn>
            </div>
            {after.length > 0 && <div className="text-xs text-gray-500">Tasks waiting for this one: {after.map((l) => name(l.successor)).join(", ")}</div>}
            <p className="text-xs text-gray-500">Lag is in working days. Use a negative lag to overlap tasks. A task cannot depend on itself or form a loop.</p>
          </div>
        )}
      </div>
    </div>
  );
}
