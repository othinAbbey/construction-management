import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const NAV = [
  ["/", "Dashboard"], ["/projects", "Projects"], ["/tasks", "Tasks"], ["/schedule", "Schedule"],
  ["/budget", "Budget & Costs"], ["/logs", "Site Logs"], ["/issues", "Issues & RFIs"],
];

export function Shell({ title, children }) {
  const { pathname } = useRouter();
  return (
    <div className="flex flex-col md:flex-row min-h-[80vh] bg-gray-50">
      <nav className="md:w-56 bg-gray-900 text-gray-200 p-3 flex md:flex-col gap-1 overflow-x-auto">
        <div className="hidden md:block px-3 py-2 font-bold text-amber-400">Project Manager</div>
        {NAV.map(([href, label]) => (
          <Link key={href} href={href} className={`px-3 py-2 rounded whitespace-nowrap text-sm ${pathname === href ? "bg-amber-600 text-white" : "hover:bg-gray-800"}`}>{label}</Link>
        ))}
      </nav>
      <section className="flex-1 p-4 md:p-6 space-y-5 min-w-0">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {children}
      </section>
    </div>
  );
}

export const Card = ({ label, value, sub, tone = "text-gray-800" }) => (
  <div className="bg-white border rounded-lg p-4">
    <div className="text-xs uppercase text-gray-500">{label}</div>
    <div className={`text-2xl font-bold ${tone}`}>{value}</div>
    {sub && <div className="text-xs text-gray-500">{sub}</div>}
  </div>
);

export const Bar = ({ pct, color = "bg-amber-500" }) => (
  <div className="h-2 bg-gray-200 rounded"><div className={`h-2 rounded ${color}`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} /></div>
);

export const Empty = ({ children }) => <div className="text-sm text-gray-500 bg-white border border-dashed rounded-lg p-6 text-center">{children}</div>;

/** fields: [{k, label, type?, options?: [{v,l}], def?, req?}] */
export function Form({ fields, onSubmit, cta = "Add" }) {
  const init = () => Object.fromEntries(fields.map((f) => [f.k, f.def ?? ""]));
  const [v, setV] = useState(init);
  const cls = "mt-1 w-full border rounded px-2 py-1.5 text-gray-800 bg-white";
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(v); setV(init()); }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 bg-white p-4 rounded-lg border">
      {fields.map((f) => (
        <label key={f.k} className="text-sm text-gray-600">{f.label}
          {f.options ? (
            <select className={cls} required={f.req} value={v[f.k]} onChange={(e) => setV({ ...v, [f.k]: e.target.value })}>
              <option value="">-</option>{f.options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
            </select>
          ) : (
            <input className={cls} type={f.type || "text"} required={f.req} value={v[f.k]} onChange={(e) => setV({ ...v, [f.k]: e.target.value })} />
          )}
        </label>
      ))}
      <button className="bg-amber-600 hover:bg-amber-700 text-white rounded px-4 py-2 self-end">{cta}</button>
    </form>
  );
}

export const Del = ({ onClick }) => <button onClick={() => confirm("Delete this item?") && onClick()} className="text-xs text-red-600 hover:underline">Delete</button>;
