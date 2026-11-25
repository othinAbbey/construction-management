import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { api, can } from "../../lib/pm";

const KEY = "bs_assistant_chat";
const load = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || "[]"); } catch { return []; } };
const save = (m) => { try { sessionStorage.setItem(KEY, JSON.stringify(m.slice(-40))); } catch { /* storage full or blocked */ } };

/** Bold and links inside a line. Only links into the app (/pm/...) become links; anything else stays plain text. */
function inline(text, key) {
  const out = []; let rest = text, i = 0;
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/;
  while (rest) {
    const m = rest.match(re);
    if (!m) { out.push(rest); break; }
    if (m.index) out.push(rest.slice(0, m.index));
    if (m[1]) out.push(/^\/pm\/[\w\-/?=&.%]*$/.test(m[2]) ? <Link key={`${key}-${i++}`} href={m[2]} className="font-medium text-blue-700 underline">{m[1]}</Link> : m[1]);
    else out.push(<b key={`${key}-${i++}`}>{m[3]}</b>);
    rest = rest.slice(m.index + m[0].length);
  }
  return out;
}
/** A small, safe markdown subset: paragraphs, bullet and numbered lists, headings as bold, bold, app links. */
function Rich({ text }) {
  const blocks = []; let list = null;
  text.split("\n").forEach((line, n) => {
    const b = line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (b) { if (!list) { list = []; blocks.push({ list }); } list.push(b[1]); return; }
    list = null;
    if (line.trim()) blocks.push({ p: line.replace(/^#+\s*/, ""), h: /^#+\s/.test(line), n });
  });
  return blocks.map((x, i) => (x.list
    ? <ul key={i} className="list-disc pl-5 space-y-0.5">{x.list.map((li, j) => <li key={j}>{inline(li, `${i}-${j}`)}</li>)}</ul>
    : <p key={i} className={x.h ? "font-semibold" : ""}>{inline(x.p, i)}</p>));
}

function suggestions(user) {
  const s = [];
  if (can(user, "projects:read")) s.push("Which projects need attention this week, and why?", "Summarise this week's site logs");
  if (can(user, "tenders:read")) s.push("Which tenders close in the next 14 days, and what is still missing from their checklists?");
  if (can(user, "projects:write")) s.push("Log a high-severity issue: cement delivery late on Block B");
  return s.slice(0, 4);
}

/** One change the assistant proposed, waiting for the person's OK. */
export function ActionCard({ a, onDone }) {
  const [state, setState] = useState(a.state || "pending");
  const [msg, setMsg] = useState(a.msg || "");
  const act = async (verb) => {
    setState("busy"); setMsg("");
    try {
      const r = await api(`/api/assistant/actions/${a.id}/${verb}`, { method: "POST" });
      const s = verb === "confirm" ? "done" : "cancelled"; setState(s); onDone(a.id, s, r.link);
    } catch (e) { setState("pending"); setMsg(e.message); }
  };
  return (
    <div className={`mt-2 rounded-lg border p-3 text-sm ${state === "done" ? "border-green-300 bg-green-50" : state === "cancelled" ? "border-gray-200 bg-gray-50 text-gray-500" : "border-yellow-300 bg-yellow-50"}`}>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{state === "done" ? "Saved" : state === "cancelled" ? "Cancelled" : "Waiting for your OK"}</div>
      <div className="mt-0.5">{a.summary}</div>
      {msg && <div className="mt-1 text-xs text-red-700">{msg}</div>}
      {(state === "pending" || state === "busy") && (
        <div className="mt-2 flex gap-2">
          <button disabled={state === "busy"} onClick={() => act("confirm")} className="rounded-md bg-yellow-500 px-3 py-1 text-xs font-semibold text-black hover:bg-yellow-400 disabled:opacity-50">{state === "busy" ? "Saving..." : "Confirm"}</button>
          <button disabled={state === "busy"} onClick={() => act("cancel")} className="rounded-md border px-3 py-1 text-xs hover:bg-white disabled:opacity-50">Cancel</button>
        </div>
      )}
      {state === "done" && a.link && <Link href={a.link} className="mt-1 inline-block text-xs font-medium text-blue-700 underline">Open</Link>}
    </div>
  );
}

/**
 * The AI project assistant: a button on every page and a chat panel. It answers from the company's data as the
 * signed-in person, and every change it suggests waits for Confirm.
 */
export default function Assistant({ user }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [status, setStatus] = useState(null);
  const end = useRef(null);
  useEffect(() => { setMsgs(load()); }, []);
  useEffect(() => { save(msgs); end.current?.scrollIntoView({ block: "end" }); }, [msgs, open]);
  useEffect(() => { if (open && !status) api("/api/assistant").then(setStatus).catch(() => {}); }, [open, status]);

  async function send(q) {
    const question = (q ?? text).trim(); if (!question || busy) return;
    const next = [...msgs, { role: "user", content: question }];
    setMsgs(next); setText(""); setBusy(true); setErr("");
    try {
      const r = await api("/api/assistant/chat", { method: "POST", body: { messages: next.map(({ role, content }) => ({ role, content })) }, timeout: 120000 });
      setMsgs([...next, { role: "assistant", content: r.reply, actions: r.actions }]);
      setStatus((s) => (s ? { ...s, usage: r.usage } : s));
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  const actionDone = (id, state, link) => setMsgs((m) => m.map((x) => (x.actions ? { ...x, actions: x.actions.map((a) => (a.id === id ? { ...a, state, link } : a)) } : x)));
  // Drawn straight into <body>, above everything, with its own colours: no page layout, overlay or stylesheet can cover or hide it.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <>
      {!open && (
        <button onClick={() => setOpen(true)} aria-label="Open the project assistant" className="print:hidden"
          style={{ position: "fixed", right: 20, bottom: 20, zIndex: 2147483000, display: "flex", alignItems: "center", gap: 8, padding: "12px 18px", borderRadius: 9999,
            background: "#facc15", color: "#111827", border: "2px solid #111827", fontWeight: 700, fontSize: 14, boxShadow: "0 8px 24px rgba(0,0,0,.25)", cursor: "pointer" }}>
          <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M10 1 L12.2 7.8 L19 10 L12.2 12.2 L10 19 L7.8 12.2 L1 10 L7.8 7.8 Z" fill="#111827" /></svg>
          Ask the assistant
        </button>
      )}
      {open && (
        <div className="fixed inset-0 flex justify-end bg-black/30 print:hidden" style={{ zIndex: 2147483001 }} onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-md flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div><div className="font-bold">Project assistant</div><div className="text-[11px] text-gray-500">Answers from your company's data. Changes wait for your OK.</div></div>
              <div className="flex items-center gap-3">
                {msgs.length > 0 && <button onClick={() => { setMsgs([]); setErr(""); }} className="text-xs text-gray-500 hover:text-black">New chat</button>}
                <button onClick={() => setOpen(false)} className="text-2xl leading-none text-gray-500 hover:text-black" aria-label="Close">&times;</button>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
              {status && !status.available && <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">The assistant is not switched on yet. An administrator needs to add the AI key on the server.</div>}
              {!msgs.length && (
                <div className="space-y-2">
                  <p className="text-gray-600">Ask about your projects, tasks, budgets, site logs, issues and tenders{status?.can_change ? ", or ask it to log an issue, add a site log, record a cost or create a task" : ""}.</p>
                  {suggestions(user).map((s) => <button key={s} onClick={() => send(s)} className="block w-full rounded-lg border bg-gray-50 px-3 py-2 text-left hover:bg-yellow-50">{s}</button>)}
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                  <div className={m.role === "user" ? "max-w-[85%] rounded-2xl rounded-br-sm bg-yellow-100 px-3 py-2 whitespace-pre-wrap" : "max-w-full space-y-1.5 text-gray-800"}>
                    {m.role === "user" ? m.content : <Rich text={m.content} />}
                    {m.actions?.map((a) => <ActionCard key={a.id} a={a} onDone={actionDone} />)}
                  </div>
                </div>
              ))}
              {busy && <div className="text-gray-500">Looking through your records...</div>}
              {err && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">{err}</div>}
              <div ref={end} />
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t p-3">
              <div className="flex gap-2">
                <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  rows={2} maxLength={4000} placeholder="Ask a question..." className="flex-1 resize-none rounded-md border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                <button disabled={busy || !text.trim()} className="self-end rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-400 disabled:opacity-50">Send</button>
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                <span>The assistant can make mistakes. Check important figures.</span>
                {status?.usage?.limit && <span>{status.usage.questions} of {status.usage.limit} questions this month</span>}
              </div>
            </form>
          </div>
        </div>
      )}
    </>,
    document.body,
  );
}
