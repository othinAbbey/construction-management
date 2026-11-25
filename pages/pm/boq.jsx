import Link from "next/link";
import { useEffect, useState } from "react";
import { can, getToken, getUser } from "../../lib/pm";
import { BoqApi } from "../../lib/boqApi";
import { Btn, Empty, Panel, Table } from "../../components/pm/ui";

const ACTIVE = ["queued", "reading", "building"];
const POLL_MS = 2000;
const fmt = (n, d = 2) => (n === null || n === undefined || n === "" ? "" : Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }));
const WHO = { anthropic: "Claude", openai: "OpenAI", gemini: "Gemini" };

function Banner({ msg, onClose }) {
  if (!msg) return null;
  const tone = { error: "bg-red-50 text-red-800 border-red-200", warn: "bg-amber-50 text-amber-800 border-amber-200", ok: "bg-green-50 text-green-800 border-green-200", info: "bg-blue-50 text-blue-800 border-blue-200" }[msg.kind];
  return <div className={`flex justify-between gap-3 rounded-lg border p-3 text-sm ${tone}`}><span>{msg.text}</span>{onClose && <button onClick={onClose} aria-label="Dismiss">&times;</button>}</div>;
}

export default function Boq() {
  const [authed, setAuthed] = useState(null);
  const [me, setMe] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [file, setFile] = useState(null);
  const [all, setAll] = useState(false);
  const boq = new BoqApi();

  useEffect(() => { setAuthed(!!getToken()); setMe(getUser()); }, []);
  useEffect(() => {
    if (!authed) return;
    reload();
  }, [authed, all]);
  useEffect(() => {
    if (!jobs.some((j) => ACTIVE.includes(j.status))) return;
    const timer = setInterval(reload, POLL_MS);
    return () => clearInterval(timer);
  }, [jobs]);

  async function reload() {
    try { setJobs(await boq.jobs(all)); }
    catch (e) { setMsg({ kind: "error", text: e.message }); }
  }

  async function upload(e) {
    e.preventDefault();
    if (!file) return setMsg({ kind: "warn", text: "Choose a PDF drawing first." });
    setBusy(true);
    setMsg(null);
    try { await boq.createJob(file); setFile(null); setMsg({ kind: "ok", text: "BOQ job submitted." }); await reload(); }
    catch (e) { setMsg({ kind: "error", text: e.message }); } finally { setBusy(false); }
  }

  async function action(name, fn, success) {
    setBusy(true);
    setMsg(null);
    try { await fn(); setMsg({ kind: "ok", text: success }); await reload(); }
    catch (e) { setMsg({ kind: "error", text: e.message }); } finally { setBusy(false); }
  }

  async function download(id, kind) {
    setBusy(true);
    setMsg(null);
    try {
      const blob = kind === "xlsx" ? await boq.xlsx(id) : await boq.pdf(id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = kind === "xlsx" ? `BOQ-${id}.xlsx` : `Drawing-${id}.pdf`;
      document.body.append(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (e) { setMsg({ kind: "error", text: e.message }); } finally { setBusy(false); }
  }

  if (authed === null) return null;
  if (!authed) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">BOQ Extraction</h1>
        <p className="mt-3 text-gray-600">Upload a drawing set as a PDF and get a priced bill of quantities in Excel. Sign in to use it.</p>
        <Link href="/pm/login?next=/pm/boq" className="inline-block mt-6 rounded-md bg-yellow-500 px-6 py-3 font-semibold text-black hover:bg-yellow-400">Sign in</Link>
        <div className="mt-3 text-sm text-gray-500">No account? <Link href="/pm/login?signup=1" className="underline">Create your company account</Link>.</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">BOQ Extraction</h1>
        <p className="text-gray-600 mt-1">Upload drawing PDFs and manage priced bill-of-quantities jobs.</p>
      </div>
      {can(me, "boq:use") && (
        <Panel title="Upload a drawing">
          <form onSubmit={upload} className="flex flex-wrap items-end gap-3">
            <label className="text-sm text-gray-600">PDF drawing
              <input className="mt-1 block text-sm" type="file" accept="application/pdf,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
            <Btn disabled={busy || !file}>{busy ? "Submitting..." : "Create BOQ job"}</Btn>
          </form>
        </Panel>
      )}
      <Banner msg={msg} onClose={() => setMsg(null)} />
      {can(me, "boq:all") && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} />Show all organization jobs</label>}
      {!jobs.length ? <Empty>No BOQ jobs yet.</Empty> : (
        <Table head={["Drawing", "Status", "Stage", "Total", "Created", ""]}>
          {jobs.map((j) => (
            <tr key={j.id} className="border-t align-top">
              <td className="p-2.5 font-medium">{j.filename}</td>
              <td className="p-2.5">{j.status}</td>
              <td className="p-2.5 text-gray-600">{j.stage || "-"}</td>
              <td className="p-2.5">{j.total == null ? "-" : `${j.currency || ""} ${fmt(j.total, 2)}`}</td>
              <td className="p-2.5 whitespace-nowrap">{j.created_at ? new Date(j.created_at).toLocaleString() : "-"}</td>
              <td className="p-2.5">
                <div className="flex flex-wrap gap-2">
                  {j.has_xlsx && <button disabled={busy} className="text-xs text-blue-700 hover:underline" onClick={() => download(j.id, "xlsx")}>Excel</button>}
                  <button disabled={busy} className="text-xs text-blue-700 hover:underline" onClick={() => download(j.id, "pdf")}>PDF</button>
                  {j.status === "failed" && <button disabled={busy} className="text-xs text-gray-700 hover:underline" onClick={() => action("retry", () => boq.retry(j.id), "Job queued again.")}>Retry</button>}
                  {j.status === "done" && <button disabled={busy} className="text-xs text-gray-700 hover:underline" onClick={() => action("rebuild", () => boq.rebuild(j.id), "Job rebuild submitted.")}>Rebuild</button>}
                  <button disabled={busy} className="text-xs text-red-600 hover:underline" onClick={() => confirm("Delete this BOQ job?") && action("delete", () => boq.remove(j.id), "Job deleted.")}>Delete</button>
                </div>
                {j.error && <div className="mt-1 max-w-xs text-xs text-red-700">{j.error}</div>}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
