import { useEffect, useRef, useState } from "react";
import { api, downloadFile, sendFile, size, when } from "../../lib/pm";
import { Bar, Btn, Select } from "./ui";

/** The stages of a bid, in order (the API sends the same list). */
export const STAGES = [["not_started", "Not started"], ["documents", "Getting the bid documents"], ["site_visit", "Site visit / pre-bid meeting"],
  ["preparing", "Preparing documents"], ["pricing", "Pricing the BOQ"], ["review", "Internal review"], ["submitted", "Bid submitted"]];
const STAGE_INDEX = Object.fromEntries(STAGES.map(([k], i) => [k, i]));
const STATUS_LABEL = { todo: "To do", doing: "In progress", done: "Done" };
const REQ_TONE = { done: "bg-green-100 text-green-800", na: "bg-gray-100 text-gray-500", pending: "bg-amber-50 text-amber-800" };

/** Where the AI reading of a tender stands, as a small label. */
export const AI_LABEL = {
  queued: ["AI reading...", "bg-blue-100 text-blue-800"], reading: ["AI reading...", "bg-blue-100 text-blue-800"],
  done: ["Checklist ready", "bg-green-100 text-green-800"], needs_documents: ["Upload bid documents", "bg-amber-100 text-amber-800"], failed: ["Reading failed", "bg-red-100 text-red-700"],
};
export function AiPill({ status }) {
  const l = AI_LABEL[status]; if (!l) return null;
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${l[1]}`}>{l[0]}</span>;
}

/** A small progress bar with the share of requirements done, or "no checklist yet". */
export function ProgressCell({ task }) {
  const r = task.requirements || { total: 0, done: 0 };
  if (task.progress === null || task.progress === undefined) return <span className="text-xs text-gray-400">No checklist yet</span>;
  return (
    <div className="min-w-[9rem]">
      <div className="flex justify-between text-xs text-gray-600"><span>{task.progress}%</span>{r.total > 0 && <span>{r.done} of {r.total} requirements</span>}</div>
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
function PasteReader({ tenderId, onAdded }) {
  const [text, setText] = useState("");
  const [found, setFound] = useState(null);
  const [pick, setPick] = useState(new Set());
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function read() {
    setBusy(true); setErr("");
    try {
      const r = await api(`/api/tenders/${tenderId}/read_requirements`, { method: "POST", body: { text } });
      setFound(r.items); setPick(new Set(r.items.map((x, i) => (x.already ? null : i)).filter((i) => i !== null)));
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  async function add() {
    setBusy(true); setErr("");
    try {
      const items = found.filter((_, i) => pick.has(i)).map(({ text: t, category }) => ({ text: t, category }));
      onAdded(await api(`/api/tenders/${tenderId}/requirements`, { method: "POST", body: { items, source: "reader" } }));
      setFound(null); setText("");
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  return (
    <details className="rounded-lg border bg-gray-50 p-3 text-sm">
      <summary className="cursor-pointer font-medium text-gray-800">Paste requirements from a document</summary>
      <p className="mt-2 text-xs text-gray-600">For text you can copy (an email, a page). The app lists what it asks for, and you choose what goes on the checklist.</p>
      {err && <div className="mt-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded p-2">{err}</div>}
      {!found ? (
        <>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className="mt-2 w-full rounded-md border border-gray-300 bg-white p-2 text-sm" placeholder={"e.g.\n1. A certified copy of the certificate of incorporation\n2. Bid security of UGX 5,000,000"} />
          <Btn type="button" disabled={busy || text.trim().length < 20} onClick={read}>{busy ? "Reading..." : "Find requirements"}</Btn>
        </>
      ) : !found.length ? (
        <div className="mt-2 space-y-2"><p className="text-sm text-gray-600">No requirements found in that text.</p><Btn type="button" kind="secondary" onClick={() => setFound(null)}>Try other text</Btn></div>
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

/** What the AI found, and the button to read again. */
function AiFindings({ bid, busy, onRead }) {
  const ai = bid.ai, f = ai.found || {};
  const reading = ["queued", "reading"].includes(ai.status);
  const facts = [["Submission deadline", f.deadline], ["Bid security", f.bid_security], ["Site visit / pre-bid meeting", f.site_visit], ["How to get the bid documents", f.how_to_obtain], ["Fee for the documents", f.document_fee]].filter(([, v]) => v);
  return (
    <section className="space-y-2 rounded-xl border border-blue-200 bg-blue-50/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold flex items-center gap-2">AI reading of the bid <AiPill status={ai.status} /></h3>
        {bid.can_edit && (bid.tender.url || bid.documents.length > 0) && <Btn type="button" kind="secondary" disabled={busy || reading} onClick={onRead}>{reading ? "Reading..." : ai.status ? "Read again" : "Read with AI"}</Btn>}
      </div>
      {!ai.status && <p className="text-sm text-gray-600">{bid.tender.url ? "Not read yet. It is read by itself when the tender is marked interested, or click Read with AI." : "No link to the notice. Upload the bid documents below and they will be read."}</p>}
      {reading && <p className="text-sm text-gray-600">Reading the notice{bid.documents.length ? " and the uploaded documents" : ""}. This usually takes under a minute; the checklist fills in by itself.</p>}
      {ai.error && <p className={`text-sm ${ai.status === "failed" ? "text-red-700" : "text-amber-800"}`}>{ai.error.charAt(0).toUpperCase() + ai.error.slice(1)}</p>}
      {f.summary && <p className="text-sm text-gray-800">{f.summary}</p>}
      {facts.length > 0 && <dl className="grid gap-x-4 gap-y-1 sm:grid-cols-2 text-sm">{facts.map(([k, v]) => <div key={k}><dt className="text-xs text-gray-500">{k}</dt><dd className="font-medium">{v}</dd></div>)}</dl>}
      {(f.sources?.length > 0 || f.skipped?.length > 0) && (
        <div className="text-xs text-gray-500">
          {f.sources?.length > 0 && <>Read: {f.sources.join(", ")}. </>}
          {f.skipped?.length > 0 && <>Could not read: {f.skipped.map((s) => `${s.name} (${s.reason})`).join("; ")}. </>}
          {ai.read_at && <>{f.reader === "built-in" ? "Built-in reader" : "AI"}, {when(ai.read_at)}.</>}
        </div>
      )}
      {!ai.available && <p className="text-xs text-gray-500">The AI is not switched on for this site yet, so only notice web pages are read, with the built-in reader. An administrator can add the AI key on the server.</p>}
      <p className="text-[11px] text-gray-400">Always check the checklist against the bid documents before submitting.</p>
    </section>
  );
}

/** Bid documents uploaded by the company: bought, collected, or received by email. */
function BidDocuments({ bid, busy, setBusy, onChange, setErr }) {
  const input = useRef(null);
  async function upload(files) {
    setBusy(true); setErr("");
    try { let last; for (const file of files) last = await sendFile(`/api/tenders/${bid.tender.id}/documents?name=${encodeURIComponent(file.name)}`, file); if (last) onChange(last); }
    catch (e) { setErr(e.message); } finally { setBusy(false); if (input.current) input.current.value = ""; }
  }
  const remove = async (d) => { if (!confirm(`Remove ${d.name}?`)) return; try { onChange(await api(`/api/tender_documents/${d.id}`, { method: "DELETE" })); } catch (e) { setErr(e.message); } };
  return (
    <section className={`space-y-2 rounded-xl border p-4 ${bid.ai.status === "needs_documents" ? "border-amber-300 bg-amber-50/50" : ""}`}>
      <h3 className="font-semibold">Bid documents</h3>
      <p className="text-sm text-gray-600">If the documents had to be bought, collected from the buyer, or came by email, upload them here (PDF, Word or text). The AI reads them and adds what they ask for to the checklist.</p>
      {bid.documents.length > 0 && (
        <ul className="divide-y rounded-lg border bg-white">
          {bid.documents.map((d) => (
            <li key={d.id} className="flex items-center gap-2 p-2.5 text-sm">
              <button className="flex-1 min-w-0 truncate text-left text-blue-700 hover:underline" onClick={() => downloadFile(d, `/api/tender_documents/${d.id}/download`).catch((e) => setErr(e.message))}>{d.name}</button>
              <span className="text-xs text-gray-500 whitespace-nowrap">{size(d.size)} · {d.uploaded_by_name || d.uploaded_by_email || ""}</span>
              {bid.can_edit && <button className="text-xs text-red-600 hover:underline" onClick={() => remove(d)}>Remove</button>}
            </li>
          ))}
        </ul>
      )}
      {bid.can_edit && (
        <label className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-sm text-gray-600 hover:bg-gray-50 ${busy ? "opacity-50" : ""}`}
          onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (!busy && e.dataTransfer.files.length) upload([...e.dataTransfer.files]); }}>
          <span className="font-semibold text-gray-800">{busy ? "Uploading..." : "Upload bid documents"}</span>
          <span className="text-xs">Click or drop PDF, Word (.docx) or text files, up to 25 MB each</span>
          <input ref={input} type="file" multiple accept=".pdf,.docx,.txt" className="hidden" disabled={busy} onChange={(e) => e.target.files.length && upload([...e.target.files])} />
        </label>
      )}
    </section>
  );
}

