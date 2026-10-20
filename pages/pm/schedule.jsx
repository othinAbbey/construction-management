import { useState } from "react";
import { Shell, Empty } from "../../components/pm/ui";
import { usePM } from "../../lib/pm";

const DAY = 86400000;
export default function Schedule() {
  const { d, error } = usePM();
  const [pid, setPid] = useState("");
  const tasks = d.tasks.filter((t) => t.start && t.due && (!pid || t.project === pid));
  const t0 = Math.min(...tasks.map((t) => +new Date(t.start)));
  const t1 = Math.max(...tasks.map((t) => +new Date(t.due)));
  const span = Math.max(DAY, t1 - t0 + DAY);
  const nowPct = ((Date.now() - t0) / span) * 100;
  return (
    <Shell title="Schedule (Gantt)" error={error}>
      <select value={pid} onChange={(e) => setPid(e.target.value)} className="border rounded px-2 py-1.5 bg-white">
        <option value="">All projects</option>{d.projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      {!tasks.length ? <Empty>Tasks need a start and due date to appear here.</Empty> : (
        <div className="bg-white border rounded-lg p-4 overflow-x-auto">
          <div className="min-w-[640px] relative space-y-2">
            {nowPct >= 0 && nowPct <= 100 && <div className="absolute top-0 bottom-0 w-px bg-red-400" style={{ left: `calc(10rem + (100% - 10rem) * ${nowPct / 100})` }} title="Today" />}
            {tasks.sort((a, b) => a.start.localeCompare(b.start)).map((t) => (
              <div key={t.id} className="flex items-center text-xs">
                <div className="w-40 truncate pr-2" title={t.title}>{t.title}</div>
                <div className="flex-1 relative h-5 bg-gray-100 rounded">
                  <div className={`absolute h-5 rounded ${t.status === "done" ? "bg-green-500" : t.status === "doing" ? "bg-amber-500" : "bg-gray-400"}`}
                    style={{ left: `${((+new Date(t.start) - t0) / span) * 100}%`, width: `${Math.max(1, ((+new Date(t.due) - +new Date(t.start) + DAY) / span) * 100)}%` }} />
                </div>
              </div>
            ))}
            <div className="flex justify-between text-xs text-gray-500 pl-40"><span>{new Date(t0).toISOString().slice(0, 10)}</span><span>{new Date(t1).toISOString().slice(0, 10)}</span></div>
          </div>
        </div>
      )}
    </Shell>
  );
}
