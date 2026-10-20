import { Shell, Card, Bar, Empty, Form, Del } from "../components/ui";
import { usePM, money } from "../lib/pm";

export default function Dashboard() {
  const { d } = usePM();
  const open = d.tasks.filter((t) => t.status !== "done");
  const overdue = open.filter((t) => t.due && t.due < today());
  const budget = d.projects.reduce((s, p) => s + Number(p.budget || 0), 0);
  const spent = d.costs.reduce((s, c) => s + Number(c.amount || 0), 0);
  return (
    <Shell title="Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card label="Active projects" value={d.projects.filter((p) => p.status !== "complete").length} />
        <Card label="Open tasks" value={open.length} sub={`${overdue.length} overdue`} tone={overdue.length ? "text-red-600" : undefined} />
        <Card label="Open issues" value={d.issues.filter((i) => i.status !== "closed").length} />
        <Card label="Spent / budget" value={budget ? `${Math.round((spent / budget) * 100)}%` : "-"} sub={`${money(spent)} of ${money(budget)}`} tone={spent > budget && budget ? "text-red-600" : undefined} />
      </div>
      <h2 className="font-semibold text-gray-700">Progress by project</h2>
      {!d.projects.length ? <Empty>No projects yet. Add one under Projects.</Empty> : d.projects.map((p) => {
        const ts = d.tasks.filter((t) => t.project === p.id);
        const pct = ts.length ? (ts.filter((t) => t.status === "done").length / ts.length) * 100 : 0;
        return (
          <div key={p.id} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2"><b>{p.name}</b><span>{Math.round(pct)}% of {ts.length} tasks</span></div>
            <Bar pct={pct} />
          </div>
        );
      })}
    </Shell>
  );
}
