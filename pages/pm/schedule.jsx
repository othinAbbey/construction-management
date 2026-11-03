import { useCallback, useEffect, useState } from "react";
import Gantt from "../../components/pm/Gantt";
import TaskEditor from "../../components/pm/TaskEditor";
import { Btn, Card, Empty, Select, Shell } from "../../components/pm/ui";
import { addDays, shortDate } from "../../lib/dates";
import { downloadText, toCsv } from "../../lib/csv";
import { api, can, getUser, useApi } from "../../lib/pm";

const WORKWEEKS = [{ v: "mon-sat", l: "Mon to Sat" }, { v: "mon-fri", l: "Mon to Fri" }, { v: "all", l: "7 days a week" }];

export default function Schedule() {
  const projects = useApi("/api/projects");
  const [pid, setPid] = useState("");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [zoom, setZoom] = useState("week");
  const [critical, setCritical] = useState(true);
  const [baseline, setBaseline] = useState(true);
  const [selected, setSelected] = useState(null);
  const [collapsed, setCollapsed] = useState(new Set());
  const [editor, setEditor] = useState(null);                 // { id } to edit, {} to create
  const [canWrite, setCanWrite] = useState(false);
  useEffect(() => setCanWrite(can(getUser(), "projects:write")), []);

  const load = useCallback(async (id = pid) => {
    if (!id) return null;
    try { const s = await api(`/api/projects/${id}/schedule`); setData(s); setErr(""); return s; }
    catch (e) { setErr(e.message); return null; }
  }, [pid]);
  useEffect(() => { if (!pid && projects.data?.length) setPid(projects.data[0].id); }, [projects.data, pid]);
  useEffect(() => { setData(null); setSelected(null); setNote(""); load(pid); }, [pid]); // eslint-disable-line react-hooks/exhaustive-deps

  const run = (p, msg) => p.then(async (r) => { await load(); setNote(typeof msg === "function" ? msg(r) : msg || ""); setErr(""); }).catch((e) => setErr(e.message));
  const toggle = (id) => setCollapsed((c) => { const n = new Set(c); n.has(id) ? n.delete(id) : n.add(id); return n; });

  async function move(task, delta) {
    const before = task.scheduled_start;
    try {
      await api(`/api/tasks/${task.id}`, { method: "PATCH", body: { start: addDays(task.scheduled_start, delta), due: addDays(task.scheduled_finish, delta), duration: task.duration } });
      const s = await load();
      const after = s?.tasks.find((t) => t.id === task.id);
      setNote(after && after.scheduled_start === before ? "That task is held in place by its links or the work calendar. Change a link or its lag to move it." : "");
    } catch (e) { setErr(e.message); }
  }
  const resize = (task, delta) => run(api(`/api/tasks/${task.id}`, { method: "PATCH", body: { duration: Math.max(1, (task.duration || 1) + delta) } }));

  const exportCsv = () => {
    const wbs = new Map(data.tasks.map((t) => [t.id, t.wbs]));
    const cols = [
      { label: "WBS", value: (t) => t.wbs }, { label: "Task", value: (t) => t.title }, { label: "Duration (days)", value: (t) => t.duration }, { label: "Start", value: (t) => t.scheduled_start },
      { label: "Finish", value: (t) => t.scheduled_finish }, { label: "% complete", value: (t) => t.percent_complete }, { label: "Float (days)", value: (t) => t.float },
      { label: "Critical", value: (t) => (t.critical ? "yes" : "") }, { label: "Predecessors", value: (t) => data.links.filter((l) => l.successor === t.id).map((l) => `${wbs.get(l.predecessor)}${l.type}${l.lag || ""}`).join(";") },
      { label: "Baseline start", value: (t) => t.baseline_start }, { label: "Baseline finish", value: (t) => t.baseline_end }, { label: "Finish variance (days)", value: (t) => t.finish_variance },
    ];
    downloadText(`schedule-${data.project.name}.csv`, toCsv(data.tasks, cols));
  };

  const hasBaseline = data?.tasks.some((t) => t.baseline_end);
  const differing = data?.tasks.filter((t) => t.differs).length || 0;
  const late = data ? Math.max(0, ...data.tasks.filter((t) => !t.summary).map((t) => t.finish_variance || 0)) : 0;
  const editing = editor?.id ? data?.tasks.find((t) => t.id === editor.id) : null;

  return (
    <Shell title="Schedule" error={err || projects.error}
      actions={data && <><Btn kind="secondary" onClick={exportCsv}>Export CSV</Btn><Btn kind="secondary" onClick={() => window.print()}>Print</Btn></>}>
      {!projects.data?.length ? <Empty>Add a project first.</Empty> : (
        <>
          <div className="flex flex-wrap items-end gap-3 print:hidden">
            <div className="w-64"><Select label="Project" value={pid} blank={null} onChange={setPid} options={projects.data.map((p) => ({ v: p.id, l: p.name }))} /></div>
            {data && <div className="w-40"><Select label="Work week" value={data.project.workweek || "mon-sat"} blank={null} onChange={(v) => canWrite && run(api(`/api/projects/${pid}`, { method: "PATCH", body: { workweek: v } }), "Work week changed; dates recalculated.")} options={WORKWEEKS} /></div>}
            <div className="flex rounded-md border overflow-hidden">{["day", "week", "month"].map((z) => <button key={z} onClick={() => setZoom(z)} className={`px-3 py-1.5 text-sm ${zoom === z ? "bg-yellow-500 font-semibold" : "bg-white hover:bg-gray-50"}`}>{z === "day" ? "Days" : z === "week" ? "Weeks" : "Months"}</button>)}</div>
            <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={critical} onChange={(e) => setCritical(e.target.checked)} /> Critical path</label>
            <label className="flex items-center gap-1.5 text-sm"><input type="checkbox" checked={baseline} onChange={(e) => setBaseline(e.target.checked)} /> Baseline</label>
          </div>

          {canWrite && data && (
            <div className="flex flex-wrap gap-2 print:hidden">
              <Btn onClick={() => setEditor({})}>+ Task</Btn>
              <Btn kind="secondary" disabled={!differing} title="Write the scheduled dates into the tasks" onClick={() => confirm(`Update the saved dates of ${differing} task(s) to match the schedule?`) && run(api(`/api/projects/${pid}/schedule/apply`, { method: "POST" }), (r) => `${r.moved} task(s) updated.`)}>Apply schedule{differing ? ` (${differing})` : ""}</Btn>
              <Btn kind="secondary" onClick={() => confirm(hasBaseline ? "Replace the current baseline with today's schedule?" : "Save today's schedule as the baseline?") && run(api(`/api/projects/${pid}/baseline`, { method: "POST", body: {} }), "Baseline saved.")}>{hasBaseline ? "Reset baseline" : "Set baseline"}</Btn>
              {hasBaseline && <Btn kind="secondary" onClick={() => confirm("Clear the baseline?") && run(api(`/api/projects/${pid}/baseline`, { method: "POST", body: { clear: true } }), "Baseline cleared.")}>Clear baseline</Btn>}
            </div>
          )}

          {note && <div className="text-sm text-blue-900 bg-blue-50 border border-blue-200 rounded-lg p-3">{note}</div>}
          {data?.warnings.map((w) => <div key={w} className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3">{w}</div>)}

          {data && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                <Card label="Starts" value={shortDate(data.project.start)} /><Card label="Finishes" value={shortDate(data.project.finish)} sub={`${data.project.working_days} working days`} />
                <Card label="Critical tasks" value={data.project.critical_tasks} tone={data.project.critical_tasks ? "text-red-600" : undefined} />
                <Card label="Tasks / links" value={`${data.tasks.length} / ${data.links.length}`} />
                <Card label="Behind baseline" value={hasBaseline ? `${late} day${late === 1 ? "" : "s"}` : "no baseline"} tone={late ? "text-red-600" : undefined} />
              </div>
              {!data.tasks.length ? <Empty>No tasks yet. Add the first task, then link tasks together to build the schedule.</Empty> : (
                <Gantt data={data} zoom={zoom} showCritical={critical} showBaseline={baseline} selectedId={selected} collapsed={collapsed} canWrite={canWrite}
                  onToggle={toggle} onSelect={setSelected} onOpen={(id) => canWrite ? setEditor({ id }) : setSelected(id)} onMove={move} onResize={resize} />
              )}
              <p className="text-xs text-gray-500 print:hidden">
                {canWrite ? "Drag a bar to move it; drag its right edge to change its length; double-click a task to edit it and set links. " : ""}
                Red bars are the critical path (no float). Grey bars are the baseline. Amber dates are not yet saved on the task: use Apply schedule.
              </p>
            </>
          )}
        </>
      )}
      {editor && data && <TaskEditor key={editor.id || "new"} task={editing} project={pid} tasks={data.tasks} links={data.links} onClose={() => setEditor(null)} onChanged={() => load()} />}
    </Shell>
  );
}
