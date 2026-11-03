import ResourcePage from "../../components/pm/ResourcePage";
import { today } from "../../lib/pm";

export const logFields = ({ d, projectId }) => [
  { k: "project", label: "Project", req: true, def: projectId, options: d.projects.map((p) => ({ v: p.id, l: p.name })) },
  { k: "date", label: "Date", type: "date", def: today() },
  { k: "weather", label: "Weather", options: ["Sunny", "Cloudy", "Rain", "Stopped by weather"].map((s) => ({ v: s, l: s })) },
  { k: "workers", label: "Workers on site", type: "number" }, { k: "work", label: "Work done", req: true },
  { k: "delays", label: "Delays / problems" }, { k: "visitors", label: "Visitors / inspections" }, { k: "safety", label: "Safety incidents" },
];
export const logColumns = ({ nameOf }) => [
  { key: "date", label: "Date" }, { key: "project", label: "Project", value: (r) => nameOf(r.project) }, { key: "weather", label: "Weather" },
  { key: "workers", label: "Workers", align: "right" }, { key: "work", label: "Work done" },
  { key: "delays", label: "Delays", render: (r) => r.delays && <span className="text-amber-700">{r.delays}</span> },
  { key: "safety", label: "Safety", render: (r) => r.safety && <span className="text-red-600">{r.safety}</span> },
];

export default function Logs() {
  return <ResourcePage resource="logs" title="Site Logs" addLabel="New log" searchKeys={["work", "delays", "visitors", "safety"]} fields={logFields} columns={logColumns} />;
}
