import { useEffect, useState } from "react";
import DataTable from "../../components/pm/DataTable";
import EditDialog from "../../components/pm/EditDialog";
import { Btn, Card, Empty, Field, Form, Panel, Select, Shell } from "../../components/pm/ui";
import { AiPill, BidPanel, ProgressCell, StageSteps, TaskDetail } from "../../components/pm/TaskProgress";
import { addDays } from "../../lib/dates";
import { api, can, getUser, money, useApi } from "../../lib/pm";

const COUNTRIES = ["Uganda", "Kenya", "Tanzania", "Rwanda", "South Sudan", "Democratic Republic of Congo", "Ethiopia", "Burundi"];
const KEYWORDS = ["construction", "water", "borehole", "road", "building", "steel", "bridge", "rehabilitation", "supervision", "drainage"];
const CURRENCIES = ["UGX", "USD", "EUR", "KES", "TZS"];
const fmtMoney = (v, c) => (v === null || v === undefined || v === "" ? "" : `${c || "UGX"} ${money(v)}`);
const STATUS = ["saved", "interested", "bidding", "submitted", "won", "lost", "dismissed"];
const STATUS_TONE = { saved: "bg-gray-100 text-gray-700", interested: "bg-blue-100 text-blue-800", bidding: "bg-yellow-100 text-yellow-800", submitted: "bg-purple-100 text-purple-800", won: "bg-green-100 text-green-800", lost: "bg-red-100 text-red-700", dismissed: "bg-gray-100 text-gray-400" };

/**
 * Other places to find tenders. None of these offers a feed the app may read (World Bank, AfDB and, when configured, UNDP are
 * searched directly by the API), so the page links to them and
 * "Add a tender from here" records what you find in the pipeline (tagged with the source). `free`: notices can be read without paying.
 */
export const TENDER_SITES = [
  { group: "UN agencies and international organisations", sites: [
    { id: "ungm", name: "UN Global Marketplace (UNGM)", url: "https://www.ungm.org/Public/Notice", free: true, note: "Tenders from UN agencies (UNHCR, UNICEF, FAO, IOM, WFP, UNDP...). Filter by country Uganda. Register free as a supplier; some agencies only accept bids from registered companies." },
    { id: "undp", name: "UNDP procurement notices", url: "https://procurement-notices.undp.org/", free: true, note: "UNDP's own notices; bids are submitted through UNDP's supplier portal after registering a profile." },
    { id: "unicef_ug", name: "UNICEF Uganda procurement", url: "https://www.unicef.org/uganda/procurement", free: true, note: "How UNICEF Uganda buys and where it advertises (its tenders are posted on UNGM)." },
    { id: "idlo", name: "IDLO procurement", url: "https://www.idlo.int/procurement", free: true, note: "International Development Law Organization, which builds justice centres and offices in Uganda." },
  ] },
  { group: "NGO and donor tenders", sites: [
    { id: "developmentaid", name: "DevelopmentAid", url: "https://www.developmentaid.org/", free: false, note: "Collects notices from 850+ donors, NGOs and development banks; filter tenders by Uganda and contracting authority \"NGO\". Full details need a paid membership." },
    { id: "greatugandajobs", name: "Great Uganda Jobs: Tenders in Uganda", url: "https://www.greatugandajobs.com/", free: true, note: "Free local board carrying many NGO and UNHCR notices, plus yearly supplier pre-qualification calls. Open the \"Tenders in Uganda\" category." },
  ] },
  { group: "Ugandan government and newspapers", sites: [
    { id: "egp", name: "Uganda e-GP portal", url: "https://egpuganda.go.ug/", free: true, note: "Official government tenders (ministries, districts, agencies). Register as a supplier to receive notices by email." },
    { id: "ppda", name: "PPDA", url: "https://www.ppda.go.ug/", free: true, note: "Public Procurement and Disposal of Public Assets Authority: bid notices and procurement rules." },
    { id: "monitor", name: "Daily Monitor tenders", url: "https://monitor.co.ug/uganda/jobs/tenders", free: true, note: "Tender adverts from NGOs, government and companies." },
    { id: "newvision", name: "New Vision", url: "https://www.newvision.co.ug/", free: true, note: "Newspaper tender notices, including UN and NGO adverts." },
  ] },
  { group: "Paid tender aggregators", sites: [
    { id: "globaltenders", name: "GlobalTenders: Uganda building", url: "https://www.globaltenders.com/tenders-uganda/uganda-building-tenders", free: false, note: "Mirrors many of the notices above; full access needs a subscription. Check the original source before paying." },
    { id: "tendersontime", name: "TendersOnTime: Uganda construction", url: "https://www.tendersontime.com/uganda-tenders/construction-tenders/", free: false, note: "Another aggregator with email alerts; details need a subscription." },
  ] },
];
const SITE_NAME = { worldbank: "World Bank", afdb: "African Development Bank", manual: "Added by hand", ...Object.fromEntries(TENDER_SITES.flatMap((g) => g.sites.map((x) => [x.id, x.name]))) };

