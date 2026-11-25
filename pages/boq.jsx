import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { can, getToken, getUser } from "../lib/pm";
import { ApiError, BoqApi } from "../lib/boqApi";

const ACTIVE = ["queued", "reading", "building"];
const POLL_MS = 2000;
const fmt = (n, d = 2) => (n === null || n === undefined || n === "" ? "" : Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }));
const WHO = { anthropic: "Claude", openai: "OpenAI", gemini: "Gemini" };

function Banner({ msg, onClose }) {
  if (!msg) return null;
  const tone = { error: "bg-red-50 text-red-800 border-red-200", warn: "bg-amber-50 text-amber-800 border-amber-200", ok: "bg-green-50 text-green-800 border-green-200", info: "bg-blue-50 text-blue-800 border-blue-200" }[msg.kind];
  return <div className={`flex justify-between gap-3 rounded-lg border p-3 text-sm ${tone}`}><span>{msg.text}</span>{onClose && <button onClick={onClose} aria-label="Dismiss">&times;</button>}</div>;
}
const Metric = ({ label, value, sub }) => (
  <div className="rounded-xl border bg-white p-4 shadow-sm"><div className="text-xs uppercase tracking-wide text-gray-500">{label}</div><div className="text-xl font-bold mt-1">{value}</div>{sub && <div className="text-xs text-gray-500">{sub}</div>}</div>
);
function DataTable({ columns, rows, numeric = [] }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm"><table className="w-full text-sm">
      <thead className="bg-gray-50 text-left text-gray-600"><tr>{columns.map((c) => <th key={c} className="p-2.5 font-medium">{c}</th>)}</tr></thead>
      <tbody>{rows.map((r, i) => <tr key={i} className="border-t">{columns.map((c) => <td key={c} className={`p-2.5 ${numeric.includes(c) ? "text-right tabular-nums" : ""}`}>{r[c] ?? ""}</td>)}</tr>)}</tbody>
    </table></div>
  );
}

