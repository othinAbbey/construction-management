import { useState } from "react";
import { Shell, Btn, Del, Empty, Field, Table } from "../../components/pm/ui";
import { api, useApi } from "../../lib/pm";

/** Admin screen: see every role, make new ones and choose exactly what each may do. */
export default function Roles() {
  const roles = useApi("/api/roles");
  const catalog = useApi("/api/permissions");
  const [editing, setEditing] = useState(null);          // a role object, or {} for a new role
  const [err, setErr] = useState("");
  const run = (p) => p.then(() => { setErr(""); roles.reload(); }).catch((e) => setErr(e.message));
  const groups = [...new Set((catalog.data || []).map((p) => p.group))];

  return (
    <Shell title="Roles & Access" error={err || roles.error || catalog.error} actions={<Btn onClick={() => setEditing({})}>+ New role</Btn>}>
      <p className="text-sm text-gray-600">A role is a named set of rights. Give each person the role that matches their job. The Administrator role always has everything and cannot be changed.</p>
      {!roles.data?.length ? <Empty>Loading...</Empty> : (
        <Table head={["Role", "What it is for", "Rights", "People", ""]}>
          {roles.data.map((r) => (
            <tr key={r.code} className="border-t align-top">
              <td className="p-2.5 font-medium">{r.name}{r.builtin && <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">built-in</span>}</td>
              <td className="p-2.5 text-gray-600">{r.description}</td>
              <td className="p-2.5">{r.permissions.includes("*") ? "Everything" : `${r.permissions.length} rights`}</td>
              <td className="p-2.5">{r.users}</td>
              <td className="p-2.5 whitespace-nowrap space-x-3">
                {r.code !== "admin" && <button className="text-xs text-blue-700 hover:underline" onClick={() => setEditing(r)}>Edit rights</button>}
                {!r.builtin && <Del onClick={() => run(api(`/api/roles/${r.code}`, { method: "DELETE" }))} />}
              </td>
            </tr>
          ))}
        </Table>
      )}
      {editing && catalog.data && <RoleEditor role={editing} groups={groups} catalog={catalog.data} onClose={() => setEditing(null)}
        onSave={(body) => run(editing.code ? api(`/api/roles/${editing.code}`, { method: "PATCH", body }) : api("/api/roles", { method: "POST", body })).then(() => setEditing(null))} />}
    </Shell>
  );
}

function RoleEditor({ role, groups, catalog, onSave, onClose }) {
  const [name, setName] = useState(role.name || "");
  const [description, setDescription] = useState(role.description || "");
  const [perms, setPerms] = useState(new Set(role.permissions || []));
  const toggle = (k) => setPerms((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const grant = catalog.filter((p) => !p.adminOnly);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); onSave({ name, description, permissions: [...perms] }); }}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[92vh] overflow-y-auto space-y-4">
        <h2 className="text-lg font-bold">{role.code ? `Edit role: ${role.name}` : "New role"}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Role name" required value={name} onChange={setName} placeholder="e.g. Estimator" />
          <Field label="What it is for" value={description} onChange={setDescription} />
        </div>
        <div className="space-y-3">
          {groups.map((g) => {
            const items = grant.filter((p) => p.group === g);
            return items.length ? (
              <fieldset key={g} className="border rounded-lg p-3"><legend className="px-1 text-xs font-semibold uppercase tracking-wide text-gray-500">{g}</legend>
                {items.map((p) => <label key={p.key} className="flex items-start gap-2 py-0.5 text-sm"><input type="checkbox" className="mt-1" checked={perms.has(p.key)} onChange={() => toggle(p.key)} />{p.label}</label>)}
              </fieldset>
            ) : null;
          })}
          <p className="text-xs text-gray-500">Creating accounts and roles is kept for the Administrator role.</p>
        </div>
        <div className="flex justify-end gap-2"><Btn kind="secondary" type="button" onClick={onClose}>Cancel</Btn><Btn disabled={!perms.size}>Save role</Btn></div>
      </form>
    </div>
  );
}
