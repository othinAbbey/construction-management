import { useEffect, useState } from "react";
import { api, when } from "../../lib/pm";
import { Bar, Btn, Select } from "./ui";

/** The stages of a bid, in order (the API sends the same list). */
export const STAGES = [["not_started", "Not started"], ["documents", "Getting the bid documents"], ["site_visit", "Site visit / pre-bid meeting"],
  ["preparing", "Preparing documents"], ["pricing", "Pricing the BOQ"], ["review", "Internal review"], ["submitted", "Bid submitted"]];
const STAGE_INDEX = Object.fromEntries(STAGES.map(([k], i) => [k, i]));
const STATUS_LABEL = { todo: "To do", doing: "In progress", done: "Done" };
const REQ_TONE = { done: "bg-green-100 text-green-800", na: "bg-gray-100 text-gray-500", pending: "bg-amber-50 text-amber-800" };

/** A small progress bar with the share of requirements done, or "no checklist yet". */
export function ProgressCell({ task }) {
  const r = task.requirements || { total: 0, done: 0 };
  if (task.progress === null || task.progress === undefined) return <span className="text-xs text-gray-400">No checklist yet</span>;
  return (
    <div className="min-w-[9rem]">
      <div className="flex justify-between text-xs text-gray-600"><span>{task.progress}%</span><span>{r.done} of {r.total} requirements</span></div>
      <Bar pct={task.progress} color={task.progress === 100 ? "bg-green-500" : task.overdue ? "bg-red-500" : "bg-yellow-500"} />
    </div>
  );
}

/** The bid's stages as steps, the current one highlighted. */
export function StageSteps({ stage }) {
  const at = STAGE_INDEX[stage || "not_started"] ?? 0;
  return (
    <ol className="flex flex-wrap gap-1 text-[11px]">
      {STAGES.slice(1).map(([k, l], i) => (
        <li key={k} className={`rounded-full px-2 py-0.5 ${i + 1 < at ? "bg-green-100 text-green-800" : i + 1 === at ? "bg-yellow-400 text-black font-semibold" : "bg-gray-100 text-gray-500"}`}>{l}</li>
      ))}
    </ol>
  );
}

