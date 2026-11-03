import { useRef, useState } from "react";
import { addDays, dayOfWeek, daysBetween, monthLabel, shortDate, todayIso } from "../../lib/dates";

const ROW = 34, HEAD = 48;
const PPD = { day: 28, week: 12, month: 4 };            // pixels per calendar day at each zoom level
const COLS = [["WBS", 52], ["Task", 230], ["Dur", 48], ["Start", 66], ["Finish", 66], ["%", 44], ["Pred.", 96]];
const LEFT = COLS.reduce((n, [, w]) => n + w, 0);

/** Tasks that are not hidden inside a collapsed summary task. */
export function visibleTasks(tasks, collapsed) {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const hidden = (t) => { for (let up = t.parent && byId.get(t.parent), g = 0; up && g < 50; up = up.parent && byId.get(up.parent), g++) if (collapsed.has(up.id)) return true; return false; };
  return tasks.filter((t) => !hidden(t));
}

/** "2FS+3, 5SS" using outline numbers. */
function predText(task, links, wbsOf) {
  return links.filter((l) => l.successor === task.id).map((l) => `${wbsOf.get(l.predecessor) || "?"}${l.type === "FS" && !l.lag ? "" : l.type}${l.lag ? (l.lag > 0 ? "+" : "") + l.lag : ""}`).join(", ");
}

/**
 * MS Project style Gantt: outline table on the left, timeline on the right.
 * Bars show percent complete; red = critical path; thin grey bar = baseline; diamonds = milestones; arrows = links.
 * Drag a bar to move it, drag its right edge to change its length (only when you may edit).
 */
