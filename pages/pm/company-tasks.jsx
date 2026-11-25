import { useState } from "react";
import { Card, Empty, Select, Shell, Table } from "../../components/pm/ui";
import { ProgressCell, STAGES, StageSteps, TaskDetail } from "../../components/pm/TaskProgress";
import { useApi, when } from "../../lib/pm";

const STATUS = [["todo", "To do"], ["doing", "In progress"], ["done", "Done"]];
const STATUS_TONE = { todo: "bg-gray-100 text-gray-700", doing: "bg-blue-100 text-blue-800", done: "bg-green-100 text-green-800" };

/**
 * Company Tasks: every task given to staff from the tender pipeline, and how far each person has got.
 * For directors and administrators (the "See every company task" right). Read-only: the work is done from Tenders > My assignments.
 */
export default function CompanyTasks() {
  const [f, setF] = useState({ assignee: "", status: "", stage: "" });
  const [open, setOpen] = useState(null);
  const qs = new URLSearchParams(Object.entries(f).filter(([, v]) => v)).toString();
  const { data, error, reload } = useApi(`/api/company_tasks${qs ? `?${qs}` : ""}`, [qs]);
  const tot = data?.totals;

  return (
    <Shell title="Company Tasks" error={error}>
      <p className="text-sm text-gray-600 -mt-2">Tasks given to staff from the tender pipeline: where each bid stands, which requirements are ready, and the latest note from the person doing it.</p>
      {tot && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card label="Open tasks" value={tot.open} sub={`${tot.done} done`} />
          <Card label="Overdue" value={tot.overdue} tone={tot.overdue ? "text-red-700" : "text-gray-900"} sub="past their due date" />
          <Card label="Due in the next 7 days" value={tot.due_this_week} />
          <Card label="Average progress" value={tot.average_progress === null ? "-" : `${tot.average_progress}%`} sub="requirements done, open tasks" />
        </div>
      )}

      {data?.people?.length > 0 && (
        <div className="space-y-2">
          <h2 className="font-semibold text-gray-800">By person</h2>
          <Table head={["Person", "Open", "Overdue", "Done", "Average progress", ""]}>
            {data.people.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2.5 font-medium">{p.name}</td><td className="p-2.5">{p.open}</td>
                <td className={`p-2.5 ${p.overdue ? "text-red-700 font-semibold" : ""}`}>{p.overdue}</td><td className="p-2.5">{p.done}</td>
                <td className="p-2.5 w-48">{p.average_progress === null ? <span className="text-xs text-gray-400">no checklists yet</span> : <ProgressCell task={{ progress: p.average_progress, requirements: { done: 0, total: 0 } }} />}</td>
                <td className="p-2.5"><button className="text-xs text-blue-700 hover:underline" onClick={() => setF({ ...f, assignee: f.assignee === p.id ? "" : p.id })}>{f.assignee === p.id ? "Show everyone" : "Only their tasks"}</button></td>
              </tr>
            ))}
          </Table>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3 bg-white border rounded-xl p-4">
        <Select label="Person" value={f.assignee} blank="Everyone" onChange={(v) => setF({ ...f, assignee: v })} options={(data?.people || []).map((p) => ({ v: p.id, l: p.name }))} />
        <Select label="Status" value={f.status} blank="Any status" onChange={(v) => setF({ ...f, status: v })} options={STATUS.map(([v, l]) => ({ v, l }))} />
        <Select label="Bid stage" value={f.stage} blank="Any stage" onChange={(v) => setF({ ...f, stage: v })} options={STAGES.map(([v, l]) => ({ v, l }))} />
      </div>

      {!data ? <p className="text-sm text-gray-500">Loading...</p> : !data.tasks.length ? <Empty>No tasks match. Tasks are given to staff from Tenders &gt; Pipeline &gt; Assign task.</Empty> : (
        <div className="space-y-3">
          {data.tasks.map((t) => (
            <button key={t.id} onClick={() => setOpen(t.id)} className={`w-full text-left bg-white border rounded-xl p-4 shadow-sm hover:border-yellow-400 ${t.overdue ? "border-red-300" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2"><b>{t.title}</b>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_TONE[t.status]}`}>{STATUS.find(([k]) => k === t.status)?.[1]}</span>
                    {t.overdue && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">overdue</span>}
                    {t.priority === "high" && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-800">high priority</span>}</div>
                  <div className="text-sm text-gray-600">{t.tender_title} · <b>{t.assignee_name || t.assignee_email}</b> · due {t.due ? String(t.due).slice(0, 10) : "no date"}{t.tender_deadline ? ` · tender closes ${String(t.tender_deadline).slice(0, 10)}` : ""}</div>
                  <StageSteps stage={t.stage} />
                  {t.last_update ? <div className="text-xs text-gray-500">Latest: “{t.last_update.body}” <span className="text-gray-400">({t.last_update.by}, {when(t.last_update.created)})</span></div> : <div className="text-xs text-gray-400">No progress notes yet</div>}
                </div>
                <div className="w-56"><ProgressCell task={t} /></div>
              </div>
            </button>
          ))}
        </div>
      )}
      {open && <TaskDetail id={open} onClose={() => setOpen(null)} onChanged={reload} />}
    </Shell>
  );
}
