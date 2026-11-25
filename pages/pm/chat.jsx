import { useEffect, useRef, useState } from "react";
import { ActionCard } from "../../components/pm/Assistant";
import { Shell } from "../../components/pm/ui";
import { api, getUser } from "../../lib/pm";

const SEVERITY = ["low", "medium", "high"];
const ISSUE_TYPES = ["Issue", "RFI", "Risk", "Delay", "Safety", "Quality"];
const time = (iso) => { const d = new Date(iso); const same = d.toDateString() === new Date().toDateString(); return d.toLocaleString("en-GB", same ? { timeStyle: "short" } : { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); };
const Star = ({ className = "h-3.5 w-3.5" }) => <svg viewBox="0 0 20 20" className={className} aria-hidden="true"><path d="M10 1 L12.2 7.8 L19 10 L12.2 12.2 L10 19 L7.8 12.2 L1 10 L7.8 7.8 Z" fill="currentColor" /></svg>;

/** A site log or issue being drafted in the chat (by the bot or a person): edit, then Save files it on the project. */
function DraftCard({ m, canFile, onChange, setErr }) {
  const d = m.draft;
  const [f, setF] = useState(d.fields);
  const [busy, setBusy] = useState(false);
  useEffect(() => setF(d.fields), [m.id, d.status]); // eslint-disable-line react-hooks/exhaustive-deps
  const isLog = d.type === "site_log", label = isLog ? "Site log" : "Issue";
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const act = async (verb) => {
    setBusy(true); setErr("");
    try { onChange(await api(`/api/chat/drafts/${m.id}/${verb}`, { method: "POST", body: verb === "save" ? { fields: { ...f, workers: f.workers === "" || f.workers == null ? null : Number(f.workers) } } : undefined })); }
    catch (e) { setErr(e.message); } finally { setBusy(false); }
  };
  if (d.status === "saved") return (
    <div className="rounded-xl border border-green-300 bg-green-50 p-3 text-sm">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-green-800">{label} saved{d.saved_by ? ` by ${d.saved_by}` : ""}</div>
      <div className="mt-1 text-gray-800">{isLog ? `${d.fields.date}: ${d.fields.work}${d.fields.workers != null ? ` (${d.fields.workers} workers)` : ""}` : `${d.fields.title} · ${d.fields.severity}`}</div>
    </div>
  );
  if (d.status === "dismissed") return <div className="rounded-xl border bg-gray-50 p-2 text-xs text-gray-500">{label} draft dismissed{d.dismissed_by ? ` by ${d.dismissed_by}` : ""}.</div>;
  const input = "w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm disabled:bg-gray-50";
  return (
    <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-3 text-sm space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-yellow-800">{d.by === "bot" ? `Draft ${label.toLowerCase()} from the bot` : `New ${label.toLowerCase()}`}</div>
        {!canFile && <span className="text-[11px] text-gray-500">Someone who can change the project must save it</span>}
      </div>
      {isLog ? (
        <div className="grid grid-cols-2 gap-2">
          <label className="col-span-1"><span className="text-xs text-gray-600">Date</span><input type="date" value={f.date || ""} onChange={set("date")} disabled={!canFile} className={input} /></label>
          <label className="col-span-1"><span className="text-xs text-gray-600">Workers</span><input type="number" min="0" inputMode="numeric" value={f.workers ?? ""} onChange={set("workers")} disabled={!canFile} className={input} /></label>
          <label className="col-span-2"><span className="text-xs text-gray-600">Work done</span><textarea rows={3} value={f.work || ""} onChange={set("work")} disabled={!canFile} className={input} placeholder="Describe the work done today" /></label>
          <label className="col-span-1"><span className="text-xs text-gray-600">Weather</span><input value={f.weather || ""} onChange={set("weather")} disabled={!canFile} className={input} /></label>
          <label className="col-span-1"><span className="text-xs text-gray-600">Delays</span><input value={f.delays || ""} onChange={set("delays")} disabled={!canFile} className={input} /></label>
          <label className="col-span-2"><span className="text-xs text-gray-600">Safety incidents</span><input value={f.safety || ""} onChange={set("safety")} disabled={!canFile} className={input} placeholder="None" /></label>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <label className="col-span-2"><span className="text-xs text-gray-600">Title</span><input value={f.title || ""} onChange={set("title")} disabled={!canFile} className={input} placeholder="e.g. Cement delivery late" /></label>
          <label><span className="text-xs text-gray-600">Type</span><select value={f.type || "Issue"} onChange={set("type")} disabled={!canFile} className={input}>{ISSUE_TYPES.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label><span className="text-xs text-gray-600">Severity</span><select value={f.severity || "medium"} onChange={set("severity")} disabled={!canFile} className={input}>{SEVERITY.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label className="col-span-2"><span className="text-xs text-gray-600">What happened</span><textarea rows={3} value={f.detail || ""} onChange={set("detail")} disabled={!canFile} className={input} placeholder="Describe the issue" /></label>
          <label><span className="text-xs text-gray-600">Who handles it</span><input value={f.owner || ""} onChange={set("owner")} disabled={!canFile} className={input} /></label>
          <label><span className="text-xs text-gray-600">Due</span><input type="date" value={f.due || ""} onChange={set("due")} disabled={!canFile} className={input} /></label>
        </div>
      )}
      <div className="flex gap-2">
        {canFile && <button disabled={busy} onClick={() => act("save")} className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-400 disabled:opacity-50">{busy ? "Saving..." : `Save ${label.toLowerCase()}`}</button>}
        <button disabled={busy} onClick={() => act("dismiss")} className="rounded-md border bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50">Dismiss</button>
      </div>
    </div>
  );
}

function Message({ m, me, canFile, onChange, setErr }) {
  const mine = m.user?.id === me?.id;
  if (m.kind === "draft") return <div className="max-w-xl">{m.body && <div className="mb-1 flex items-center gap-1 text-xs text-gray-500"><Star className="h-3 w-3 text-yellow-600" /> {m.body}</div>}<DraftCard m={m} canFile={canFile} onChange={onChange} setErr={setErr} /></div>;
  if (m.kind === "bot") return (
    <div className="max-w-xl">
      <div className="mb-0.5 flex items-center gap-1 text-xs font-semibold text-gray-700"><Star className="h-3 w-3 text-yellow-600" /> Bot <span className="font-normal text-gray-400">{time(m.created)}</span></div>
      <div className="rounded-2xl rounded-tl-sm border border-yellow-200 bg-white px-3 py-2 text-sm whitespace-pre-wrap">{m.body}</div>
      {m.meta?.for_user === me?.id && m.meta?.actions?.map((a) => <ActionCard key={a.id} a={a} onDone={() => {}} />)}
    </div>
  );
  return (
    <div className={`flex ${mine ? "justify-end" : ""}`}>
      <div className="max-w-[85%] md:max-w-xl">
        {!mine && <div className="mb-0.5 text-xs font-semibold text-gray-700">{m.user?.name || "Someone"} <span className="font-normal text-gray-400">{time(m.created)}</span></div>}
        <div className={`rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap break-words ${mine ? "rounded-br-sm bg-yellow-100" : "rounded-tl-sm border bg-white"}`}>{m.body}</div>
        {mine && <div className="mt-0.5 text-right text-[10px] text-gray-400">{time(m.created)}</div>}
      </div>
    </div>
  );
}

/**
 * Site Chat: the team talks, the bot drafts site logs and issues from what they write, and anyone who can change the
 * project checks the draft and saves it. Works on phones: room list first, then the room.
 */
export default function Chat() {
  const [rooms, setRooms] = useState(null);
  const [bot, setBot] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [data, setData] = useState(null);
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef(null), me = useRef(null);
  const loadRooms = () => api("/api/chat/rooms").then((r) => { setRooms(r.rooms); setBot(r.bot); }).catch((e) => setErr(e.message));
  useEffect(() => { me.current = getUser(); loadRooms(); const t = setInterval(loadRooms, 15000); return () => clearInterval(t); }, []);

  const loadRoom = (id) => api(`/api/chat/rooms/${id}/messages`).then((d) => setData((old) => {
    const grew = !old || old.room.id !== id || d.messages.length !== old.messages.length;
    if (grew) setTimeout(() => end.current?.scrollIntoView({ block: "end" }), 50);
    return d;
  })).catch((e) => setErr(e.message));
  useEffect(() => {
    if (!roomId) return undefined;
    setData(null); loadRoom(roomId);
    const t = setInterval(() => loadRoom(roomId), 4000);
    return () => clearInterval(t);
  }, [roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function openRoom(r) {
    setErr("");
    if (r.id) { setRoomId(r.id); return; }
    try { const opened = await api("/api/chat/rooms/open", { method: "POST", body: { project: r.project } }); setRoomId(opened.id); loadRooms(); } catch (e) { setErr(e.message); }
  }
  async function send() {
    const body = text.trim(); if (!body || busy) return;
    setBusy(true); setErr("");
    try { await api(`/api/chat/rooms/${roomId}/messages`, { method: "POST", body: { body } }); setText(""); await loadRoom(roomId); setTimeout(() => loadRoom(roomId), 2500); }
    catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  async function newDraft(type) {
    setErr("");
    try { await api(`/api/chat/rooms/${roomId}/drafts`, { method: "POST", body: { type } }); await loadRoom(roomId); } catch (e) { setErr(e.message); }
  }
  const replaceMessage = (m) => setData((d) => ({ ...d, messages: d.messages.map((x) => (x.id === m.id ? m : x)) }));
  const current = rooms?.find((r) => r.id === roomId);

  return (
    <Shell title="Site Chat">
      <div className="-mt-2 grid overflow-hidden rounded-xl border bg-white shadow-sm md:grid-cols-[16rem_1fr]" style={{ height: "calc(100vh - 13rem)", minHeight: 420 }}>
        {/* rooms: always on larger screens; on phones only until a room is open */}
        <div className={`${roomId ? "hidden md:flex" : "flex"} min-h-0 flex-col border-r`}>
          <div className="border-b px-3 py-2 text-xs text-gray-500">{bot?.available ? "The bot drafts site logs and issues from project rooms." : "The bot is not switched on: you can still chat and add site logs and issues."}</div>
          <ul className="flex-1 overflow-y-auto">
            {!rooms ? <li className="p-3 text-sm text-gray-500">Loading...</li> : rooms.map((r) => (
              <li key={r.project || "company"}>
                <button onClick={() => openRoom(r)} className={`flex w-full items-center justify-between gap-2 px-3 py-3 text-left text-sm hover:bg-gray-50 ${r.id && r.id === roomId ? "bg-yellow-50 font-semibold" : ""}`}>
                  <span className="min-w-0"><span className="block truncate">{r.project ? r.name : "Whole company"}</span><span className="block text-[11px] text-gray-400">{r.project ? (r.status || "project") : "Everyone"}</span></span>
                  {r.unread > 0 && <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-[11px] font-bold text-black">{r.unread}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* the room */}
        <div className={`${roomId ? "flex" : "hidden md:flex"} min-h-0 flex-col`}>
          {!roomId ? <div className="m-auto p-6 text-center text-sm text-gray-500">Pick a room. Project rooms are where site updates go: the bot turns them into draft site logs and issues.</div> : (
            <>
              <div className="flex items-center gap-2 border-b px-3 py-2">
                <button onClick={() => { setRoomId(null); setData(null); loadRooms(); }} className="rounded-md border px-2 py-1 text-sm md:hidden" aria-label="Back to rooms">&larr;</button>
                <div className="min-w-0 flex-1"><div className="truncate font-semibold">{current?.project ? current.name : "Whole company"}</div>
                  <div className="text-[11px] text-gray-500">{data?.room?.project ? "Type @bot to ask the assistant. Site updates become drafts to check and save." : "Company-wide chat. Type @bot to ask the assistant."}</div></div>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-3">
                {!data ? <div className="text-sm text-gray-500">Loading...</div> : !data.messages.length ? <div className="text-sm text-gray-500">No messages yet. Say what happened on site today.</div>
                  : data.messages.map((m) => <Message key={m.id} m={m} me={me.current} canFile={data.can_file} onChange={replaceMessage} setErr={setErr} />)}
                <div ref={end} />
              </div>
              {err && <div className="border-t bg-red-50 px-3 py-2 text-sm text-red-700">{err}</div>}
              <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t p-2">
                {data?.can_file && (
                  <div className="mb-2 flex gap-2">
                    <button type="button" onClick={() => newDraft("site_log")} className="rounded-full border px-3 py-1 text-xs font-semibold hover:bg-yellow-50">+ Site log</button>
                    <button type="button" onClick={() => newDraft("issue")} className="rounded-full border px-3 py-1 text-xs font-semibold hover:bg-yellow-50">+ Issue</button>
                  </div>
                )}
                <div className="flex gap-2">
                  <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && window.innerWidth >= 768) { e.preventDefault(); send(); } }}
                    rows={2} maxLength={4000} placeholder="Message the team..." className="flex-1 resize-none rounded-md border border-gray-300 px-2.5 py-2 text-base md:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                  <button disabled={busy || !text.trim()} className="self-end rounded-md bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-black hover:bg-yellow-400 disabled:opacity-50">Send</button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}
