import ResourcePage from "../../components/pm/ResourcePage";

const TYPES = ["RFI", "Issue", "Defect / snag", "Risk", "Change request"];
const STATUS = ["open", "in review", "closed"];
const LEVEL = ["low", "medium", "high"];

export const issueFields = ({ d, projectId }) => [
  { k: "project", label: "Project", req: true, def: projectId, options: d.projects.map((p) => ({ v: p.id, l: p.name })) },
  { k: "type", label: "Type", def: "Issue", options: TYPES.map((t) => ({ v: t, l: t })) },
  { k: "title", label: "Title", req: true }, { k: "owner", label: "Responsible" },
  { k: "severity", label: "Severity", def: "medium", options: LEVEL.map((s) => ({ v: s, l: s })) }, { k: "due", label: "Response due", type: "date" },
  { k: "status", label: "Status", def: "open", options: STATUS.map((s) => ({ v: s, l: s })) },
  { k: "detail", label: "Details" }, { k: "cost", label: "Cost impact", type: "number" },
];
export const issueColumns = ({ nameOf, upd, canWrite }) => [
  { key: "type", label: "Type" },
  { key: "title", label: "Title", render: (r) => <><b>{r.title}</b><div className="text-xs text-gray-500">{r.detail}</div></>, csv: (r) => r.title },
  { key: "project", label: "Project", value: (r) => nameOf(r.project) }, { key: "owner", label: "Owner" },
  { key: "severity", label: "Severity", render: (r) => <span className={r.severity === "high" ? "text-red-600 font-semibold" : ""}>{r.severity}</span>, csv: (r) => r.severity },
  { key: "due", label: "Due" },
  { key: "status", label: "Status", render: (r) => canWrite
    ? <select value={r.status} onChange={(e) => upd("issues", r.id, { status: e.target.value })} className="border rounded px-1 py-0.5 text-xs">{STATUS.map((s) => <option key={s}>{s}</option>)}</select> : r.status, csv: (r) => r.status },
];

export default function Issues() {
  return <ResourcePage resource="issues" title="Issues, RFIs, Defects & Risks" addLabel="Log item" searchKeys={["title", "detail", "owner", "type"]} fields={issueFields} columns={issueColumns} />;
}
