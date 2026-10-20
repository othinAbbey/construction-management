import { Shell, Form, Del, Empty } from "../components/ui";
import { usePM, today } from "../lib/pm";

export default function Logs() {
  const { d, add, del, nameOf } = usePM();
  return (
    <Shell title="Daily Site Logs">
      <Form cta="Save log" onSubmit={(v) => add("logs", v)} fields={[
        { k: "project", label: "Project", req: true, options: d.projects.map((p) => ({ v: p.id, l: p.name })) },
        { k: "date", label: "Date", type: "date", def: today() }, { k: "weather", label: "Weather", options: ["Sunny", "Cloudy", "Rain", "Stopped by weather"].map((s) => ({ v: s, l: s })) },
        { k: "workers", label: "Workers on site", type: "number" }, { k: "work", label: "Work done", req: true },
        { k: "delays", label: "Delays / problems" }, { k: "visitors", label: "Visitors / inspections" }, { k: "safety", label: "Safety incidents" },
      ]} />
      {!d.logs.length ? <Empty>No logs yet.</Empty> : [...d.logs].sort((a, b) => (b.date || "").localeCompare(a.date || "")).map((l) => (
        <div key={l.id} className="bg-white border rounded-lg p-4 text-sm space-y-1">
          <div className="flex justify-between"><b>{l.date} - {nameOf(l.project)}</b><Del onClick={() => del("logs", l.id)} /></div>
          <div className="text-gray-500">{l.weather || "-"} | {l.workers || 0} workers</div>
          <div>{l.work}</div>
          {l.delays && <div className="text-amber-700">Delays: {l.delays}</div>}
          {l.visitors && <div>Visitors: {l.visitors}</div>}
          {l.safety && <div className="text-red-600">Safety: {l.safety}</div>}
        </div>
      ))}
    </Shell>
  );
}