export default function Boq() {
  const api = useMemo(() => new BoqApi(), []);
  const [authed, setAuthed] = useState(null);
  const [me, setMe] = useState(null);
  const [allJobs, setAllJobs] = useState(false);
  const [cfg, setCfg] = useState(null);
  const [tab, setTab] = useState("new");
  const [file, setFile] = useState(null);
  const [force, setForce] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [job, setJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [rates, setRates] = useState(null);
  const [msg, setMsg] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const who = WHO[cfg?.ai_provider] || "The AI";

  const guard = async (fn) => {
    setMsg(null);
    try { await fn(); } catch (err) { setMsg({ kind: "error", text: err instanceof ApiError ? err.message : `Unexpected error: ${err.message}` }); if (!(err instanceof ApiError)) console.error(err); }
  };

  useEffect(() => { setAuthed(!!getToken()); setMe(getUser()); }, []);
  useEffect(() => {
    if (!authed) return;
    guard(async () => {
      setCfg(await api.config()); setJobs(await api.jobs(false));
      const m = /job=([a-f0-9]{12})/.exec(window.location.hash || "");
      if (m) setJob(await api.job(m[1]));
    });
  }, [authed]); // eslint-disable-line react-hooks/exhaustive-deps

  // Follow a running job until it finishes.
  useEffect(() => {
    if (!job || !ACTIVE.includes(job.status)) return undefined;
    let stop = false, timer;
    const t0 = Date.parse(job.created_at) || Date.now();
    const tick = async () => {
      try {
        const j = await api.job(job.id);
        if (stop) return;
        setJob(j);
        if (!ACTIVE.includes(j.status)) { setJobs(await api.jobs(allJobs)); return; }
      } catch (err) { if (!stop) setMsg({ kind: "warn", text: `Lost contact with the BOQ service (${err.message}). Still trying...` }); }
      timer = setTimeout(tick, POLL_MS);
    };
    timer = setTimeout(tick, POLL_MS);
    const clock = setInterval(() => setElapsed(Math.max(0, Math.round((Date.now() - t0) / 1000))), 1000);
    return () => { stop = true; clearTimeout(timer); clearInterval(clock); };
  }, [job?.id, job?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleAll = (on) => { setAllJobs(on); guard(async () => setJobs(await api.jobs(on))); };
  const savePdf = () => guard(async () => {
    const blob = await api.pdf(job.id);
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = job.filename; document.body.append(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  });
  const open = (id) => guard(async () => { setJob(await api.job(id)); window.history.replaceState(null, "", `#job=${id}`); });
  const generate = () => guard(async () => {
    setUploading(true);
    try { const j = await api.createJob(file, { force }); setJob(j); setFile(null); window.history.replaceState(null, "", `#job=${j.id}`); setJobs(await api.jobs(allJobs)); }
    finally { setUploading(false); }
  });
  const rebuild = () => guard(async () => { setJob(await api.rebuild(job.id)); setMsg({ kind: "ok", text: "Rebuilt with the current rates and assumptions (no new AI call)." }); });
  const download = () => guard(async () => {
    const blob = await api.xlsx(job.id);
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = job.result.xlsx; document.body.append(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  });
  const showTab = (key) => { setTab(key); if (key === "rates") guard(async () => setRates(await api.rates())); };
  const saveRates = () => guard(async () => {
    const rows = rates.rows.map((r) => Object.fromEntries(rates.fields.map((f) => [f, r[f] == null ? "" : String(r[f])]))).filter((r) => String(r.item_code || "").trim());
    const res = await api.saveRates(rows); setRates(await api.rates());
    setMsg({ kind: "ok", text: `Saved ${res.saved} rows. Open a finished job and press "Rebuild with current rates".` });
  });

  if (authed === null) return null;
  if (!authed) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">BOQ Extraction</h1>
        <p className="mt-3 text-gray-600">Upload a drawing set as a PDF and get a priced bill of quantities in Excel. Sign in to use it.</p>
        <Link href="/pm/login?next=/boq" className="inline-block mt-6 rounded-md bg-yellow-500 px-6 py-3 font-semibold text-black hover:bg-yellow-400">Sign in</Link>
        <div className="mt-3 text-sm text-gray-500">No account? <Link href="/pm/login?signup=1" className="underline">Create your company account</Link>.</div>
      </div>
    );
  }

  const tooBig = file && cfg && file.size > cfg.max_pdf_mb * 1024 * 1024;
  const r = job?.result;
  const real = r ? r.issues.filter((i) => i.level !== "info") : [], info = r ? r.issues.filter((i) => i.level === "info") : [];
  const lines = r ? r.sections.flatMap((s) => s.lines.map((l) => ({ Item: l.item, Description: l.description, Unit: l.unit, Qty: fmt(l.quantity), Rate: fmt(l.rate), Amount: fmt(l.amount), Basis: l.basis }))) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">BOQ Extraction</h1>
        <p className="text-gray-600 mt-1">Drawing PDF in, checked and priced bill of quantities out.</p>
      </div>
      <Banner msg={msg} onClose={() => setMsg(null)} />

      {cfg && (
        <>
          <div className="flex gap-2 border-b">
            {[["new", "New BOQ"], ["rates", "Rate book"]].filter(([k]) => k !== "rates" || can(me, "boq:rates")).map(([k, l]) => (
              <button key={k} onClick={() => showTab(k)} className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 ${tab === k ? "border-yellow-500 text-black" : "border-transparent text-gray-500 hover:text-black"}`}>{l}</button>
            ))}
          </div>

          {tab === "new" && (
            <div className="space-y-5">
              <div className="rounded-xl border bg-white p-5 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <input type="file" accept="application/pdf,.pdf" aria-label="PDF file" onChange={(e) => setFile(e.target.files[0] || null)} className="text-sm" />
                  <button disabled={!file || tooBig || uploading || !cfg.api_key_set} onClick={generate} className="rounded-md bg-yellow-500 px-5 py-2 text-sm font-semibold text-black hover:bg-yellow-400 disabled:opacity-50">{uploading ? "Uploading..." : "Generate BOQ"}</button>
                </div>
                {file && <div className="text-sm text-gray-500">{file.name} ({(file.size / 1048576).toFixed(1)} MB)</div>}
                {tooBig && <Banner msg={{ kind: "error", text: `This PDF is over the ${cfg.max_pdf_mb} MB limit. Split or compress it.` }} />}
                {!cfg.api_key_set && <Banner msg={{ kind: "error", text: `The BOQ service has no API key for ${who}, so it cannot read PDFs. Ask your administrator to set it in the BOQ service settings.` }} />}
                <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" checked={force} onChange={(e) => setForce(e.target.checked)} /> Read again even if this exact PDF was read before (costs money)</label>
                <div className="text-xs text-gray-500">Model: {cfg.model}. The whole PDF is sent to {who}. Your drawing and the result are saved to your account.</div>
              </div>

              {job && (
                <div className="rounded-xl border bg-white p-5 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-baseline gap-3"><strong>{job.filename}</strong><span className="text-xs text-gray-500">job {job.id}</span></div>
                  {ACTIVE.includes(job.status) && (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2"><span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-yellow-500" />{job.stage} <span className="text-gray-500">{elapsed} s</span></div>
                      <div className="text-gray-500">{who} reads every page, so a large set can take several minutes. You can leave this page; the job keeps running and is listed under Recent jobs.</div>
                    </div>
                  )}
                  {job.status === "failed" && <><Banner msg={{ kind: "error", text: job.error || "The job failed." }} /><div className="text-sm text-gray-500">Nothing was charged for a failed read that returned no answer. You can upload the PDF again.</div></>}
                  {r && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <Metric label={`Total (${r.currency})`} value={fmt(r.totals.total)} />
                        <Metric label="Unpriced lines" value={r.unpriced.length} sub={r.unpriced.length ? "fill them in on the Rate book tab" : ""} />
                        <Metric label="Read from the PDF" value={`${r.counts.drawings} drawings`} sub={`${r.counts.rooms} rooms, ${r.counts.openings} openings`} />
                        <Metric label="Cost of this read" value={job.cached ? "free (cached)" : job.cost_usd === null ? "n/a" : `≈ $${fmt(job.cost_usd, 3)}`} sub={job.usage ? `${fmt(job.usage.input_tokens, 0)} in / ${fmt(job.usage.output_tokens, 0)} out` : ""} />
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <button onClick={download} className="rounded-md bg-yellow-500 px-5 py-2 text-sm font-semibold text-black hover:bg-yellow-400">Download Excel</button>
                        <button onClick={rebuild} className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">Rebuild with current rates</button>
                        <button onClick={savePdf} className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50">Download original PDF</button>
                        <span className="text-xs text-gray-500">The Excel file also lists everything {who} read (rooms, openings, notes) for review.</span>
                      </div>
                      {r.document_warnings.map((w) => <Banner key={w} msg={{ kind: "warn", text: `${who} noted: ${w}` }} />)}
                      <h2 className="font-semibold">Checks ({real.length} to look at)</h2>
                      {real.length ? <DataTable columns={["level", "where", "message"]} rows={real} /> : <Banner msg={{ kind: "ok", text: "No errors or warnings." }} />}
                      {info.length > 0 && <details><summary className="cursor-pointer text-sm text-gray-600">{info.length} informational notes</summary><div className="mt-2"><DataTable columns={["level", "where", "message"]} rows={info} /></div></details>}
                      <h2 className="font-semibold">Bill of quantities</h2>
                      {lines.length ? <DataTable columns={["Item", "Description", "Unit", "Qty", "Rate", "Amount", "Basis"]} rows={lines} numeric={["Qty", "Rate", "Amount"]} /> : <div className="text-sm text-gray-500">No quantity lines were produced.</div>}
                      {r.unpriced.length > 0 && <Banner msg={{ kind: "warn", text: "Lines without a rate are left out of the total. Fill them in on the Rate book tab, then press “Rebuild with current rates”." }} />}
                    </div>
                  )}
                </div>
              )}

              {jobs.length > 0 && (
                <div>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-semibold">{allJobs ? "Everyone's jobs" : "My recent jobs"}</h2>
                    {can(me, "boq:all") && <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" checked={allJobs} onChange={(e) => toggleAll(e.target.checked)} /> Show every user's jobs</label>}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {jobs.slice(0, 10).map((j) => (
                      <button key={j.id} onClick={() => open(j.id)} className="flex justify-between gap-3 rounded-lg border bg-white px-4 py-2.5 text-left text-sm hover:border-yellow-500">
                        <span className="truncate">{j.filename}</span><span className="text-gray-500 whitespace-nowrap">{j.status === "done" ? `${j.currency} ${fmt(j.total)}` : j.status}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === "rates" && (!rates ? <div className="text-sm text-gray-500">Loading...</div> : (
            <div className="space-y-3">
              <h2 className="font-semibold">Rate book</h2>
              <p className="text-sm text-gray-600">Your own rates, with a date and a source on every row. A blank rate leaves the BOQ line unpriced. An item code ending in * covers a family (OPN-DOOR-*). The previous file is kept as rates.csv.bak when you save.</p>
              <div className="overflow-x-auto rounded-xl border bg-white shadow-sm"><table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-600"><tr>{rates.fields.map((c) => <th key={c} className="p-2 font-medium">{c}</th>)}<th /></tr></thead>
                <tbody>{rates.rows.map((row, i) => (
                  <tr key={i} className="border-t">
                    {rates.fields.map((c) => <td key={c} className="p-1"><input aria-label={c} className="w-full min-w-[6rem] rounded border border-gray-200 px-2 py-1" value={row[c] == null ? "" : String(row[c])}
                      onChange={(e) => setRates({ ...rates, rows: rates.rows.map((x, j) => (j === i ? { ...x, [c]: e.target.value } : x)) })} /></td>)}
                    <td className="p-1"><button title="Delete row" className="text-red-500 px-2" onClick={() => setRates({ ...rates, rows: rates.rows.filter((_, j) => j !== i) })}>&times;</button></td>
                  </tr>))}</tbody></table></div>
              <div className="flex gap-3">
                <button className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setRates({ ...rates, rows: [...rates.rows, {}] })}>+ Add row</button>
                <button className="rounded-md bg-yellow-500 px-5 py-2 text-sm font-semibold text-black hover:bg-yellow-400" onClick={saveRates}>Save rates</button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