/** The fields of a pipeline tender: used by Add manually, Edit, and Add a tender from here. */
const TENDER_FIELDS = [
  { k: "title", label: "Tender title", req: true }, { k: "buyer", label: "Client / buyer" }, { k: "country", label: "Country", def: "Uganda" },
  { k: "deadline", label: "Submission deadline", type: "date" },
  { k: "value", label: "Estimated value", type: "number" }, { k: "currency", label: "Currency", def: "UGX", options: CURRENCIES.map((c) => ({ v: c, l: c })) },
  { k: "url", label: "Link to the notice" }, { k: "status", label: "Status", def: "interested", options: STATUS.map((s) => ({ v: s, l: s })) }, { k: "notes", label: "Notes" },
];

/** Record a tender found on another site; it goes into the pipeline tagged with that site. */
function QuickAdd({ site, onClose, onSaved }) {
  const [err, setErr] = useState("");
  const [done, setDone] = useState("");
  const fields = TENDER_FIELDS.map((f) => (f.k === "notes" ? { ...f, def: `Found on ${site.name}` } : f));
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Add a tender from {site.name}</h2>
            <p className="text-sm text-gray-500">Copy the title, deadline and link from the notice. It goes into your Pipeline, where you can track it and assign it.</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl leading-none" aria-label="Close">&times;</button>
        </div>
        {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{err}</div>}
        {done && <div className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg p-3">{done}</div>}
        <Form fields={fields} cta="Add to pipeline" onSubmit={(v) => api("/api/tenders", { method: "POST", body: { ...v, source: site.id } })
          .then((row) => { setErr(""); setDone(`Added "${row.title}" to the pipeline. You can add another, or close this window.`); onSaved(); })
          .catch((e) => { setDone(""); setErr(e.message); })} />
      </div>
    </div>
  );
}

