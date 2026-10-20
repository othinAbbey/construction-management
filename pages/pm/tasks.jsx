import { useState } from "react";
import ResourcePage from "../../components/pm/ResourcePage";
import { Btn, Del, Empty, Form, Shell } from "../../components/pm/ui";
import { can, today, usePM } from "../../lib/pm";

const COLS = [["todo", "To do"], ["doing", "In progress"], ["done", "Done"]];
const PRIORITY = ["low", "medium", "high"];

export const taskFields = ({ d, projectId }) => [
  { k: "project", label: "Project", req: true, def: projectId, options: d.projects.map((p) => ({ v: p.id, l: p.name })) },
  { k: "title", label: "Task", req: true }, { k: "assignee", label: "Assigned to" },
  { k: "priority", label: "Priority", def: "medium", options: PRIORITY.map((s) => ({ v: s, l: s })) },
  { k: "start", label: "Start", type: "date" }, { k: "due", label: "Due", type: "date" },
  { k: "status", label: "Status", def: "todo", options: COLS.map(([v, l]) => ({ v, l })) },
];
export const taskColumns = ({ nameOf, upd, canWrite }) => [
  { key: "title", label: "Task" }, { key: "project", label: "Project", value: (r) => nameOf(r.project) }, { key: "assignee", label: "Assigned to" },
  { key: "priority", label: "Priority", render: (r) => <span className={r.priority === "high" ? "text-red-600 font-semibold" : ""}>{r.priority}</span>, csv: (r) => r.priority },
  { key: "start", label: "Start" }, { key: "due", label: "Due", render: (r) => <span className={r.due && r.due < today() && r.status !== "done" ? "text-red-600 font-semibold" : ""}>{r.due}</span>, csv: (r) => r.due },
  { key: "status", label: "Status", render: (r) => canWrite
    ? <select value={r.status} onChange={(e) => upd("tasks", r.id, { status: e.target.value })} className="border rounded px-1 py-0.5 text-xs">{COLS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select> : r.status, csv: (r) => r.status },
];

function Board() {
  const { d, add, upd, del, nameOf, error, user } = usePM();
  const canWrite = can(user, "projects:write");
  const move = (t, dir) => { const i = COLS.findIndex(([k]) => k === t.status) + dir; if (COLS[i]) upd("tasks", t.id, { status: COLS[i][0] }); };
  return (
    <div className="space-y-4">
      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}
      {canWrite && <Form cta="Add task" onSubmit={(v) => add("tasks", { ...v, status: "todo" })} fields={taskFields({ d }).filter((f) => f.k !== "status")} />}
      <div className="grid md:grid-cols-3 gap-3">
        {COLS.map(([key, label]) => (
          <div key={key} className="bg-gray-100 rounded-xl p-3 space-y-2">
            <div className="font-semibold text-gray-700">{label} ({d.tasks.filter((t) => t.status === key).length})</div>
            {d.tasks.filter((t) => t.status === key).map((t) => (
              <div key={t.id} className="bg-white border rounded-lg p-3 text-sm space-y-1 shadow-sm">
                <div className="font-medium">{t.title}</div>
                <div className="text-xs text-gray-500">{nameOf(t.project)} | {t.assignee || "unassigned"} | {t.priority}</div>
                {t.due && <div className={`text-xs ${t.due < today() && key !== "done" ? "text-red-600 font-semibold" : "text-gray-500"}`}>Due {t.due}</div>}
                {canWrite && <div className="flex gap-3 text-xs pt-1"><button onClick={() => move(t, -1)} className="text-yellow-700">&larr; back</button><button onClick={() => move(t, 1)} className="text-yellow-700">next &rarr;</button><span className="flex-1" /><Del onClick={() => del("tasks", t.id)} /></div>}
              </div>
            ))}
          </div>
        ))}
      </div>
      {!d.tasks.length && <Empty>Add a project first, then add tasks to it.</Empty>}
    </div>
  );
}

export default function Tasks() {
  const [view, setView] = useState("board");
  return (
    <Shell title="Tasks" actions={["board", "list"].map((v) => <Btn key={v} kind={view === v ? "primary" : "secondary"} onClick={() => setView(v)}>{v === "board" ? "Board" : "List (edit, search, export)"}</Btn>)}>
      {view === "board" ? <Board /> : <ResourcePage embedded resource="tasks" title="Task" addLabel="New task" searchKeys={["title", "assignee"]} fields={taskFields} columns={taskColumns} />}
    </Shell>
  );
}
