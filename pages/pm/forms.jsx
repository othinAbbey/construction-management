import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Btn, Empty, Panel, Select, Shell, Table } from "../../components/pm/ui";
import SiteForm from "../../components/pm/SiteForm";
import { api, can, getUser, today, useApi } from "../../lib/pm";

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : "");
const statusLabel = (t, s) => t?.statusLabels?.[s] || cap(s);
const TONE = ["bg-gray-100 text-gray-700", "bg-blue-100 text-blue-800", "bg-amber-100 text-amber-800", "bg-green-100 text-green-800"];
function StatusBadge({ template, status }) {
  const i = Math.max(0, template?.statuses.indexOf(status) ?? 0), last = template && i === template.statuses.length - 1 && i > 0;
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${last ? TONE[3] : TONE[Math.min(i, 2)]}`}>{statusLabel(template, status)}</span>;
}
function Progress({ summary }) {
  if (!summary) return null;
  const parts = [];
  if (summary.checks) parts.push(<span key="c">{summary.checks.answered}/{summary.checks.total} checked{summary.checks.fail ? <span className="text-red-600 font-medium"> · {summary.checks.fail} failed</span> : null}</span>);
  if (summary.open !== null && summary.open !== undefined) parts.push(<span key="o" className={summary.open ? "text-amber-700 font-medium" : "text-green-700"}>{summary.open ? `${summary.open} open` : "none open"}</span>);
  return <span className="text-xs text-gray-600 space-x-2">{parts}</span>;
}

/** Site forms: pick a form, fill it in on screen, save as draft, move it through its statuses, print it. */
export default function Forms() {
  const router = useRouter();
  const projects = useApi("/api/projects");
  const templates = useApi("/api/form_templates");
  const forms = useApi("/api/forms");
  const [project, setProject] = useState("");
  const [type, setType] = useState(""), [state, setState] = useState("");
  const [error, setError] = useState("");
  const [canWrite, setCanWrite] = useState(false);
  useEffect(() => { setCanWrite(can(getUser(), "projects:write")); }, []);

  const byCode = useMemo(() => Object.fromEntries((templates.data || []).map((t) => [t.code, t])), [templates.data]);
  useEffect(() => {
    if (project || !projects.data?.length) return;
    const q = router.query.project;
    setProject(projects.data.some((p) => p.id === q) ? q : projects.data[0].id);
  }, [projects.data, project, router.query.project]);

  const go = (query) => router.push({ pathname: "/pm/forms", query }, undefined, { shallow: true });
  const { form: openId, new: newCode } = router.query;

  if (templates.data && (openId || (newCode && byCode[newCode]))) {
    return <Editor key={openId || `new-${newCode}`} id={openId} template={newCode ? byCode[newCode] : null} byCode={byCode} project={project}
      projects={projects.data || []} canWrite={canWrite} onClose={() => { forms.reload(); go(project ? { project } : {}); }}
      onCreated={(id) => { forms.reload(); go({ form: id }); }} />;
  }

  const rows = (forms.data || []).filter((r) => (!project || r.project === project) && (!type || r.template === type) && (!state || r.status === state));
  async function copyForm(row) {
    try { const c = await api(`/api/forms/${row.id}/copy`, { method: "POST" }); await forms.reload(); go({ form: c.id }); } catch (e) { setError(e.message); }
  }
  async function deleteForm(row) {
    if (!confirm(`Delete ${row.reference}? This cannot be undone.`)) return;
    try { await api(`/api/forms/${row.id}`, { method: "DELETE" }); await forms.reload(); } catch (e) { setError(e.message); }
  }
  const statuses = [...new Set((type ? [byCode[type]] : templates.data || []).flatMap((t) => t?.statuses || []))];

  return (
    <Shell title="Site Forms" error={error || projects.error || templates.error || forms.error}>
      {!projects.data ? null : !projects.data.length ? <Empty>Add a project first, then fill in site forms for it.</Empty> : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-64"><Select label="Project" value={project} blank={null} onChange={(v) => { setProject(v); go({ project: v }); }} options={projects.data.map((p) => ({ v: p.id, l: p.name }))} /></div>
            <div className="w-56"><Select label="Form" value={type} blank="All forms" onChange={(v) => { setType(v); setState(""); }} options={(templates.data || []).map((t) => ({ v: t.code, l: t.name }))} /></div>
            <div className="w-44"><Select label="Status" value={state} blank="Any status" onChange={setState} options={statuses.map((s) => ({ v: s, l: statusLabel(type && byCode[type], s) }))} /></div>
          </div>

          {canWrite && (
            <Panel title="Start a new form">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {(templates.data || []).map((t) => (
                  <button key={t.code} onClick={() => go({ new: t.code, project })} className="text-left rounded-lg border p-3 hover:border-yellow-500 hover:bg-yellow-50 transition">
                    <div className="text-xs font-semibold text-yellow-700">{t.prefix}</div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="mt-1 text-xs text-gray-600 line-clamp-3">{t.description}</div>
                  </button>
                ))}
              </div>
            </Panel>
          )}

          {!rows.length ? <Empty>No forms {type || state ? "match these filters" : "for this project yet"}.</Empty> : (
            <Table head={["Reference", "Form", "Title", "Date", "Status", "Progress", "By", ""]}>
              {rows.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="p-2.5 font-medium whitespace-nowrap"><button className="text-blue-700 hover:underline" onClick={() => go({ form: r.id })}>{r.reference}</button></td>
                  <td className="p-2.5">{r.template_name}</td>
                  <td className="p-2.5 text-gray-700">{r.title && r.title !== r.template_name ? r.title : ""}</td>
                  <td className="p-2.5 whitespace-nowrap">{r.record_date}</td>
                  <td className="p-2.5"><StatusBadge template={byCode[r.template]} status={r.status} /></td>
                  <td className="p-2.5"><Progress summary={r.summary} /></td>
                  <td className="p-2.5 text-gray-600">{r.created_by_name || "-"}</td>
                  <td className="p-2.5 whitespace-nowrap space-x-3">
                    <button className="text-xs text-blue-700 hover:underline" onClick={() => go({ form: r.id })}>{canWrite ? "Open" : "View"}</button>
                    {canWrite && <button className="text-xs text-gray-700 hover:underline" title="New draft with the same answers" onClick={() => copyForm(r)}>Copy</button>}
                    {canWrite && <button className="text-xs text-red-600 hover:underline" onClick={() => deleteForm(r)}>Delete</button>}
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </div>
      )}
    </Shell>
  );
}

/** Fill in a new form, or open a saved one. */
function Editor({ id, template: newTemplate, byCode, project, projects, canWrite, onClose, onCreated }) {
  const [rec, setRec] = useState(null);                       // saved record (null for a new form)
  const [data, setData] = useState({});
  const [title, setTitle] = useState(newTemplate?.name || "");
  const [date, setDate] = useState(today());
  const [status, setStatus] = useState(newTemplate?.statuses[0] || "");
  const [error, setError] = useState(""), [saved, setSaved] = useState(""), [busy, setBusy] = useState(false), [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!id) return;
    api(`/api/forms/${id}`).then((r) => { setRec(r); setData(r.data || {}); setTitle(r.title || ""); setDate(r.record_date); setStatus(r.status); }).catch((e) => setError(e.message));
  }, [id]);
  useEffect(() => {                                           // warn before leaving with unsaved answers
    const h = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", h); return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const template = newTemplate || (rec && byCode[rec.template]);
  const projectName = projects.find((p) => p.id === (rec?.project || project))?.name;
  const readOnly = !canWrite;
  const change = (fn) => (v) => { fn(v); setDirty(true); setSaved(""); };

  async function save(nextStatus = status) {
    setBusy(true); setError(""); setSaved("");
    try {
      if (!rec) {
        const r = await api("/api/forms", { method: "POST", body: { project, template: template.code, title, record_date: date, status: nextStatus, data } });
        setDirty(false); onCreated(r.id); return;
      }
      const r = await api(`/api/forms/${rec.id}`, { method: "PATCH", body: { title, record_date: date, status: nextStatus, data, if_updated: rec.updated } });
      setRec(r); setData(r.data || {}); setStatus(r.status); setDirty(false);
      setSaved(nextStatus !== rec.status ? `Saved and marked as "${statusLabel(template, r.status)}".` : "Saved.");
    } catch (e) { setError(e.message); window.scrollTo({ top: 0, behavior: "smooth" }); } finally { setBusy(false); }
  }

  if (!template) return <Shell title="Site Form" error={error}>{!error && <p className="text-sm text-gray-500">Loading...</p>}</Shell>;
  const at = template.statuses.indexOf(rec?.status ?? status), next = template.statuses[at + 1];
  const back = () => { if (!dirty || confirm("Leave without saving your changes?")) onClose(); };

  return (
    <Shell title={rec ? `${rec.reference} · ${template.name}` : `New ${template.name}`} error={error}
      actions={<>
        <Btn kind="secondary" onClick={back}>Back to forms</Btn>
        {rec && <Btn kind="secondary" onClick={() => window.print()}>Print</Btn>}
      </>}>
      {saved && <div className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg p-3 print:hidden">{saved}</div>}
      <div className="hidden print:block text-sm text-gray-600">{projectName}</div>

      <Panel>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div className="text-gray-600">Project<div className="mt-1 py-1.5 font-medium text-gray-900">{projectName || "-"}</div></div>
          <label className="text-gray-600">Title
            <input className="mt-1 w-full border border-gray-300 rounded-md px-2.5 py-1.5 disabled:bg-gray-50" disabled={readOnly} value={title} onChange={(e) => change(setTitle)(e.target.value)} />
          </label>
          <label className="text-gray-600">Date
            <input className="mt-1 w-full border border-gray-300 rounded-md px-2.5 py-1.5 disabled:bg-gray-50" type="date" required disabled={readOnly} value={date} onChange={(e) => change(setDate)(e.target.value)} />
          </label>
          <div className="text-gray-600">Status
            <div className="mt-1 py-1"><StatusBadge template={template} status={rec?.status ?? status} /></div>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500 print:hidden">{template.description} Fields marked <span className="text-red-600">*</span> are needed before the form can move past draft; a draft can be saved half-finished.</p>
        {rec && <p className="mt-1 text-xs text-gray-400 print:hidden">Created by {rec.created_by_name || "-"}{rec.updated && rec.updated !== rec.created ? ` · last saved ${new Date(rec.updated).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}` : ""}</p>}
      </Panel>

      <SiteForm template={template} data={data} onChange={change(setData)} status={next || (rec?.status ?? status)} disabled={readOnly} />

      {canWrite && (
        <div className="sticky bottom-0 z-10 -mx-4 md:-mx-8 px-4 md:px-8 py-3 bg-white/95 backdrop-blur border-t flex flex-wrap items-center gap-3 print:hidden">
          <Btn kind="secondary" disabled={busy} onClick={() => save(rec?.status ?? status)}>{busy ? "Saving..." : rec ? "Save" : `Save as ${statusLabel(template, status).toLowerCase()}`}</Btn>
          {next && <Btn disabled={busy} onClick={() => save(next)}>Save and mark as {statusLabel(template, next)}</Btn>}
          {rec && at > 0 && <button type="button" disabled={busy} className="text-xs text-gray-600 hover:underline" onClick={() => save(template.statuses[at - 1])}>Move back to {statusLabel(template, template.statuses[at - 1])}</button>}
          {dirty && <span className="text-xs text-amber-700">Unsaved changes</span>}
        </div>
      )}
    </Shell>
  );
}