/** Sites with no feed the app may read: a compact, collapsed list so a tender found there can still be added to the pipeline. */
function OtherSources({ canWrite, onSaved }) {
  const [adding, setAdding] = useState(null);
  const sites = TENDER_SITES.flatMap((g) => g.sites);
  return (
    <details className="bg-white border rounded-xl p-4 text-sm">
      <summary className="cursor-pointer font-medium text-gray-700">Sites the app cannot list automatically ({sites.length})</summary>
      <p className="mt-2 text-gray-600">These publish no feed the app is allowed to read (UNGM's terms forbid copying its notices; others are paid or have no feed). Open one, and use <b>Add</b> to put a tender you find into your Pipeline.</p>
      <ul className="mt-3 divide-y">
        {sites.map((x) => (
          <li key={x.id} className="py-2 flex flex-wrap items-center gap-2">
            <a href={x.url} target="_blank" rel="noreferrer" className="font-medium text-blue-700 hover:underline">{x.name} &#8599;</a>
            {!x.free && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">paid</span>}
            <span className="text-xs text-gray-500 flex-1 min-w-[12rem]">{x.note}</span>
            {canWrite && <button onClick={() => setAdding(x)} className="text-xs font-semibold text-yellow-700 hover:underline">Add</button>}
          </li>
        ))}
      </ul>
      {adding && <QuickAdd site={adding} onClose={() => setAdding(null)} onSaved={onSaved} />}
    </details>
  );
}

const daysLeft = (d) => (d ? Math.ceil((Date.parse(`${d}T23:59:59`) - Date.now()) / 86400000) : null);
export function Deadline({ date }) {
  const n = daysLeft(date);
  if (!date) return <span className="text-gray-400">no deadline listed</span>;
  const cls = n < 0 ? "bg-gray-100 text-gray-500" : n <= 7 ? "bg-red-100 text-red-700" : n <= 21 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800";
  return <span className="whitespace-nowrap">{date} <span className={`ml-1 rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>{n < 0 ? "closed" : n === 0 ? "today" : `${n} day${n === 1 ? "" : "s"} left`}</span></span>;
}

function Search({ canWrite, onSaved }) {
  const sources = useApi("/api/tenders/sources");
  const searches = useApi("/api/tender_searches");
  const [f, setF] = useState({ q: "", country: "Uganda", source: "all" });
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function run(page = 1, params = f) {
    setBusy(true); setErr("");
    try {
      const qs = new URLSearchParams({ q: params.q, country: params.country, source: params.source, page: String(page) });
      const r = await api(`/api/tenders/search?${qs}`);
      setRes(page === 1 ? r : { ...r, items: [...res.items, ...r.items] });
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  async function save(t) {
    try {
      const { pipeline_id, pipeline_status, ...notice } = t;
      const row = await api("/api/tenders", { method: "POST", body: notice });
      setRes((r) => ({ ...r, items: r.items.map((x) => (x.external_id === t.external_id ? { ...x, pipeline_id: row.id, pipeline_status: row.status } : x)) }));
      onSaved();
    } catch (e) { setErr(e.message); }
  }
  const saveSearch = async () => {
    const name = prompt("Name this search:", `${f.q} in ${f.country || "all countries"}`);
    if (name) api("/api/tender_searches", { method: "POST", body: { name, keywords: f.q, country: f.country, source: f.source } }).then(searches.reload).catch((e) => setErr(e.message));
  };
  const source = sources.data?.find((s) => s.id === f.source);
  // List the latest tenders as soon as the page opens (all sources, Uganda), without waiting for a search.
  useEffect(() => {
    if (!sources.data?.length || res) return;
    const first = sources.data.some((s) => s.id === f.source) ? f : { ...f, source: sources.data[0].id };
    setF(first); run(1, first);
  }, [sources.data]); // eslint-disable-line react-hooks/exhaustive-deps
  const sourceName = (id) => sources.data?.find((s) => s.id === id)?.name || SITE_NAME[id] || id;

  return (
    <div className="space-y-4">
      {(err || sources.error) && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{err || sources.error}</div>}
      <Panel>
        <form onSubmit={(e) => { e.preventDefault(); run(1); }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end">
          <Field label="Keywords" value={f.q} onChange={(v) => setF({ ...f, q: v })} placeholder="e.g. water borehole" />
          <Select label="Country" value={f.country} blank="All countries" onChange={(v) => setF({ ...f, country: v })} options={COUNTRIES.map((c) => ({ v: c, l: c }))} />
          <Select label="Source" value={f.source} blank={null} onChange={(v) => setF({ ...f, source: v })} options={(sources.data || []).map((s) => ({ v: s.id, l: s.name }))} />
          <Btn disabled={busy}>{busy ? "Searching..." : "Search tenders"}</Btn>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">{KEYWORDS.map((k) => <button key={k} onClick={() => { const n = { ...f, q: k }; setF(n); run(1, n); }} className="rounded-full border bg-gray-50 px-3 py-1 text-xs hover:bg-yellow-50">{k}</button>)}</div>
        {source && <p className="mt-3 text-xs text-gray-500">{source.note}</p>}
      </Panel>

      {searches.data?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-500">Saved searches:</span>
          {searches.data.map((s) => (
            <span key={s.id} className="inline-flex items-center gap-1 rounded-full border bg-white px-3 py-1">
              <button onClick={() => { const n = { q: s.keywords || "", country: s.country || "", source: s.source || "all" }; setF(n); run(1, n); }} className="hover:underline">{s.name}</button>
              {canWrite && <button title="Remove" className="text-red-500" onClick={() => api(`/api/tender_searches/${s.id}`, { method: "DELETE" }).then(searches.reload)}>&times;</button>}
            </span>
          ))}
        </div>
      )}

      {!res && busy && <p className="text-sm text-gray-500">Loading the latest tenders...</p>}
      {res && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
            <span>{res.items.length} shown of {res.total.toLocaleString()} matching notices{f.country ? ` in ${f.country}` : ""}{f.q ? ` for "${f.q}"` : ""}</span>
            {canWrite && <button onClick={saveSearch} className="text-blue-700 hover:underline">Save this search</button>}
          </div>
          {res.failed?.length > 0 && <div className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3">Not included this time: {res.failed.map((x) => `${x.name} (${x.error})`).join("; ")}</div>}
          {!res.items.length ? <Empty>No notices matched. Try fewer keywords, another source, or “All countries”.</Empty> : res.items.map((t) => (
            <div key={t.external_id} className="bg-white border rounded-xl p-4 shadow-sm flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="font-semibold text-gray-900">{t.title}</div>
                <div className="text-sm text-gray-600"><span className="mr-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-700">{sourceName(t.source)}</span>{[t.buyer, t.country, t.type].filter(Boolean).join(" · ")}</div>
                <div className="text-sm text-gray-500">{t.published && `Published ${t.published} · `}<Deadline date={t.deadline} /></div>
                {t.description && <div className="text-xs text-gray-500">{t.description}</div>}
              </div>
              <div className="flex gap-2 items-center">
                {t.url && <a href={t.url} target="_blank" rel="noreferrer" className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">View notice &#8599;</a>}
                {t.pipeline_id ? <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_TONE[t.pipeline_status]}`}>In pipeline: {t.pipeline_status}</span>
                  : canWrite && <Btn onClick={() => save(t)}>Save to pipeline</Btn>}
              </div>
            </div>
          ))}
          {res.has_more && <Btn kind="secondary" disabled={busy} onClick={() => run(res.page + 1)}>Load more</Btn>}
        </div>
      )}

      <OtherSources canWrite={canWrite} onSaved={onSaved} />
    </div>
  );
}

