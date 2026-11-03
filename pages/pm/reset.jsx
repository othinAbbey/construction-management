import Link from "next/link";
import { useState } from "react";
import PasswordField from "../../components/pm/PasswordField";
import { api, startSession } from "../../lib/pm";

export default function Reset() {
  const [f, setF] = useState({ email: "", code: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    try { startSession(await api("/api/auth/reset", { method: "POST", auth: false, body: f })); window.location.href = "/pm"; }
    catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  const cls = "mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400";
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 bg-gradient-to-b from-gray-100 to-gray-200">
      <form onSubmit={submit} className="bg-white border rounded-2xl shadow-lg p-8 w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Reset your password</h1>
        <p className="text-sm text-gray-500">Ask your administrator for a one-time reset code, then enter it here. Codes work once and expire.</p>
        {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">{err}</div>}
        <label className="block text-sm">Email<input className={cls} type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <label className="block text-sm">Reset code<input className={`${cls} font-mono uppercase`} required placeholder="XXXXX-XXXXX" value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} /></label>
        <PasswordField label="New password (8+ characters)" required minLength={8} autoComplete="new-password" value={f.password} onChange={(v) => setF({ ...f, password: v })} generate />
        <button disabled={busy} className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-semibold rounded-md py-2.5">{busy ? "Please wait..." : "Set new password"}</button>
        <div className="text-sm text-center"><Link href="/pm/login" className="text-gray-600 underline">Back to sign in</Link></div>
      </form>
    </div>
  );
}
