import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FilesPanel from "../../../components/pm/FilesPanel";
import ProjectSummary from "../../../components/pm/ProjectSummary";
import ResourcePage from "../../../components/pm/ResourcePage";
import { Btn, Health, Shell } from "../../../components/pm/ui";
import { costColumns, costFields } from "../budget";
import { issueColumns, issueFields } from "../issues";
import { logColumns, logFields } from "../logs";
import { taskColumns, taskFields } from "../tasks";
import { api } from "../../../lib/pm";

const TABS = [["overview", "Overview"], ["tasks", "Tasks"], ["costs", "Costs"], ["logs", "Site logs"], ["issues", "Issues"], ["files", "Documents"]];
const PAGES = {
  tasks: { title: "Task", fields: taskFields, columns: taskColumns, search: ["title", "assignee"], add: "New task" },
  costs: { title: "Cost", fields: costFields, columns: costColumns, search: ["item", "supplier"], add: "Record cost" },
  logs: { title: "Log", fields: logFields, columns: logColumns, search: ["work", "delays"], add: "New log" },
  issues: { title: "Issue", fields: issueFields, columns: issueColumns, search: ["title", "detail"], add: "Log item" },
};

export default function ProjectHub() {
  const { query } = useRouter();
  const id = query.id;
  const [tab, setTab] = useState("overview");
  const [s, setS] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => { if (id) api(`/api/projects/${id}/summary`).then((x) => { setS(x); setErr(""); }).catch((e) => setErr(e.message)); }, [id, tab]);
  const page = PAGES[tab];

  return (
    <Shell title={s?.project.name || "Project"} error={err}
      actions={<><Link href="/pm/projects" className="text-sm text-gray-600 hover:text-black self-center">&larr; All projects</Link>{s && <Health level={s.health} />}{tab === "overview" && s && <Btn kind="secondary" onClick={() => window.print()}>Print</Btn>}</>}>
      <div className="flex gap-1 border-b overflow-x-auto print:hidden">
        {TABS.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 whitespace-nowrap ${tab === k ? "border-yellow-500 text-black" : "border-transparent text-gray-500 hover:text-black"}`}>{l}</button>)}
      </div>
      {id && tab === "overview" && s && <ProjectSummary s={s} />}
      {id && page && <ResourcePage key={tab} embedded fixedProject={id} resource={tab} title={page.title} addLabel={page.add} searchKeys={page.search} fields={page.fields} columns={page.columns} />}
      {id && tab === "files" && <FilesPanel project={id} />}
    </Shell>
  );
}
