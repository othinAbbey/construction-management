import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PasswordField from "./PasswordField";
import { api, can, getToken, getUser, setUser as setUserStore } from "../../lib/pm";

/** [label, href, permission needed (optional)]. The server decides who has which permission; see /api/me. */
const NAV = [
  ["Overview", [["/pm", "Dashboard"], ["/pm/summary", "Project Summary", "projects:read"]]],
  ["Projects", [["/pm/projects", "Projects", "projects:read"], ["/pm/tasks", "Tasks", "projects:read"], ["/pm/schedule", "Schedule", "projects:read"],
    ["/pm/budget", "Budget & Costs", "projects:read"], ["/pm/logs", "Site Logs", "projects:read"], ["/pm/issues", "Issues & RFIs", "projects:read"], ["/pm/files", "Documents", "files:read"]]],
  ["Material sourcing", [["/pm/sourcing", "Material Rates", "catalog:read"], ["/pm/suppliers", "Suppliers", "catalog:read"],
    ["/pm/calculator", "Quantity Calculator", "catalog:read"], ["/pm/contribute", "Suggest Additions", "catalog:propose"]]],
  ["Estimating & business", [["/boq", "BOQ Extraction", "boq:use"], ["/pm/tenders", "Tenders", "tenders:read"]]],
  ["Administration", [["/pm/approvals", "Approvals", "proposals:review"], ["/pm/audit", "Audit Trail", "audit:read"], ["/pm/inbox", "Website Inbox", "messages:read"],
    ["/pm/roles", "Roles & Access", "roles:manage"], ["/pm/team", "Team & Security"], ["/pm/billing", "Plan & Billing", "billing:read"]]],
];

/** Page frame for every signed-in screen: sidebar, title, error banner. Refreshes your rights from the server on load. */
export function Shell({ title, children, error, actions }) {
  const { pathname } = useRouter();
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (!getToken()) { window.location.href = `/pm/login?next=${encodeURIComponent(window.location.pathname)}`; return; }
    setUser(getUser());
    api("/api/me").then((u) => { setUserStore(u); setUser(u); }).catch(() => {});
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:min-h-[calc(100vh-4.5rem)]">
      <aside className="md:w-60 md:shrink-0 bg-gray-900 text-gray-200 p-3 md:py-5 print:hidden">
        <div className="flex md:flex-col gap-x-1 gap-y-3 overflow-x-auto md:overflow-visible">
          {NAV.map(([group, items]) => {
            const shown = items.filter(([, , need]) => !need || can(user, need));
            if (!shown.length) return null;
            return (
              <div key={group} className="flex md:block items-center gap-1 shrink-0">
                <div className="hidden md:block px-3 pb-1 text-[11px] uppercase tracking-wider text-gray-500">{group}</div>
                {shown.map(([href, label]) => (
                  <Link key={href} href={href}
                    className={`block px-3 py-2 rounded-md text-sm whitespace-nowrap transition ${pathname === href ? "bg-yellow-500 text-black font-semibold" : "hover:bg-gray-800"}`}>{label}</Link>
                ))}
              </div>
            );
          })}
        </div>
        {user && <div className="hidden md:block mt-6 px-3 text-xs text-gray-500 break-all">{user.name || user.email}<br />{user.role}</div>}
      </aside>
      <section className="flex-1 min-w-0 p-4 md:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="flex gap-2 print:hidden">{actions}</div>
        </div>
        {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}
        {children}
      </section>
    </div>
  );
}

export const Card = ({ label, value, sub, tone = "text-gray-900" }) => (
  <div className="bg-white border rounded-xl p-4 shadow-sm">
    <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
    <div className={`text-2xl font-bold mt-1 ${tone}`}>{value}</div>
    {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
  </div>
);

export const Bar = ({ pct, color = "bg-yellow-500" }) => (
  <div className="h-2 bg-gray-200 rounded"><div className={`h-2 rounded ${color}`} style={{ width: `${Math.min(100, Math.max(0, pct || 0))}%` }} /></div>
);

export const Empty = ({ children }) => <div className="text-sm text-gray-500 bg-white border border-dashed rounded-xl p-6 text-center">{children}</div>;

const HEALTH = { green: ["On track", "bg-green-100 text-green-800"], amber: ["Needs attention", "bg-amber-100 text-amber-800"], red: ["At risk", "bg-red-100 text-red-700"] };
export const Health = ({ level }) => { const [t, c] = HEALTH[level] || ["-", "bg-gray-100 text-gray-600"]; return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${c}`}>{t}</span>; };

export const Panel = ({ title, children, className = "" }) => (
  <div className={`bg-white border rounded-xl p-4 shadow-sm ${className}`}>{title && <h2 className="font-semibold text-gray-800 mb-3">{title}</h2>}{children}</div>
);

const inputCls = "mt-1 w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400";
export const Select = ({ label, value, onChange, options, required, blank = "-" }) => (
  <label className="text-sm text-gray-600">{label}
    <select className={inputCls} value={value} required={required} onChange={(e) => onChange(e.target.value)}>
      {blank !== null && <option value="">{blank}</option>}
      {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  </label>
);
export const Field = ({ label, value, onChange, type = "text", required, generate, ...rest }) => type === "password"
  ? <PasswordField label={label} value={value} onChange={onChange} required={required} generate={generate} {...rest} />
  : (
    <label className="text-sm text-gray-600">{label}
      <input className={inputCls} type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} {...rest} />
    </label>
  );
export const Btn = ({ children, kind = "primary", ...p }) => (
  <button {...p} className={`rounded-md px-4 py-2 text-sm font-semibold transition disabled:opacity-50 ${kind === "primary" ? "bg-yellow-500 text-black hover:bg-yellow-400" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"} ${p.className || ""}`}>{children}</button>
);

/** fields: [{k, label, type?, options?: [{v,l}], def?, req?}] */
export function Form({ fields, onSubmit, cta = "Add", disabled }) {
  const init = () => Object.fromEntries(fields.map((f) => [f.k, f.def ?? ""]));
  const [v, setV] = useState(init);
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(v); setV(init()); }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 bg-white p-4 rounded-xl border shadow-sm">
      {fields.map((f) => f.options
        ? <Select key={f.k} label={f.label} required={f.req} value={v[f.k]} options={f.options} onChange={(x) => setV({ ...v, [f.k]: x })} />
        
        : <Field key={f.k} label={f.label} type={f.type} required={f.req} generate={f.generate} value={v[f.k]} onChange={(x) => setV({ ...v, [f.k]: x })} />)}
      <Btn disabled={disabled} className="self-end">{cta}</Btn>
    </form>
  );
}

export const Del = ({ onClick, label = "Delete" }) => <button onClick={() => confirm("Delete this item? This cannot be undone.") && onClick()} className="text-xs text-red-600 hover:underline">{label}</button>;

export const Table = ({ head, children }) => (
  <div className="bg-white border rounded-xl overflow-x-auto shadow-sm">
    <table className="w-full text-sm"><thead className="bg-gray-50 text-left text-gray-600"><tr>{head.map((h, i) => <th key={i} className="p-2.5 font-medium whitespace-nowrap">{h}</th>)}</tr></thead><tbody>{children}</tbody></table>
  </div>
);