/** Pasted bid-document text in, a list of requirements out; the person ticks the ones to add. */
function ReadRequirements({ task, onAdded }) {
  const [text, setText] = useState("");
  const [found, setFound] = useState(null);
  const [pick, setPick] = useState(new Set());
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function read() {
    setBusy(true); setErr("");
    try {
      const r = await api(`/api/tender_tasks/${task.id}/read_requirements`, { method: "POST", body: { text } });
      setFound(r.items); setPick(new Set(r.items.map((x, i) => (x.already ? null : i)).filter((i) => i !== null)));
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  async function add() {
    setBusy(true); setErr("");
    try {
      const items = found.filter((_, i) => pick.has(i)).map(({ text: t, category }) => ({ text: t, category }));
      onAdded(await api(`/api/tender_tasks/${task.id}/requirements`, { method: "POST", body: { items, source: "reader" } }));
      setFound(null); setText("");
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  return (
    <details className="rounded-lg border bg-gray-50 p-3 text-sm">
      <summary className="cursor-pointer font-medium text-gray-800">List the requirements from the bid document</summary>
      <p className="mt-2 text-xs text-gray-600">Paste the <b>instructions to bidders</b> and <b>qualification requirements</b> sections. The app lists what the tender asks for, and you choose what goes on the checklist. In the next version the AI assistant will read the whole document for you, PDF included.</p>
      {err && <div className="mt-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2">{err}</div>}
      {!found ? (
        <>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={7} className="mt-2 w-full rounded-md border border-gray-300 bg-white p-2 text-sm" placeholder={"e.g.\n1. A certified copy of the certificate of incorporation\n2. Bid security of UGX 5,000,000\n..."} />
          <Btn type="button" disabled={busy || text.trim().length < 20} onClick={read}>{busy ? "Reading..." : "Find requirements"}</Btn>
        </>
      ) : !found.length ? (
        <div className="mt-2 space-y-2"><p className="text-sm text-gray-600">No requirements found in that text. Try pasting the numbered list of requirements, or add them one by one below.</p><Btn type="button" kind="secondary" onClick={() => setFound(null)}>Try other text</Btn></div>
      ) : (
        <div className="mt-2 space-y-2">
          <div className="text-xs text-gray-600">{found.length} found. Untick any you don't need.</div>
          <ul className="max-h-72 overflow-y-auto divide-y rounded-md border bg-white">
            {found.map((x, i) => (
              <li key={i} className="flex items-start gap-2 p-2">
                <input type="checkbox" className="mt-1" checked={pick.has(i)} disabled={x.already} onChange={() => setPick((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; })} />
                <div className="flex-1"><div className={x.already ? "text-gray-400" : ""}>{x.text}</div><div className="text-[11px] text-gray-500">{x.category}{x.already ? " · already on the checklist" : ""}</div></div>
              </li>
            ))}
          </ul>
          <div className="flex gap-2"><Btn type="button" disabled={busy || !pick.size} onClick={add}>Add {pick.size} to the checklist</Btn><Btn type="button" kind="secondary" onClick={() => setFound(null)}>Back</Btn></div>
        </div>
      )}
    </details>
  );
}

/**
 * One task: where the bid stands, the requirements checklist, and the progress notes.
 * The person it is assigned to (and whoever assigns tasks) can change it; directors and administrators see it read-only.
 */
export function TaskDetail({ id, onClose, onChanged }) {
  const [t, setT] = useState(null);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [stage, setStage] = useState("");
  const [newReq, setNewReq] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { api(`/api/tender_tasks/${id}`).then(setT).catch((e) => setErr(e.message)); }, [id]);
  const run = async (p) => { setBusy(true); setErr(""); try { setT(await p); onChanged?.(); return true; } catch (e) { setErr(e.message); return false; } finally { setBusy(false); } };
  const setReq = (r, body) => run(api(`/api/tender_requirements/${r.id}`, { method: "PATCH", body }));
  const groups = {}; for (const r of t?.checklist || []) (groups[r.category || "Other"] ||= []).push(r);

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/40" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-xl space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">{t?.title || "Task"}</h2>
            {t && <p className="text-sm text-gray-500">{t.tender_title}{t.tender_buyer ? ` · ${t.tender_buyer}` : ""} · assigned to <b>{t.assignee_name || t.assignee_email}</b></p>}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl leading-none" aria-label="Close">&times;</button>
        </div>
        {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{err}</div>}
        {!t ? <p className="text-sm text-gray-500">Loading...</p> : (
          <>
            <div className="grid gap-3 sm:grid-cols-3 text-sm">
              <div className="rounded-lg bg-gray-50 p-3"><div className="text-xs text-gray-500">Status</div><b>{STATUS_LABEL[t.status]}</b></div>
              <div className={`rounded-lg p-3 ${t.overdue ? "bg-red-50" : "bg-gray-50"}`}><div className="text-xs text-gray-500">Due</div><b className={t.overdue ? "text-red-700" : ""}>{t.due ? String(t.due).slice(0, 10) : "no date"}{t.overdue ? " (overdue)" : ""}</b></div>
              <div className="rounded-lg bg-gray-50 p-3"><div className="text-xs text-gray-500">Tender closes</div><b>{t.tender_deadline ? String(t.tender_deadline).slice(0, 10) : "not listed"}</b></div>
            </div>

            <section className="space-y-2">
              <h3 className="font-semibold">Where the bid stands</h3>
              <StageSteps stage={t.stage} />
              <ProgressCell task={t} />
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold">Requirements checklist</h3>
              {!t.checklist.length && <p className="text-sm text-gray-500">{t.can_edit ? "No requirements yet. List them from the bid document, or add them one by one." : "No requirements listed yet."}</p>}
              {Object.entries(groups).map(([g, items]) => (
                <div key={g}>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mt-2">{g}</div>
                  <ul className="divide-y rounded-lg border">
                    {items.map((r) => (
                      <li key={r.id} className="p-2.5 text-sm flex items-start gap-2">
                        <input type="checkbox" className="mt-1" aria-label="Done" checked={r.status === "done"} disabled={!t.can_edit || busy || r.status === "na"} onChange={() => setReq(r, { status: r.status === "done" ? "pending" : "done" })} />
                        <div className="flex-1 min-w-0">
                          <div className={r.status === "na" ? "line-through text-gray-400" : r.status === "done" ? "text-gray-600" : ""}>{r.text}</div>
                          <div className="text-[11px] text-gray-500 flex flex-wrap gap-2">
                            <span className={`rounded px-1.5 ${REQ_TONE[r.status]}`}>{r.status === "na" ? "not applicable" : r.status}</span>
                            {r.status === "done" && r.done_by_name && <span>by {r.done_by_name || r.done_by_email}, {when(r.done_at)}</span>}
                            {r.source === "reader" && <span>found in the bid document</span>}
                            {r.note && <span className="text-gray-700">Note: {r.note}</span>}
                          </div>
                        </div>
                        {t.can_edit && (
                          <div className="flex flex-col items-end gap-0.5 text-[11px]">
                            <button className="text-blue-700 hover:underline" onClick={() => { const n = prompt("Note for this requirement:", r.note || ""); if (n !== null) setReq(r, { note: n }); }}>Note</button>
                            <button className="text-gray-600 hover:underline" onClick={() => setReq(r, { status: r.status === "na" ? "pending" : "na" })}>{r.status === "na" ? "Applies" : "N/A"}</button>
                            <button className="text-red-600 hover:underline" onClick={() => confirm("Remove this requirement?") && run(api(`/api/tender_requirements/${r.id}`, { method: "DELETE" }))}>Remove</button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {t.can_edit && (
                <>
                  <form className="flex gap-2" onSubmit={async (e) => { e.preventDefault(); if (await run(api(`/api/tender_tasks/${t.id}/requirements`, { method: "POST", body: { text: newReq } }))) setNewReq(""); }}>
                    <input value={newReq} onChange={(e) => setNewReq(e.target.value)} placeholder="Add a requirement, e.g. Tax clearance certificate" className="flex-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-sm" />
                    <Btn disabled={busy || !newReq.trim()}>Add</Btn>
                  </form>
                  <ReadRequirements task={t} onAdded={(d) => { setT(d); onChanged?.(); }} />
                </>
              )}
            </section>

            <section className="space-y-2">
              <h3 className="font-semibold">Progress notes</h3>
              {t.can_edit && (
                <form className="space-y-2 rounded-lg border p-3" onSubmit={async (e) => { e.preventDefault(); if (await run(api(`/api/tender_tasks/${t.id}/updates`, { method: "POST", body: { body: note, stage: stage || undefined } }))) { setNote(""); setStage(""); } }}>
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="w-full rounded-md border border-gray-300 p-2 text-sm" placeholder="What has happened? e.g. Bought the bid documents; site visit booked for Tuesday." />
                  <div className="flex flex-wrap items-end gap-2">
                    <div className="flex-1 min-w-[14rem]"><Select label="Move the bid to (optional)" value={stage} blank="Keep the current stage" onChange={setStage} options={STAGES.map(([v, l]) => ({ v, l }))} /></div>
                    <Btn disabled={busy || (!note.trim() && !stage)}>Post update</Btn>
                  </div>
                </form>
              )}
              {!t.updates.length ? <p className="text-sm text-gray-500">No progress notes yet.</p> : (
                <ul className="space-y-2">
                  {t.updates.map((u) => (
                    <li key={u.id} className="rounded-lg bg-gray-50 p-3 text-sm"><div className="whitespace-pre-wrap">{u.body}</div><div className="mt-1 text-[11px] text-gray-500">{u.by_name || u.by_email || "someone"} · {when(u.created)}</div></li>
                  ))}
                </ul>
              )}
            </section>
            {!t.can_edit && <p className="text-xs text-gray-500">You can see this task because you oversee company work or are copied on it. Only the person it is assigned to, or whoever assigns tasks, can change it.</p>}
          </>
        )}
      </div>
    </div>
  );
}
