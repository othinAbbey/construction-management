import { Shell, Card, Bar, Empty, Form, Del } from "../components/ui";

import { usePM, money } from "../lib/pm";

const CATS = ["Materials", "Labour", "Equipment", "Subcontractor", "Transport", "Permits", "Other"];
export default function Budget() {
  const { d, add, del, nameOf } = usePM();
  return (
    <Shell title="Budget & Costs">
      <Form cta="Record cost" onSubmit={(v) => add("costs", v)} fields={[
        { k: "project", label: "Project", req: true, options: d.projects.map((p) => ({ v: p.id, l: p.name })) },
        { k: "category", label: "Category", def: "Materials", options: CATS.map((c) => ({ v: c, l: c })) },
        { k: "item", label: "Description", req: true }, { k: "amount", label: "Amount", type: "number", req: true },
        { k: "date", label: "Date", type: "date" }, { k: "supplier", label: "Supplier / payee" },
      ]} />
      {d.projects.map((p) => {
        const cs = d.costs.filter((c) => c.project === p.id);
        const spent = cs.reduce((s, c) => s + Number(c.amount), 0), b = Number(p.budget || 0);
        return (
          <div key={p.id} className="bg-white border rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm"><b>{p.name}</b><span className={spent > b && b ? "text-red-600 font-semibold" : ""}>{money(spent)} / {money(b)} (remaining {money(b - spent)})</span></div>
            <Bar pct={b ? (spent / b) * 100 : 0} color={spent > b && b ? "bg-red-500" : "bg-amber-500"} />
          </div>
        );
      })}
      {!d.costs.length ? <Empty>No costs recorded yet.</Empty> : (
        <div className="bg-white border rounded-lg overflow-x-auto">
          <table className="w-full text-sm"><thead className="bg-gray-100 text-left"><tr>{["Date", "Project", "Category", "Description", "Payee", "Amount", ""].map((h) => <th key={h} className="p-2">{h}</th>)}</tr></thead>
            <tbody>{d.costs.map((c) => (
              <tr key={c.id} className="border-t"><td className="p-2">{c.date}</td><td className="p-2">{nameOf(c.project)}</td><td className="p-2">{c.category}</td><td className="p-2">{c.item}</td><td className="p-2">{c.supplier}</td><td className="p-2 text-right">{money(c.amount)}</td><td className="p-2"><Del onClick={() => del("costs", c.id)} /></td></tr>
            ))}</tbody></table>
        </div>
      )}
    </Shell>
  );
}
