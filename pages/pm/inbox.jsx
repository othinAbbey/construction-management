import { useState } from "react";
import { Shell, Del, Empty } from "../../components/pm/ui";
import { api, can, getUser, useApi, when } from "../../lib/pm";

const TONE = { new: "bg-yellow-100 text-yellow-800", read: "bg-gray-100 text-gray-700", replied: "bg-green-100 text-green-800" };

export default function Inbox() {
  const msgs = useApi("/api/messages");
  const [err, setErr] = useState("");
  const set = (id, status) => api(`/api/messages/${id}`, { method: "PATCH", body: { status } }).then(msgs.reload).catch((e) => setErr(e.message));
  return (
    <Shell title="Website Inbox" error={err || msgs.error}>
      <p className="text-sm text-gray-600">Messages sent from the Contact page of the website.</p>
      {!msgs.data?.length ? <Empty>No messages yet.</Empty> : msgs.data.map((m) => (
        <div key={m.id} className="bg-white border rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <div><b>{m.name}</b> <a className="text-blue-700 hover:underline" href={`mailto:${m.email}`}>{m.email}</a> {m.phone && <span className="text-gray-500">| {m.phone}</span>}</div>
            <div className="flex items-center gap-3"><span className="text-gray-500">{when(m.created)}</span><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${TONE[m.status]}`}>{m.status}</span></div>
          </div>
          <p className="text-sm whitespace-pre-wrap">{m.message}</p>
          <div className="flex gap-4 text-xs">
            {["new", "read", "replied"].filter((s) => s !== m.status).map((s) => <button key={s} className="text-blue-700 hover:underline" onClick={() => set(m.id, s)}>Mark {s}</button>)}
            {can(getUser(), "messages:manage") && <Del onClick={() => api(`/api/messages/${m.id}`, { method: "DELETE" }).then(msgs.reload).catch((e) => setErr(e.message))} />}
          </div>
        </div>
      ))}
    </Shell>
  );
}
