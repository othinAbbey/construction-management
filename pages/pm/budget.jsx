import ResourcePage from "../../components/pm/ResourcePage";
import { Bar } from "../../components/pm/ui";
import { money } from "../../lib/pm";

export const COST_CATEGORIES = ["Materials", "Labour", "Equipment", "Subcontractor", "Transport", "Permits", "Other"];

export const costFields = ({ d, projectId }) => [
  { k: "project", label: "Project", req: true, def: projectId, options: d.projects.map((p) => ({ v: p.id, l: p.name })) },
  { k: "category", label: "Category", def: "Materials", options: COST_CATEGORIES.map((c) => ({ v: c, l: c })) },
  { k: "item", label: "Description", req: true }, { k: "amount", label: "Amount", type: "number", req: true },
  { k: "date", label: "Date", type: "date" }, { k: "supplier", label: "Supplier / payee" },
];
export const costColumns = ({ nameOf }) => [
  { key: "date", label: "Date" }, { key: "project", label: "Project", value: (r) => nameOf(r.project) },
  { key: "category", label: "Category" }, { key: "item", label: "Description" }, { key: "supplier", label: "Payee" },
  { key: "amount", label: "Amount", align: "right", render: (r) => money(r.amount), csv: (r) => r.amount },
];

const BudgetBars = ({ d, projectId }) => d.projects.filter((p) => !projectId || p.id === projectId).map((p) => {
  const spent = d.costs.filter((c) => c.project === p.id).reduce((s, c) => s + Number(c.amount), 0), b = Number(p.budget || 0);
  return (
    <div key={p.id} className="bg-white border rounded-xl p-4 space-y-2 shadow-sm">
      <div className="flex justify-between text-sm"><b>{p.name}</b><span className={spent > b && b ? "text-red-600 font-semibold" : ""}>{money(spent)} / {money(b)} (remaining {money(b - spent)})</span></div>
      <Bar pct={b ? (spent / b) * 100 : 0} color={spent > b && b ? "bg-red-500" : "bg-yellow-500"} />
    </div>
  );
});

export default function Budget() {
  return <ResourcePage resource="costs" title="Budget & Costs" addLabel="Record cost" searchKeys={["item", "supplier", "category"]} fields={costFields} columns={costColumns}
    header={({ d, projectId }) => <div className="space-y-3"><BudgetBars d={d} projectId={projectId} /></div>} />;
}