/** The value of the pipeline in Uganda shillings (other currencies are shown separately, never mixed in). */
function Totals({ refreshKey }) {
  const { data } = useApi("/api/tenders/summary", [refreshKey]);
  if (!data) return null;
  const open = data.open_statuses.reduce((n, s) => n + (data.counts[s] || 0), 0);
  const ugxIn = (statuses) => data.by_status.filter((r) => r.currency === "UGX" && statuses.includes(r.status)).reduce((n, r) => n + r.total, 0);
  const others = Object.entries(data.open).filter(([c]) => c !== "UGX");
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Card label="Pipeline value" value={`UGX ${money(data.open.UGX || 0)}`} sub={`${open} open tender${open === 1 ? "" : "s"} (saved to submitted)`} />
      <Card label="Bidding and submitted" value={`UGX ${money(ugxIn(["bidding", "submitted"]))}`} sub={`${(data.counts.bidding || 0) + (data.counts.submitted || 0)} tenders`} />
      <Card label="Won" value={`UGX ${money(data.won.UGX || 0)}`} sub={`${data.counts.won || 0} tenders`} tone="text-green-700" />
      <Card label="Other currencies" value={others.length ? others.map(([c, v]) => `${c} ${money(v)}`).join(" | ") : "none"} sub="not converted into shillings" />
    </div>
  );
}

