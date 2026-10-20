import { Card, Bar, Health, Panel } from "./ui";
import { money, size, when } from "../../lib/pm";

/** The one-page project report: health, schedule vs progress, budget, issues, site activity, next tasks, recent activity. */
export default function ProjectSummary({ s }) {
  const p = s.project;
  return (
    <div className="space-y-4">
      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-gray-600">{[p.client, p.location].filter(Boolean).join(" - ") || "No client or location set"}
            <div>PM: {p.manager || "-"} | {p.start || "?"} to {p.end || "?"} | status: {p.status || "-"}</div></div>
          <Health level={s.health} />
        </div>
        {s.reasons.length > 0 && <ul className="mt-3 text-sm list-disc pl-5 text-gray-700">{s.reasons.map((r) => <li key={r}>{r}</li>)}</ul>}
      </Panel>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card label="Task progress" value={s.schedule.progress_pct === null ? "-" : `${s.schedule.progress_pct}%`} sub={`${s.tasks.done} of ${s.tasks.total} done`} />
        <Card label="Time elapsed" value={s.schedule.elapsed_pct === null ? "-" : `${s.schedule.elapsed_pct}%`} sub={s.schedule.days_left === null ? "set start and finish dates" : s.schedule.days_left >= 0 ? `${s.schedule.days_left} days left` : `${-s.schedule.days_left} days past finish`} />
        <Card label="Budget used" value={s.budget.used_pct === null ? "-" : `${s.budget.used_pct}%`} sub={`${money(s.budget.spent)} of ${money(s.budget.budget)}`} tone={s.budget.remaining < 0 && s.budget.budget ? "text-red-600" : undefined} />
        <Card label="Forecast cost" value={s.budget.forecast === null ? "-" : money(s.budget.forecast)} sub="spent so far / share of tasks done" tone={s.budget.forecast > s.budget.budget && s.budget.budget ? "text-red-600" : undefined} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Schedule vs progress">
          <div className="space-y-3 text-sm">
            <div><div className="flex justify-between"><span>Time elapsed</span><span>{s.schedule.elapsed_pct ?? "-"}%</span></div><Bar pct={s.schedule.elapsed_pct || 0} color="bg-gray-500" /></div>
            <div><div className="flex justify-between"><span>Tasks done</span><span>{s.schedule.progress_pct ?? "-"}%</span></div><Bar pct={s.schedule.progress_pct || 0} /></div>
            {s.schedule.behind_pct > 0 && <div className="text-amber-700">Progress is {s.schedule.behind_pct} points behind the calendar.</div>}
            <div className="text-gray-600">To do {s.tasks.todo} | In progress {s.tasks.doing} | Done {s.tasks.done} | <span className={s.tasks.overdue ? "text-red-600 font-semibold" : ""}>Overdue {s.tasks.overdue}</span></div>
          </div>
        </Panel>
        <Panel title="Cost by category">
          {!s.budget.by_category.length ? <div className="text-sm text-gray-500">No costs recorded.</div> : s.budget.by_category.map((c) => (
            <div key={c.category} className="mb-2 text-sm"><div className="flex justify-between"><span>{c.category}</span><span>{money(c.amount)}</span></div><Bar pct={s.budget.spent ? (c.amount / s.budget.spent) * 100 : 0} /></div>
          ))}
          <div className="text-sm font-semibold flex justify-between border-t pt-2 mt-2"><span>Remaining</span><span className={s.budget.remaining < 0 ? "text-red-600" : ""}>{money(s.budget.remaining)}</span></div>
        </Panel>
        <Panel title="Issues and risks">
          <div className="text-sm space-y-1">
            <div>Open: <b>{s.issues.open}</b> | High severity: <b className={s.issues.high ? "text-red-600" : ""}>{s.issues.high}</b> | Past response date: <b>{s.issues.overdue}</b></div>
            {s.issues.by_type.map((t) => <div key={t.type} className="flex justify-between text-gray-600"><span>{t.type}</span><span>{t.n}</span></div>)}
          </div>
        </Panel>
        <Panel title="Site activity">
          <div className="text-sm space-y-1">
            <div>Logs: <b>{s.site_logs.count}</b> {s.site_logs.last_date && <span className="text-gray-500">(last {s.site_logs.last_date})</span>}</div>
            <div>Worker-days: <b>{s.site_logs.worker_days}</b> | Delays logged: <b>{s.site_logs.delays}</b> | Safety incidents: <b className={s.site_logs.safety_incidents ? "text-red-600" : ""}>{s.site_logs.safety_incidents}</b></div>
            <div>Documents: <b>{s.files.n}</b> ({size(s.files.bytes)})</div>
          </div>
        </Panel>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Next tasks">
          {!s.upcoming.length ? <div className="text-sm text-gray-500">Nothing open.</div> : s.upcoming.map((t) => (
            <div key={t.id} className="flex justify-between gap-2 text-sm py-1 border-b last:border-0"><span>{t.title} <span className="text-gray-500">{t.assignee && `(${t.assignee})`}</span></span><span className="text-gray-500 whitespace-nowrap">{t.due || "no date"}</span></div>
          ))}
        </Panel>
        <Panel title="Recent activity">
          {!s.activity.length ? <div className="text-sm text-gray-500">No activity yet.</div> : s.activity.map((a, i) => (
            <div key={i} className="text-sm py-1 border-b last:border-0"><span className="text-gray-500">{when(a.at)}</span> {a.user_email || "system"} <b>{a.action}</b> {a.summary}</div>
          ))}
        </Panel>
      </div>
    </div>

  );
}
