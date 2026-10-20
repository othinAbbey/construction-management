import Link from "next/link";
import ResourcePage from "../../components/pm/ResourcePage";
import { money } from "../../lib/pm";

const STATUS = ["planning", "active", "on hold", "complete"];

export default function Projects() {
  return (
    <ResourcePage resource="projects" title="Projects" addLabel="New project" searchKeys={["name", "client", "location", "manager"]}
      fields={() => [
        { k: "name", label: "Project name", req: true }, { k: "client", label: "Client" }, { k: "location", label: "Location" },
        { k: "budget", label: "Budget", type: "number" }, { k: "start", label: "Start", type: "date" }, { k: "end", label: "Planned finish", type: "date" },
        { k: "manager", label: "Project manager" }, { k: "status", label: "Status", def: "planning", options: STATUS.map((s) => ({ v: s, l: s })) },
      ]}
      columns={({ upd, canWrite }) => [
        { key: "name", label: "Project", render: (r) => <Link href={`/pm/projects/${r.id}`} className="font-medium text-blue-700 hover:underline">{r.name}</Link> },
        { key: "client", label: "Client" }, { key: "location", label: "Location" },
        { key: "budget", label: "Budget", align: "right", render: (r) => money(r.budget), csv: (r) => r.budget },
        { key: "start", label: "Start" }, { key: "end", label: "Finish" }, { key: "manager", label: "Manager" },
        { key: "status", label: "Status", render: (r) => canWrite
          ? <select value={r.status || ""} onChange={(e) => upd("projects", r.id, { status: e.target.value })} className="border rounded px-1 py-0.5 text-xs">{STATUS.map((s) => <option key={s}>{s}</option>)}</select> : r.status, csv: (r) => r.status },
      ]} />
  );
}
