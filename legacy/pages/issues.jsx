import { Shell, Card, Bar, Empty, Form, Del } from "../components/ui";
import { usePM } from "../lib/pm";

const TYPES = ["RFI", "Issue", "Defect / snag", "Risk", "Change request"];
const STATUS = ["open", "in review", "closed"];
export default function Issues() {
  const { d, add, upd, del, nameOf } = usePM();
  return (
    <Shell title="Issues, RFIs, Defects & Risks">
      <Form cta="Log item" onSubmit={(v) => add("issues", { ...v, status: "open" })} fields={[
        { k: "project", label: "Project", req: true, options: d.projects.map((p) => ({ v: p.id, l: p.name })) },
        { k: "type", label: "Type", def: "Issue", options: TYPES.map((t) => ({ v: t, l: t })) },
        { k: "title", label: "Title", req: true }, { k: "owner", label: "Responsible" },
        { k: "severity", label: "Severity", def: "medium", options: ["low", "medium", "high"].map((s) => ({ v: s, l: s })) }, { k: "due", label: "Response due", type: "date" },
        { k: "detail", label: "Details" }, { k: "cost", label: "Cost impact", type: "number" },
      ]} />
      {!d.issues.length ? <Empty>Nothing logged.</Empty> : (
        <div className="bg-white border rounded-lg overflow-x-auto">
          <table className="w-full text-sm"><thead className="bg-gray-100 text-left"><tr>{["Type", "Title", "Project", "Owner", "Severity", "Due", "Status", ""].map((h) => <th key={h} className="p-2">{h}</th>)}</tr></thead>
            <tbody>{d.issues.map((i) => (
              <tr key={i.id} className="border-t align-top"><td className="p-2">{i.type}</td><td className="p-2"><b>{i.title}</b><div className="text-xs text-gray-500">{i.detail}</div></td><td className="p-2">{nameOf(i.project)}</td><td className="p-2">{i.owner}</td>
                <td className={`p-2 ${i.severity === "high" ? "text-red-600 font-semibold" : ""}`}>{i.severity}</td><td className="p-2">{i.due}</td>
                <td className="p-2"><select value={i.status} onChange={(e) => upd("issues", i.id, { status: e.target.value })} className="border rounded px-1">{STATUS.map((s) => <option key={s}>{s}</option>)}</select></td>
                <td className="p-2"><Del onClick={() => del("issues", i.id)} /></td></tr>
            ))}</tbody></table>
        </div>
      )}
    </Shell>
  );
}
