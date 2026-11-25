import { useEffect, useState } from "react";
import { Btn, Empty, Field, Panel, Select, Shell, Table } from "../../components/pm/ui";
import { api, can, getUser, useApi } from "../../lib/pm";

export default function Forms() {
  const projects = useApi("/api/projects");
  const templates = useApi("/api/form_templates");
  const forms = useApi("/api/forms");
  const [project, setProject] = useState("");
  const [template, setTemplate] = useState("");
  const [title, setTitle] = useState("");
  const [recordDate, setRecordDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("");
  const [data, setData] = useState("{}");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [detail, setDetail] = useState(null);
  const canWrite = can(getUser(), "projects:write");

  useEffect(() => {
    if (!project && projects.data?.length) setProject(projects.data[0].id);
  }, [projects.data, project]);

  function chooseTemplate(code) {
    const t = (templates.data || []).find((x) => x.code === code);
    setTemplate(code);
    setTitle(t?.name || "");
    setStatus(t?.statuses?.[0] || "");
  }

  async function create(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      let parsed;
      try { parsed = JSON.parse(data || "{}"); } catch { throw new Error("Form data must be valid JSON."); }
      await api("/api/forms", { method: "POST", body: { project, template, title, record_date: recordDate, status, data: parsed } });
      setOpen(false);
      setData("{}");
      await forms.reload();
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  async function copyForm(row) {
    try { await api(`/api/forms/${row.id}/copy`, { method: "POST" }); await forms.reload(); }
    catch (e) { setError(e.message); }
  }
  async function deleteForm(row) {
    if (!confirm("Delete this form? This cannot be undone.")) return;
    try { await api(`/api/forms/${row.id}`, { method: "DELETE" }); await forms.reload(); }
    catch (e) { setError(e.message); }
  }
  async function viewForm(row) {
    try { setDetail(await api(`/api/forms/${row.id}`)); setError(""); }
    catch (e) { setError(e.message); }
  }

  const selectedTemplate = (templates.data || []).find((x) => x.code === template);
  const rows = (forms.data || []).filter((r) => !project || r.project === project);

  return (
    <Shell title="Site Forms" error={error || projects.error || templates.error || forms.error}>
      {!projects.data?.length ? <Empty>Add a project first, then create site forms for it.</Empty> : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-72"><Select label="Project" value={project} blank={null} onChange={setProject} options={projects.data.map((p) => ({ v: p.id, l: p.name }))} /></div>
            {canWrite && <Btn onClick={() => setOpen(!open)}>{open ? "Close form" : "New form"}</Btn>}
          </div>
          {open && canWrite && (
            <Panel title="Create a site form">
              <form onSubmit={create} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Select label="Template" required value={template} blank="Choose a template" onChange={chooseTemplate} options={(templates.data || []).map((t) => ({ v: t.code, l: t.name }))} />
                <Field label="Title" value={title} onChange={setTitle} />
                <Field label="Record date" type="date" required value={recordDate} onChange={setRecordDate} />
                <Select label="Status" value={status} blank={null} onChange={setStatus} options={(selectedTemplate?.statuses || []).map((s) => ({ v: s, l: selectedTemplate?.statusLabels?.[s] || s }))} />
                <label className="text-sm text-gray-600 sm:col-span-2 lg:col-span-4">Form answers (JSON)
                  <textarea className="mt-1 w-full min-h-32 border border-gray-300 rounded-md px-3 py-2 font-mono text-xs" value={data} onChange={(e) => setData(e.target.value)} />
                </label>
                {selectedTemplate && <p className="text-xs text-gray-500 sm:col-span-2 lg:col-span-4">{selectedTemplate.description}</p>}
                <div><Btn disabled={busy || !template}>{busy ? "Creating..." : "Create form"}</Btn></div>
              </form>
            </Panel>
          )}
          {!rows.length ? <Empty>No forms for this project yet.</Empty> : (
            <Table head={["Reference", "Template", "Date", "Status", "Created by", ""]}>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2.5 font-medium">{r.reference}</td>
                  <td className="p-2.5">{r.template_name}</td>
                  <td className="p-2.5">{r.record_date}</td>
                  <td className="p-2.5">{r.status}</td>
                  <td className="p-2.5">{r.created_by_name || "-"}</td>
                  <td className="p-2.5 whitespace-nowrap space-x-3">
                    <button className="text-xs text-blue-700 hover:underline" onClick={() => viewForm(r)}>View</button>
                    {canWrite && <button className="text-xs text-gray-700 hover:underline" onClick={() => copyForm(r)}>Copy</button>}
                    {canWrite && <button className="text-xs text-red-600 hover:underline" onClick={() => deleteForm(r)}>Delete</button>}
                  </td>
                </tr>
              ))}
            </Table>
          )}
          {detail && (
            <Panel title={`${detail.reference} - ${detail.template_name}`}>
              <pre className="overflow-auto max-h-96 rounded-md bg-gray-50 p-3 text-xs">{JSON.stringify(detail, null, 2)}</pre>
              <div className="mt-3"><Btn kind="secondary" onClick={() => setDetail(null)}>Close</Btn></div>
            </Panel>
          )}
        </div>
      )}
    </Shell>
  );
}
