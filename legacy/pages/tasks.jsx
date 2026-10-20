import { Shell, Form, Del, Empty } from "../components/ui";
import { usePM, today } from "../lib/pm";

const COLS = [["todo", "To do"], ["doing", "In progress"], ["done", "Done"]];
export default function Tasks() {
  const { d, add, upd, del, nameOf } = usePM();
  const move = (t, dir) => { const i = COLS.findIndex(([k]) => k === t.status) + dir; if (COLS[i]) upd("tasks", t.id, { status: COLS[i][0] }); };
  return (
    <Shell title="Tasks">
      <Form cta="Add task" onSubmit={(v) => add("tasks", { ...v, status: "todo" })} fields={[
        { k: "title", label: "Task", req: true }, { k: "project", label: "Project", req: true, options: d.projects.map((p) => ({ v: p.id, l: p.name })) },
        { k: "assignee", label: "Assigned to" }, { k: "priority", label: "Priority", def: "medium", options: ["low", "medium", "high"].map((s) => ({ v: s, l: s })) },
        { k: "start", label: "Start", type: "date" }, { k: "due", label: "Due", type: "date" },
      ]} />
      <div className="grid md:grid-cols-3 gap-3">
        {COLS.map(([key, label]) => (
          <div key={key} className="bg-gray-100 rounded-lg p-3 space-y-2">
            <div className="font-semibold text-gray-700">{label} ({d.tasks.filter((t) => t.status === key).length})</div>
            {d.tasks.filter((t) => t.status === key).map((t) => (
              <div key={t.id} className="bg-white border rounded p-3 text-sm space-y-1">
                <div className="font-medium">{t.title}</div>
                <div className="text-xs text-gray-500">{nameOf(t.project)} | {t.assignee || "unassigned"} | {t.priority}</div>
                {t.due && <div className={`text-xs ${t.due < today() && key !== "done" ? "text-red-600 font-semibold" : "text-gray-500"}`}>Due {t.due}</div>}
                <div className="flex gap-3 text-xs pt-1">
                  <button onClick={() => move(t, -1)} className="text-amber-700">&larr; back</button>
                  <button onClick={() => move(t, 1)} className="text-amber-700">next &rarr;</button>
                  <span className="flex-1" /><Del onClick={() => del("tasks", t.id)} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {!d.tasks.length && <Empty>Add a project first, then add tasks to it.</Empty>}
    </Shell>
  );
}
