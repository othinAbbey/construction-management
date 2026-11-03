import { useEffect, useState } from "react";
import { Shell, Btn, Del, Field, Form, Panel, Select, Table } from "../../components/pm/ui";
import { api, can, getUser, setUser, startSession, useApi, when } from "../../lib/pm";

export default function Team() {
  const [me, setMe] = useState(null);
  useEffect(() => { setMe(getUser()); api("/api/me").then((u) => { setUser(u); setMe(u); }).catch(() => {}); }, []);
  const admin = can(me, "users:manage");
  const users = useApi(admin ? "/api/users" : null, [admin]);
  const roles = useApi(admin ? "/api/roles" : null, [admin]);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [pw, setPw] = useState({ current: "", password: "", again: "" });
  const [code, setCode] = useState(null);
  const run = (fn, msg) => fn().then(() => { setErr(""); if (msg) setOk(msg); }).catch((e) => { setOk(""); setErr(e.message); });
  const roleOptions = (roles.data || []).map((r) => ({ v: r.code, l: r.name }));

  const changePassword = (e) => {
    e.preventDefault();
    if (pw.password !== pw.again) return setErr("The two new passwords do not match.");
    run(async () => { startSession(await api("/api/me/password", { method: "POST", body: { current: pw.current, password: pw.password } })); setPw({ current: "", password: "", again: "" }); },
      "Password changed. Other devices have been signed out.");
  };

  return (
    <Shell title="Team & Security" error={err || users.error || roles.error}>
      {ok && <div className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg p-3">{ok}</div>}
      <Panel title="Change my password">
        <form onSubmit={changePassword} className="grid gap-3 sm:grid-cols-4 items-end">
          <Field label="Current password" type="password" required value={pw.current} onChange={(v) => setPw({ ...pw, current: v })} autoComplete="current-password" />
          <Field label="New password (8+)" type="password" required minLength={8} value={pw.password} onChange={(v) => setPw({ ...pw, password: v })} autoComplete="new-password" />
          <Field label="Repeat new password" type="password" required minLength={8} value={pw.again} onChange={(v) => setPw({ ...pw, again: v })} autoComplete="new-password" />
          <Btn>Change password</Btn>
        </form>
      </Panel>

      {admin && (
        <>
          {code && (
            <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 text-sm">
              <div>One-time reset code for <b>{code.email}</b>:</div>
              <div className="font-mono text-2xl tracking-widest my-2">{code.code}</div>
              <div className="text-gray-600">Give it to them privately. It works once and expires {when(code.expires)}. They enter it at <b>Sign in &rarr; Forgot your password?</b></div>
              <button className="mt-2 text-xs underline" onClick={() => setCode(null)}>Hide</button>
            </div>
          )}
          <Panel title="Create an account">
            <Form cta="Create account" onSubmit={(v) => run(async () => { await api("/api/users", { method: "POST", body: v }); await users.reload(); await roles.reload(); }, `Account created for ${v.email}. Give them the password you chose; they can change it after signing in.`)} fields={[
              { k: "name", label: "Name" }, { k: "email", label: "Email", type: "email", req: true },
              { k: "password", label: "Temporary password (8+)", type: "password", req: true, generate: true },
              { k: "role", label: "Role", def: "user", req: true, options: roleOptions },
            ]} />
            <div className="mt-3 grid gap-1 text-xs text-gray-500 sm:grid-cols-2">
              {(roles.data || []).map((r) => <div key={r.code}><b className="text-gray-700">{r.name}:</b> {r.description || "Custom role"}</div>)}
            </div>
            <p className="mt-2 text-xs text-gray-500">Need a different mix of access? Create a role on the <a className="underline" href="/pm/roles">Roles &amp; Access</a> page.</p>
          </Panel>
          <Table head={["Name", "Email", "Role", "Status", "Added", ""]}>
            {(users.data || []).map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2.5">{u.name}</td><td className="p-2.5">{u.email}</td>
                <td className="p-2.5"><Select label="" value={u.role || ""} blank={null} onChange={(role) => run(async () => { await api(`/api/users/${u.id}`, { method: "PATCH", body: { role } }); await users.reload(); await roles.reload(); })} options={roleOptions} /></td>
                <td className="p-2.5"><span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${u.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`}>{u.status}</span></td>
                <td className="p-2.5 whitespace-nowrap">{when(u.created)}</td>
                <td className="p-2.5 whitespace-nowrap space-x-3">
                  <button className="text-xs text-blue-700 hover:underline" onClick={() => run(async () => setCode(await api(`/api/users/${u.id}/reset`, { method: "POST" })))}>Reset password</button>
                  {u.id !== me?.id && <button className="text-xs text-blue-700 hover:underline" onClick={() => run(async () => { await api(`/api/users/${u.id}`, { method: "PATCH", body: { status: u.status === "active" ? "disabled" : "active" } }); await users.reload(); })}>{u.status === "active" ? "Disable" : "Enable"}</button>}
                  {u.id !== me?.id && <Del onClick={() => run(async () => { await api(`/api/users/${u.id}`, { method: "DELETE" }); await users.reload(); await roles.reload(); })} />}
                </td>
              </tr>
            ))}
          </Table>
        </>
      )}
    </Shell>
  );
}