/** Give a pipeline tender to a project manager as a task. The general project manager is copied in automatically. */
function AssignDialog({ tender, onClose, onDone }) {
  const pms = useApi("/api/team?role=manager");
  const staff = useApi("/api/team");
  const [v, setV] = useState({ title: `Prepare and submit bid: ${tender.title}`, assignee: "", due: tender.deadline ? addDays(tender.deadline, -7) : "", priority: "medium", notes: "" });
  const [cc, setCc] = useState(new Set());
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const generals = (staff.data || []).filter((p) => p.role === "general_pm" && p.id !== v.assignee);
  const others = (staff.data || []).filter((p) => p.role !== "general_pm" && p.id !== v.assignee);
  const set = (k) => (x) => setV({ ...v, [k]: x });

  async function submit(e) {
    e.preventDefault(); setBusy(true); setErr("");
    try { await api(`/api/tenders/${tender.id}/tasks`, { method: "POST", body: { ...v, cc: [...cc] } }); onDone(); onClose(); }
    catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-xl max-h-[92vh] overflow-y-auto space-y-4">
        <div><h2 className="text-lg font-bold">Assign a task</h2><p className="text-sm text-gray-500">{tender.title}{tender.deadline ? ` · closes ${tender.deadline}` : ""}</p></div>
        {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{err}</div>}
        <Field label="Task" required value={v.title} onChange={set("title")} />
        <Select label="Assign to (project manager)" required value={v.assignee} blank="Choose a project manager" onChange={set("assignee")} options={(pms.data || []).map((p) => ({ v: p.id, l: p.name || p.email }))} />
        {pms.data && !pms.data.length && <p className="text-xs text-amber-700">There are no project managers yet. Create users with the Project Manager role under Team &amp; Security.</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Due date" type="date" value={v.due} onChange={set("due")} />
          <Select label="Priority" value={v.priority} blank={null} onChange={set("priority")} options={["low", "medium", "high"].map((p) => ({ v: p, l: p }))} />
        </div>
        <Field label="Instructions" value={v.notes} onChange={set("notes")} placeholder="What do you need from them?" />
        <div className="rounded-lg bg-gray-50 p-3 text-sm">
          <div className="font-medium text-gray-700">Copied in automatically</div>
          <div className="mt-1 flex flex-wrap gap-2">{generals.length ? generals.map((g) => <span key={g.id} className="rounded-full bg-yellow-100 px-3 py-0.5 text-xs">{g.name || g.email} (General Project Manager)</span>) : <span className="text-xs text-gray-500">No general project manager is set up yet.</span>}</div>
          {others.length > 0 && (
            <details className="mt-2"><summary className="cursor-pointer text-xs text-blue-700">Copy someone else too</summary>
              <div className="mt-1 grid gap-0.5 sm:grid-cols-2">{others.map((p) => <label key={p.id} className="flex items-center gap-2 text-xs"><input type="checkbox" checked={cc.has(p.id)} onChange={() => setCc((s) => { const n = new Set(s); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })} />{p.name || p.email} <span className="text-gray-400">{p.role_name}</span></label>)}</div>
            </details>
          )}
          <p className="mt-2 text-xs text-gray-500">The task appears under <b>My assignments</b> for the project manager and for everyone copied. Email is not sent.</p>
        </div>
        <div className="flex justify-end gap-2"><Btn kind="secondary" type="button" onClick={onClose}>Cancel</Btn><Btn disabled={busy || !v.assignee}>{busy ? "Assigning..." : "Assign task"}</Btn></div>
      </form>
    </div>
  );
}

function Pipeline({ canWrite, canAssign, refreshKey, bump }) {
  const { data, error, reload } = useApi("/api/tenders", [refreshKey]);
  const tasks = useApi("/api/tender_tasks", [refreshKey]);
  const [editing, setEditing] = useState(null);
  const [assigning, setAssigning] = useState(null);
  const [bidOf, setBidOf] = useState(null);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const refresh = () => { reload(); tasks.reload(); bump(); };
  const run = (p) => p.then(() => { setErr(""); refresh(); }).catch((e) => setErr(e.message));
  const byTender = {}; for (const t of tasks.data || []) (byTender[t.tender] ||= []).push(t);
  const fields = TENDER_FIELDS;
  const columns = [
    { key: "title", label: "Tender", render: (r) => (<><div>{r.url ? <a href={r.url} target="_blank" rel="noreferrer" className="font-medium text-blue-700 hover:underline">{r.title}</a> : <b>{r.title}</b>}</div>
      <button onClick={() => setBidOf(r)} className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-700 hover:underline">Bid: checklist and documents <AiPill status={r.ai_status} /></button>
      {(byTender[r.id] || []).map((t) => <div key={t.id} className="text-xs text-gray-500">&rarr; {t.assignee_name || t.assignee_email}: {t.title} <span className="rounded bg-gray-100 px-1">{t.status}</span></div>)}</>), csv: (r) => r.title },
    { key: "buyer", label: "Buyer" }, { key: "country", label: "Country" },
    { key: "source", label: "Source", render: (r) => <span className="text-xs text-gray-600">{SITE_NAME[r.source] || r.source || "Added by hand"}</span>, csv: (r) => SITE_NAME[r.source] || r.source || "" },
    { key: "value", label: "Value", align: "right", render: (r) => fmtMoney(r.value, r.currency), csv: (r) => (r.value == null ? "" : `${r.currency} ${r.value}`) },
    { key: "deadline", label: "Deadline", render: (r) => <Deadline date={r.deadline} />, csv: (r) => r.deadline },
    { key: "status", label: "Status", render: (r) => canWrite
      ? <select value={r.status} onChange={(e) => run(api(`/api/tenders/${r.id}`, { method: "PATCH", body: { status: e.target.value } }))} className={`rounded-full px-2 py-0.5 text-xs font-semibold border-0 ${STATUS_TONE[r.status]}`}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select>
      : r.status, csv: (r) => r.status },
    { key: "notes", label: "Notes" },
  ];
  return (
    <div className="space-y-4">
      {(err || error) && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{err || error}</div>}
      <Totals refreshKey={refreshKey} />
      <p className="text-xs text-gray-500">Mark a tender <b>interested</b> and the AI reads its notice and bid documents and fills in the checklist. Open <b>Bid</b> on a tender to see it, or to upload documents you bought or collected.</p>
      {canWrite && <div><Btn onClick={() => setOpen(!open)}>{open ? "Close form" : "Add manually"}</Btn></div>}
      {open && canWrite && <Form fields={fields} cta="Add to pipeline" onSubmit={(v) => run(api("/api/tenders", { method: "POST", body: { ...v, source: "manual" } }))} />}
      <DataTable rows={[...(data || [])].sort((a, b) => String(a.deadline || "9999").localeCompare(String(b.deadline || "9999")))} columns={columns}
        searchKeys={["title", "buyer", "country", "notes"]} exportName="tenders" empty="No tenders in the pipeline yet. Search above and save the ones you want to chase."
        actions={canAssign ? (r) => <button className="text-xs font-medium text-green-700 hover:underline" onClick={() => setAssigning(r)}>Assign task</button> : undefined}
        onEdit={canWrite ? setEditing : undefined} onDelete={canWrite ? (r) => run(api(`/api/tenders/${r.id}`, { method: "DELETE" })) : undefined} />
      {editing && <EditDialog title="Edit tender" fields={fields} row={editing} onSave={(patch) => run(api(`/api/tenders/${editing.id}`, { method: "PATCH", body: patch }))} onClose={() => setEditing(null)} />}
      {assigning && <AssignDialog tender={assigning} onClose={() => setAssigning(null)} onDone={refresh} />}
      {bidOf && <BidPanel tender={bidOf} onClose={() => { setBidOf(null); refresh(); }} onChanged={reload} />}
    </div>
  );
}

/** Tasks given to me, and tasks I am copied on. */
function Mine({ canAssign }) {
  const { data, error, reload } = useApi("/api/tender_tasks?mine=1");
  const [err, setErr] = useState("");
  const [open, setOpen] = useState(null);
  const patch = (t, body) => api(`/api/tender_tasks/${t.id}`, { method: "PATCH", body }).then(() => { setErr(""); reload(); }).catch((e) => setErr(e.message));
  return (
    <div className="space-y-3">
      {(err || error) && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{err || error}</div>}
      {!data?.length ? <Empty>Nothing assigned to you or copied to you yet.</Empty> : data.map((t) => (
        <div key={t.id} className="bg-white border rounded-xl p-4 shadow-sm flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><b>{t.title}</b>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${t.relation === "assigned" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}>{t.relation === "assigned" ? "Assigned to you" : "Copied to you"}</span>
              {t.priority === "high" && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">high priority</span>}</div>
            <div className="text-sm text-gray-600">Tender: {t.tender_title}{t.tender_deadline ? <> · closes <Deadline date={t.tender_deadline} /></> : ""}</div>
            <div className="text-sm text-gray-500">{t.relation === "copied" && <>Assigned to <b>{t.assignee_name || t.assignee_email}</b> · </>}Due <Deadline date={t.due} /></div>
            {t.notes && <div className="text-sm text-gray-700 whitespace-pre-wrap">{t.notes}</div>}
            {t.copies.length > 0 && <div className="text-xs text-gray-400">Copied: {t.copies.map((c) => c.name || c.email).join(", ")}</div>}
            <StageSteps stage={t.stage} />
            <div className="max-w-sm"><ProgressCell task={t} /></div>
            <button onClick={() => setOpen(t.id)} className="text-sm font-semibold text-yellow-700 hover:underline">{t.relation === "assigned" ? "Update progress and requirements" : "See progress and requirements"} &rarr;</button>
          </div>
          {(t.relation === "assigned" || canAssign) && (
            <select value={t.status} onChange={(e) => patch(t, { status: e.target.value })} className="border rounded-md px-2 py-1 text-sm">
              {[["todo", "To do"], ["doing", "In progress"], ["done", "Done"]].map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          )}
        </div>
      ))}
      {open && <TaskDetail id={open} onClose={() => setOpen(null)} onChanged={reload} />}
    </div>
  );
}

export default function Tenders() {
  const [tab, setTab] = useState("search");
  const [n, setN] = useState(0);
  const [rights, setRights] = useState({ write: false, assign: false });       // read after load: rights are kept in the browser
  useEffect(() => { const u = getUser(); setRights({ write: can(u, "tenders:write"), assign: can(u, "tenders:assign") }); }, []);
  return (
    <Shell title="Tenders">
      <div className="flex gap-1 border-b">
        {[["search", "Find tenders"], ["pipeline", "Pipeline"], ["mine", "My assignments"]].map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 ${tab === k ? "border-yellow-500 text-black" : "border-transparent text-gray-500 hover:text-black"}`}>{l}</button>)}
      </div>
      {tab === "search" && <Search canWrite={rights.write} onSaved={() => setN(n + 1)} />}
      {tab === "pipeline" && <Pipeline canWrite={rights.write} canAssign={rights.assign} refreshKey={n} bump={() => setN((x) => x + 1)} />}
      {tab === "mine" && <Mine canAssign={rights.assign} />}
    </Shell>
  );
}
