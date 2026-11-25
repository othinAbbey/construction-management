import Link from "next/link";
import { useEffect, useState } from "react";
import PasswordField from "../../components/pm/PasswordField";
import { api, startSession } from "../../lib/pm";

export default function Login() {
  const [setup, setSetup] = useState(false);
  const [signup, setSignup] = useState(false);
  const isNew = setup || signup;
  const [f, setF] = useState({ name: "", organization_name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { api("/api/health", { auth: false }).then((h) => setSetup(h.setup_required)).catch((e) => setErr(e.message)); }, []);

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
          <h1 className="text-2xl font-bold">{setup ? "Create the admin account" : signup ? "Create your account" : "Sign in"}</h1>
          <p className="text-sm text-gray-500 mt-1">{setup ? "First run: this account becomes the administrator." : signup ? "Browse material rates, use the calculator and extract BOQs from your drawings." : "Project manager, material sourcing and BOQ tools."}</p>
        </div>
        {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{err}</div>}
        {isNew && <label className="block text-sm">Name<input className={cls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>}
        {isNew && <label className="block text-sm">Company name<input className={cls} required minLength={2} maxLength={120} value={f.organization_name} onChange={(e) => setF({ ...f, organization_name: e.target.value })} /></label>}
        <label className="block text-sm">Email<input className={cls} type="email" required autoComplete="username" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <PasswordField label="Password" required minLength={isNew ? 8 : 1} autoComplete={isNew ? "new-password" : "current-password"} value={f.password} onChange={(v) => setF({ ...f, password: v })} generate={isNew} />
        <button disabled={busy} className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-semibold rounded-md py-2.5">{busy ? "Please wait..." : isNew ? "Create account" : "Sign in"}</button>
        {!isNew && <div className="text-sm text-center"><Link href="/pm/reset" className="text-gray-600 hover:text-black underline">Forgot your password?</Link></div>}
        {!setup && <div className="text-sm text-center text-gray-600">{signup ? "Already have an account?" : "New here?"} <button type="button" onClick={() => { setSignup(!signup); setErr(""); }} className="underline font-medium">{signup ? "Sign in" : "Create an account"}</button></div>}
      </form>
    </div>
  );
}
