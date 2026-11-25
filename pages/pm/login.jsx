import Link from "next/link";
import { useEffect, useState } from "react";
import PasswordField from "../../components/pm/PasswordField";
import { api, startSession } from "../../lib/pm";

export default function Login() {
  const [signup, setSignup] = useState(false);
  const isNew = signup;
  const [f, setF] = useState({ name: "", organization_name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (new URLSearchParams(window.location.search).get("signup")) setSignup(true); }, []);

  async function submit(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      const r = await api(isNew ? "/api/auth/register" : "/api/auth/login", { method: "POST", auth: false, body: f });
      startSession(r);
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.href = next && next.startsWith("/") ? next : "/pm";
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  const cls = "mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400";
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 bg-gradient-to-b from-gray-100 to-gray-200">
      <form onSubmit={submit} className="bg-white border rounded-2xl shadow-lg p-8 w-full max-w-sm space-y-4">
        <div>
          <h1 className="text-2xl font-bold">{signup ? "Create your company account" : "Sign in"}</h1>
          <p className="text-sm text-gray-500 mt-1">{signup ? "You become the administrator of a new, private workspace for your company. Invite your team from inside." : "Project manager, material sourcing and BOQ tools."}</p>
        </div>
        {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{err}</div>}
        {isNew && <label className="block text-sm">Your name<input className={cls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>}
        {isNew && <label className="block text-sm">Company name<input className={cls} required minLength={2} maxLength={120} value={f.organization_name} onChange={(e) => setF({ ...f, organization_name: e.target.value })} /></label>}
        <label className="block text-sm">Email<input className={cls} type="email" required autoComplete="username" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <PasswordField label="Password" required minLength={isNew ? 8 : 1} autoComplete={isNew ? "new-password" : "current-password"} value={f.password} onChange={(v) => setF({ ...f, password: v })} generate={isNew} />
        <button disabled={busy} className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-semibold rounded-md py-2.5">{busy ? "Please wait..." : isNew ? "Create account" : "Sign in"}</button>
        {!isNew && <div className="text-sm text-center"><Link href="/pm/reset" className="text-gray-600 hover:text-black underline">Forgot your password?</Link></div>}
        {<div className="text-sm text-center text-gray-600">{signup ? "Already have an account?" : "New here?"} <button type="button" onClick={() => { setSignup(!signup); setErr(""); }} className="underline font-medium">{signup ? "Sign in" : "Create an account"}</button></div>}
      </form>
    </div>
  );
}
