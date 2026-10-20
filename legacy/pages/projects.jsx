import { Shell, Form, Del, Empty } from "../components/ui";
import { usePM, money } from "../lib/pm";

const STATUS = ["planning", "active", "on hold", "complete"];
export default function Projects() {
  const { d, add, upd, del } = usePM();
  return (
    <Shell title="Projects">
      <Form cta="Add project" onSubmit={(v) => add("projects", v)} fields={[
        { k: "name", label: "Project name", req: true }, { k: "client", label: "Client" }, { k: "location", label: "Location" },
        { k: "budget", label: "Budget", type: "number" }, { k: "start", label: "Start", type: "date" }, { k: "end", label: "Planned finish", type: "date" },
        { k: "manager", label: "Project manager" }, { k: "status", label: "Status", def: "planning", options: STATUS.map((s) => ({ v: s, l: s })) },
      ]} />
      {!d.projects.length ? <Empty>No projects yet.</Empty> : (
        <div className="grid md:grid-cols-2 gap-3">
          {d.projects.map((p) => (
            <div key={p.id} className="bg-white border rounded-lg p-4 space-y-1 text-sm">
              <div className="flex justify-between"><b className="text-lg">{p.name}</b><Del onClick={() => del("projects", p.id)} /></div>
              <div className="text-gray-500">{[p.client, p.location].filter(Boolean).join(" - ")}</div>
              <div>Budget: {money(p.budget)} | {p.start || "?"} to {p.end || "?"} | PM: {p.manager || "-"}</div>
              <select value={p.status} onChange={(e) => upd("projects", p.id, { status: e.target.value })} className="border rounded px-2 py-1">
                {STATUS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </Shell>
  );
}