export default function Gantt({ data, zoom = "week", showCritical = true, showBaseline = true, selectedId, collapsed, onToggle, onSelect, onOpen, onMove, onResize, canWrite }) {
  const ppd = PPD[zoom];
  const all = data.tasks, tasks = visibleTasks(all, collapsed);
  const rowOf = new Map(tasks.map((t, i) => [t.id, i]));
  const wbsOf = new Map(all.map((t) => [t.id, t.wbs]));

  const dates = all.flatMap((t) => [t.scheduled_start, t.scheduled_finish, t.baseline_start, t.baseline_end]).filter(Boolean);
  const first = dates.length ? dates.reduce((a, b) => (a < b ? a : b)) : todayIso(), last = dates.length ? dates.reduce((a, b) => (a > b ? a : b)) : todayIso();
  const min = addDays(first, -3), max = daysBetween(min, addDays(last, 10)) < 30 ? addDays(min, 30) : addDays(last, 10);
  const total = daysBetween(min, max) + 1, W = total * ppd, H = HEAD + tasks.length * ROW;
  const x = (d) => daysBetween(min, d) * ppd;
  const today = todayIso(), todayX = today >= min && today <= max ? x(today) + ppd / 2 : null;

  // header: months on top; days or week starts below
  const months = [];
  for (let i = 0; i < total; i++) {
    const d = addDays(min, i), label = monthLabel(d), m = months[months.length - 1];
    if (m && m.label === label) m.days++; else months.push({ label, days: 1, start: i });
  }
  const ticks = [];
  if (zoom === "day") for (let i = 0; i < total; i++) { const d = addDays(min, i); ticks.push({ x: i * ppd, label: d.slice(8), weekend: [0, 6].includes(dayOfWeek(d)), w: ppd }); }
  if (zoom === "week") for (let i = 0; i < total; i++) { const d = addDays(min, i); if (dayOfWeek(d) === 1) ticks.push({ x: i * ppd, label: shortDate(d), w: 7 * ppd }); }

  // dragging uses a ref for the logic and state only to redraw
  const drag = useRef(null);
  const [live, setLive] = useState({ id: null, mode: null, dx: 0 });
  function start(e, task, mode) {
    if (!canWrite || task.summary) { onSelect(task.id); return; }
    e.preventDefault(); e.stopPropagation();
    drag.current = { task, mode, x0: e.clientX, dx: 0 };
    setLive({ id: task.id, mode, dx: 0 });
    const move = (ev) => { if (!drag.current) return; drag.current.dx = ev.clientX - drag.current.x0; setLive({ id: task.id, mode, dx: drag.current.dx }); };
    const up = () => {
      window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up);
      const d = drag.current; drag.current = null; setLive({ id: null, mode: null, dx: 0 });
      if (!d) return;
      const delta = Math.round(d.dx / ppd);
      if (Math.abs(d.dx) < 4) onSelect(d.task.id); else if (delta !== 0) (d.mode === "move" ? onMove : onResize)(d.task, delta);
    };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  }

  // dependency arrows
  const arrows = data.links.map((l) => {
    const a = rowOf.get(l.predecessor), b = rowOf.get(l.successor);
    if (a === undefined || b === undefined) return null;
    const p = all.find((t) => t.id === l.predecessor), s = all.find((t) => t.id === l.successor);
    const fromEnd = l.type === "FS" || l.type === "FF", toEnd = l.type === "FF" || l.type === "SF";
    const x1 = fromEnd ? x(p.scheduled_finish) + ppd : x(p.scheduled_start), x2 = toEnd ? x(s.scheduled_finish) + ppd : x(s.scheduled_start);
    const y1 = a * ROW + ROW / 2, y2 = b * ROW + ROW / 2, xm = fromEnd ? x1 + 8 : x1 - 8;
    const hot = showCritical && p.critical && s.critical;
    return { key: l.id, d: `M${x1} ${y1} H${xm} V${y2} H${x2}`, hot };
  }).filter(Boolean);

  return (
    <div className="overflow-auto border rounded-xl bg-white shadow-sm max-h-[70vh] print:max-h-none print:overflow-visible">
      <div className="flex" style={{ minWidth: LEFT + W }}>
        {/* ---------- outline table ---------- */}
        <div className="sticky left-0 z-20 bg-white border-r shrink-0" style={{ width: LEFT }}>
          <div className="flex items-end bg-gray-50 border-b text-xs font-medium text-gray-600" style={{ height: HEAD }}>
            {COLS.map(([h, w]) => <div key={h} className="px-2 pb-1 truncate" style={{ width: w }}>{h}</div>)}
          </div>
          {tasks.map((t) => (
            <div key={t.id} onClick={() => onSelect(t.id)} onDoubleClick={() => onOpen(t.id)}
              className={`flex items-center border-b text-xs cursor-pointer hover:bg-yellow-50 ${selectedId === t.id ? "bg-yellow-100" : ""}`} style={{ height: ROW }}>
              <div className="px-2 text-gray-500" style={{ width: COLS[0][1] }}>{t.wbs}</div>
              <div className={`px-2 truncate flex items-center gap-1 ${t.summary ? "font-bold" : ""} ${showCritical && t.critical && !t.summary ? "text-red-700" : ""}`} style={{ width: COLS[1][1], paddingLeft: 8 + t.level * 14 }} title={t.title}>
                {t.summary && <button onClick={(e) => { e.stopPropagation(); onToggle(t.id); }} className="text-gray-500 w-3">{collapsed.has(t.id) ? "▸" : "▾"}</button>}
                {t.milestone ? <span className="text-gray-700">◆</span> : null}<span className="truncate">{t.title}</span>
              </div>
              <div className="px-2" style={{ width: COLS[2][1] }}>{t.milestone ? "0d" : `${t.duration}d`}</div>
              <div className={`px-2 ${t.differs ? "text-amber-700" : ""}`} style={{ width: COLS[3][1] }} title={t.differs ? "Saved dates differ from the schedule" : ""}>{shortDate(t.scheduled_start)}</div>
              <div className={`px-2 ${t.differs ? "text-amber-700" : ""}`} style={{ width: COLS[4][1] }}>{shortDate(t.scheduled_finish)}</div>
              <div className="px-2" style={{ width: COLS[5][1] }}>{t.percent_complete}%</div>
              <div className="px-2 truncate text-gray-500" style={{ width: COLS[6][1] }}>{predText(t, data.links, wbsOf)}</div>
            </div>
          ))}
        </div>

        {/* ---------- timeline ---------- */}
        <div className="relative shrink-0 select-none" style={{ width: W, height: H }}>
          <div className="absolute inset-x-0 top-0 bg-gray-50 border-b" style={{ height: HEAD }}>
            {months.map((m) => <div key={m.start} className="absolute top-0 border-l px-1 text-xs font-medium text-gray-700 truncate" style={{ left: m.start * ppd, width: m.days * ppd, height: HEAD / 2 }}>{m.label}</div>)}
            {ticks.map((tk) => <div key={tk.x} className={`absolute border-l text-[10px] text-gray-500 text-center ${tk.weekend ? "bg-gray-100" : ""}`} style={{ left: tk.x, width: tk.w, top: HEAD / 2, height: HEAD / 2 }}>{tk.label}</div>)}
          </div>
          {zoom === "day" && ticks.filter((tk) => tk.weekend).map((tk) => <div key={tk.x} className="absolute bg-gray-50" style={{ left: tk.x, width: ppd, top: HEAD, bottom: 0 }} />)}
          {tasks.map((t, i) => <div key={t.id} className={`absolute inset-x-0 border-b ${selectedId === t.id ? "bg-yellow-50" : ""}`} style={{ top: HEAD + i * ROW, height: ROW }} />)}
          {todayX !== null && <div className="absolute w-px bg-red-400 z-10" style={{ left: todayX, top: HEAD, bottom: 0 }} title="Today" />}

          <svg className="absolute pointer-events-none" style={{ left: 0, top: HEAD, width: W, height: tasks.length * ROW }}>
            <defs><marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#6b7280" /></marker><marker id="arrHot" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#dc2626" /></marker></defs>
            {arrows.map((a) => <path key={a.key} d={a.d} fill="none" stroke={a.hot ? "#dc2626" : "#6b7280"} strokeWidth="1.2" markerEnd={`url(#${a.hot ? "arrHot" : "arr"})`} />)}
          </svg>

          {tasks.map((t, i) => {
            const top = HEAD + i * ROW, live_ = live.id === t.id, snap = Math.round(live.dx / ppd) * ppd;
            const left = x(t.scheduled_start) + (live_ && live.mode === "move" ? snap : 0);
            const width = Math.max(ppd, (daysBetween(t.scheduled_start, t.scheduled_finish) + 1) * ppd + (live_ && live.mode === "resize" ? snap : 0));
            const crit = showCritical && t.critical, color = t.percent_complete >= 100 ? "bg-green-600" : crit ? "bg-red-500" : "bg-yellow-500";
            return (
              <div key={t.id}>
                {showBaseline && t.baseline_start && t.baseline_end && <div className="absolute bg-gray-400 rounded-sm" style={{ left: x(t.baseline_start), width: (daysBetween(t.baseline_start, t.baseline_end) + 1) * ppd, top: top + ROW - 9, height: 4 }} title={`Baseline ${shortDate(t.baseline_start)} - ${shortDate(t.baseline_end)}`} />}
                {t.milestone ? (
                  <div onPointerDown={(e) => start(e, t, "move")} onDoubleClick={() => onOpen(t.id)} className={`absolute w-4 h-4 rotate-45 ${crit ? "bg-red-600" : "bg-gray-800"} ${canWrite ? "cursor-grab" : ""}`}
                    style={{ left: x(t.scheduled_start) + (live_ ? snap : 0) + ppd / 2 - 8, top: top + ROW / 2 - 8 }} title={`${t.title} - ${shortDate(t.scheduled_start)}`} />
                ) : t.summary ? (
                  <div className="absolute bg-gray-800 rounded-sm" style={{ left, width, top: top + 9, height: 10 }} title={`${t.title}: ${shortDate(t.scheduled_start)} - ${shortDate(t.scheduled_finish)}`}>
                    <div className="h-full bg-gray-500 rounded-sm" style={{ width: `${t.percent_complete}%` }} />
                  </div>
                ) : (
                  <div onPointerDown={(e) => start(e, t, "move")} onDoubleClick={() => onOpen(t.id)} className={`absolute rounded ${color} ${canWrite ? "cursor-grab" : "cursor-pointer"} ${selectedId === t.id ? "ring-2 ring-black" : ""}`}
                    style={{ left, width, top: top + 6, height: 16 }} title={`${t.title}\n${shortDate(t.scheduled_start)} - ${shortDate(t.scheduled_finish)}, ${t.duration}d, ${t.percent_complete}% done${t.float ? `, float ${t.float}d` : ""}`}>
                    <div className="h-full bg-black/30 rounded-l" style={{ width: `${t.percent_complete}%` }} />
                    {canWrite && <div onPointerDown={(e) => start(e, t, "resize")} className="absolute right-0 top-0 h-full w-2 cursor-ew-resize" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
