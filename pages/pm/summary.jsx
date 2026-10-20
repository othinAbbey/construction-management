import { useEffect, useState } from "react";
import ProjectSummary from "../../components/pm/ProjectSummary";
import { Shell, Btn, Empty, Health, Select, Table } from "../../components/pm/ui";
import { api, money, useApi } from "../../lib/pm";

export default function Summary() {
  const port = useApi("/api/summary");
  const [pid, setPid] = useState("");
  const [s, setS] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => { const q = new URLSearchParams(window.location.search).get("id"); if (q) setPid(q); }, []);
  useEffect(() => {
    if (!pid) { setS(null); return; }
    api(`/api/projects/${pid}/summary`).then((x) => { setS(x); setErr(""); }).catch((e) => setErr(e.message));
  }, [pid]);
  const pick = (id) => { setPid(id); window.history.replaceState(null, "", id ? `?id=${id}` : window.location.pathname); };

  const p = s?.project;
  return (
    <Shell title={p ? `${p.name} - Summary` : "Project Summary"} error={err || port.error}
      actions={s && <Btn kind="secondary" onClick={() => window.print()}>Print / save as PDF</Btn>}>
      <div className="max-w-sm print:hidden">
        <Select label="Project" value={pid} onChange={pick} blank="All projects (portfolio)" options={(port.data?.projects || []).map((x) => ({ v: x.id, l: x.name }))} />
      </div>

      {!s && (!port.data?.projects.length ? <Empty>No projects yet.</Empty> : (
        <Table head={["Project", "Status", "Health", "Progress", "Budget", "Spent", "Overdue tasks", "Open issues"]}>
          {port.data.projects.map((x) => (
            <tr key={x.id} className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => pick(x.id)}>
              <td className="p-2.5 font-medium">{x.name}</td><td className="p-2.5">{x.status || "-"}</td><td className="p-2.5"><Health level={x.health} /></td>
              <td className="p-2.5">{x.progress === null ? "-" : `${Math.round(x.progress)}%`}</td><td className="p-2.5">{money(x.budget)}</td>
              <td className={`p-2.5 ${x.spent > x.budget && x.budget ? "text-red-600 font-semibold" : ""}`}>{money(x.spent)}</td><td className="p-2.5">{x.overdue_tasks}</td><td className="p-2.5">{x.open_issues}</td>
            </tr>
          ))}
        </Table>
      ))}

      {s && <ProjectSummary s={s} />}
    </Shell>
  );
}