/** The requirements checklist of a tender, grouped by kind. */
function Checklist({ bid, onChange, setErr }) {
  const [newReq, setNewReq] = useState("");
  const [busy, setBusy] = useState(false);
  const run = async (p) => { setBusy(true); setErr(""); try { onChange(await p); return true; } catch (e) { setErr(e.message); return false; } finally { setBusy(false); } };
  const setReq = (r, body) => run(api(`/api/tender_requirements/${r.id}`, { method: "PATCH", body }));
  const groups = {}; for (const r of bid.checklist) (groups[r.category || "Other"] ||= []).push(r);
  const counted = bid.checklist.filter((r) => r.status !== "na"), done = counted.filter((r) => r.status === "done").length;
  return (
    <section className="space-y-2">
      <div className="flex items-baseline justify-between gap-2"><h3 className="font-semibold">Requirements checklist</h3>{counted.length > 0 && <span className="text-sm text-gray-600">{done} of {counted.length} ready</span>}</div>
      {!bid.checklist.length && <p className="text-sm text-gray-500">{bid.can_edit ? "Nothing yet. The AI fills this in from the bid documents; you can also add items yourself." : "No requirements listed yet."}</p>}
      {Object.entries(groups).map(([g, items]) => (
        <div key={g}>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mt-2">{g}</div>
          <ul className="divide-y rounded-lg border">
            {items.map((r) => (
              <li key={r.id} className="p-2.5 text-sm flex items-start gap-2">
                <input type="checkbox" className="mt-1" aria-label="Ready" checked={r.status === "done"} disabled={!bid.can_edit || busy || r.status === "na"} onChange={() => setReq(r, { status: r.status === "done" ? "pending" : "done" })} />
                <div className="flex-1 min-w-0">
                  <div className={r.status === "na" ? "line-through text-gray-400" : r.status === "done" ? "text-gray-600" : ""}>{r.text}{r.mandatory ? <span className="ml-1 rounded bg-red-50 px-1 text-[10px] font-semibold text-red-700">mandatory</span> : null}</div>
                  <div className="text-[11px] text-gray-500 flex flex-wrap gap-2">
                    <span className={`rounded px-1.5 ${REQ_TONE[r.status]}`}>{r.status === "na" ? "not applicable" : r.status === "done" ? "ready" : "to do"}</span>
                    {r.status === "done" && (r.done_by_name || r.done_by_email) && <span>by {r.done_by_name || r.done_by_email}, {when(r.done_at)}</span>}
                    {r.source === "assistant" && <span className="text-blue-700">found by the AI{r.found_in ? ` in ${r.found_in}` : ""}</span>}
                    {r.source === "reader" && <span>found in pasted text</span>}
                    {r.note && <span className="text-gray-700">Note: {r.note}</span>}
                  </div>
                </div>
                {bid.can_edit && (
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
      {bid.can_edit && (
        <>
          <form className="flex gap-2" onSubmit={async (e) => { e.preventDefault(); if (await run(api(`/api/tenders/${bid.tender.id}/requirements`, { method: "POST", body: { text: newReq } }))) setNewReq(""); }}>
            <input value={newReq} onChange={(e) => setNewReq(e.target.value)} placeholder="Add a requirement, e.g. Tax clearance certificate" className="flex-1 rounded-md border border-gray-300 px-2.5 py-1.5 text-sm" />
            <Btn disabled={busy || !newReq.trim()}>Add</Btn>
          </form>
          <PasteReader tenderId={bid.tender.id} onAdded={onChange} />
        </>
      )}
    </section>
  );
}

/**
 * Everything about a tender's bid: the AI reading, the bid documents and the requirements checklist.
 * Refreshes by itself while the AI is reading.
 */
export function BidSection({ tenderId, onChanged }) {
  const [bid, setBid] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const load = () => api(`/api/tenders/${tenderId}/bid`).then(setBid).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, [tenderId]); // eslint-disable-line react-hooks/exhaustive-deps
  const reading = ["queued", "reading"].includes(bid?.ai?.status);
  useEffect(() => {
    if (!reading) return undefined;
    const timer = setInterval(() => api(`/api/tenders/${tenderId}/bid`).then((b) => { setBid(b); if (!["queued", "reading"].includes(b.ai.status)) onChanged?.(); }).catch(() => {}), 4000);
    return () => clearInterval(timer);
  }, [reading, tenderId]); // eslint-disable-line react-hooks/exhaustive-deps
  const changed = (b) => { setBid(b); onChanged?.(); };
  const readNow = async () => { setBusy(true); setErr(""); try { changed(await api(`/api/tenders/${tenderId}/ai_read`, { method: "POST" })); } catch (e) { setErr(e.message); } finally { setBusy(false); } };

  if (!bid) return err ? <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{err}</div> : <p className="text-sm text-gray-500">Loading the bid...</p>;
  return (
    <div className="space-y-4">
      {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{err}</div>}
      <AiFindings bid={bid} busy={busy} onRead={readNow} />
      <BidDocuments bid={bid} busy={busy} setBusy={setBusy} onChange={changed} setErr={setErr} />
      <Checklist bid={bid} onChange={changed} setErr={setErr} />
    </div>
  );
}

/** A tender's bid in a side panel (opened from the Pipeline). */
export function BidPanel({ tender, onClose, onChanged }) {
  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/40" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-2xl overflow-y-auto bg-white p-6 shadow-xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">{tender.title}</h2>
            <p className="text-sm text-gray-500">{[tender.buyer, tender.country, tender.deadline && `closes ${String(tender.deadline).slice(0, 10)}`].filter(Boolean).join(" · ")}
              {tender.url && <> · <a href={tender.url} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">notice &#8599;</a></>}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-2xl leading-none" aria-label="Close">&times;</button>
        </div>
        <BidSection tenderId={tender.id} onChanged={onChanged} />
      </div>
    </div>
  );
}

/**
 * One task: where the bid stands, the tender's bid (AI reading, documents, checklist), and the progress notes.
 * The person it is assigned to (and whoever assigns tasks) can change it; directors and administrators see it read-only.
 */
export function TaskDetail({ id, onClose, onChanged }) {
  const [t, setT] = useState(null);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [stage, setStage] = useState("");
  const [busy, setBusy] = useState(false);
  const load = () => api(`/api/tender_tasks/${id}`).then(setT).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  const run = async (p) => { setBusy(true); setErr(""); try { setT(await p); onChanged?.(); return true; } catch (e) { setErr(e.message); return false; } finally { setBusy(false); } };

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

            <BidSection tenderId={t.tender} onChanged={() => { load(); onChanged?.(); }} />

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
            {!t.can_edit && <p className="text-xs text-gray-500">You can see this task because you oversee company work or are copied on it. Only the person it is assigned to, or whoever assigns tasks, can post progress.</p>}
          </>
        )}
      </div>
    </div>
  );
}
