import { useState } from "react";
import DataTable from "./DataTable";
import EditDialog from "./EditDialog";
import { Btn, Form, Select, Shell } from "./ui";
import { can, usePM } from "../../lib/pm";

/**
 * One configurable page for a list of records (costs, logs, issues, projects, tasks...).
 * Gives every list the same search, sort, CSV export, add form, edit dialog and delete, and respects the user's rights.
 *
 *   resource      "costs"
 *   columns(ctx)  [{key,label,render?,value?}]           ctx = { d, nameOf, upd, canWrite }
 *   fields(ctx)   [{k,label,type?,options?,req?,def?}]   ctx = { d, projectId }
 *   fixedProject  show only this project (used inside the project page)
 *   embedded      render without the page frame
 */
export default function ResourcePage({ resource, title, columns, fields, searchKeys = [], header, fixedProject, embedded = false, addLabel = "Add", filterByProject = true, empty }) {
  const { d, add, upd, del, nameOf, error, user } = usePM();
  const canWrite = can(user, "projects:write");
  const [pid, setPid] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const projectId = fixedProject || pid;
  const rows = (d[resource] || []).filter((r) => !projectId || (resource === "projects" ? r.id === projectId : r.project === projectId));
  const allFields = fields({ d, projectId });
  const formFields = fixedProject ? allFields.filter((f) => f.k !== "project") : allFields;

  const content = (
    <div className="space-y-4">
      {embedded && error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}
      {header && header({ d, rows, projectId })}
      <div className="flex flex-wrap items-end gap-3 print:hidden">
        {filterByProject && !fixedProject && resource !== "projects" && d.projects.length > 0 && (
          <div className="w-60"><Select label="Project" value={pid} blank="All projects" onChange={setPid} options={d.projects.map((p) => ({ v: p.id, l: p.name }))} /></div>
        )}
        {canWrite && <Btn onClick={() => setOpen(!open)}>{open ? "Close form" : addLabel}</Btn>}
      </div>
      {open && canWrite && <Form key={projectId} fields={formFields} cta="Save" onSubmit={(v) => add(resource, fixedProject ? { ...v, project: fixedProject } : v)} />}
      <DataTable rows={rows} columns={columns({ d, nameOf, upd, canWrite })} searchKeys={searchKeys} exportName={resource} empty={empty || (resource !== "projects" && !d.projects.length ? "Add a project first." : "Nothing here yet.")}
        onEdit={canWrite ? setEditing : undefined} onDelete={canWrite ? (r) => del(resource, r.id) : undefined} />
      {editing && <EditDialog title={`Edit ${title ? title.toLowerCase() : "record"}`} fields={formFields} row={editing} onSave={(patch) => upd(resource, editing.id, patch)} onClose={() => setEditing(null)} />}
    </div>
  );
  return embedded ? content : <Shell title={title} error={error}>{content}</Shell>;
}
