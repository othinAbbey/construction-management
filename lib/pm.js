import { useCallback, useEffect, useState } from "react";

/** The API. This website talks to nothing else. Set NEXT_PUBLIC_API_URL in .env.local (see README). */
export const API = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8100").replace(/\/+$/, "");

const TOKEN = "cm_token", USER = "cm_user";
const ls = (fn, fallback = null) => { try { return fn(window.localStorage); } catch { return fallback; } };
export const getToken = () => ls((s) => s.getItem(TOKEN));
export const setToken = (t) => ls((s) => (t ? s.setItem(TOKEN, t) : s.removeItem(TOKEN)));
export const getUser = () => ls((s) => JSON.parse(s.getItem(USER) || "null"));
export const setUser = (u) => {
  ls((s) => (u ? s.setItem(USER, JSON.stringify(u)) : s.removeItem(USER)));
  try { window.dispatchEvent(new Event("pm:user")); } catch {}            // header, footer and sidebar refresh the company name/logo
};
export const startSession = ({ token, user }) => { setToken(token); setUser(user); };
export const signOut = () => { setToken(null); setUser(null); window.location.href = "/pm/login"; };

/**
 * can(user, "catalog:write"): rights come from the server (user.permissions from /api/me), so the website never
 * hard-codes which role may do what. The server enforces the same rights; this only hides what you cannot use.
 */
export const can = (user, permission) => !!user && Array.isArray(user.permissions) && user.permissions.includes(permission);

/** The product name, shown only where no company is known yet (signed out). Everywhere else the company's own name is used. */
export const PRODUCT = "Project Assistant";

/** The signed-in user's company ({ id, name, logo_url }) or null; updates when /api/me or company settings change it. */
export function useOrg() {
  const [org, setOrg] = useState(null);
  useEffect(() => {
    const read = () => setOrg(getUser()?.organization || null);
    read();
    window.addEventListener("pm:user", read); window.addEventListener("storage", read);
    return () => { window.removeEventListener("pm:user", read); window.removeEventListener("storage", read); };
  }, []);
  return org;
}

export const uid = () => Math.random().toString(36).slice(2, 10);
export const today = () => new Date().toISOString().slice(0, 10);
export const money = (n) => Number(n || 0).toLocaleString("en-UG", { maximumFractionDigits: 0 });
export const when = (iso) => (iso ? new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "");
export const size = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

/** One door to the backend. Throws Error with a readable message; a 401 sends you to sign in. */
export async function api(path, { method = "GET", body, auth = true } = {}) {
  const token = auth ? getToken() : null;
  let res;
  try {
    res = await fetch(API + path, {
      method,
      headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error("Cannot reach the server. Check that the backend is running and NEXT_PUBLIC_API_URL is right.");
  }
  const json = await res.json().catch(() => ({}));
  if (res.status === 401 && token) {
    setToken(null); setUser(null);
    if (typeof window !== "undefined" && !/\/pm\/(login|reset)/.test(window.location.pathname)) window.location.href = "/pm/login";
  }
  if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
  return json;
}

/** Load a GET endpoint: { data, error, loading, reload }. */
export function useApi(path, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const reload = useCallback(() => {
    if (!path) return Promise.resolve();
    setLoading(true);
    return api(path).then((d) => { setData(d); setError(""); }).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { reload(); }, [reload, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps
  return { data, error, loading, reload, setData };
}

const EMPTY = { projects: [], tasks: [], costs: [], logs: [], issues: [] };
const CHILD = ["tasks", "costs", "logs", "issues"];

/** Project data from the server database, with add / update / delete. */
export function usePM() {
  const [d, setD] = useState(EMPTY);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [user, setU] = useState(null);

  useEffect(() => {
    setU(getUser());
    api("/api/data").then((x) => setD({ ...EMPTY, ...x })).catch((e) => setError(e.message)).finally(() => setReady(true));
  }, []);

  const put = (k, fn) => setD((p) => ({ ...p, [k]: fn(p[k]) }));
  const run = (fn) => fn().then(() => setError("")).catch((e) => setError(e.message));

  const add = useCallback((k, item) => run(async () => { const r = await api(`/api/${k}`, { method: "POST", body: item }); put(k, (l) => [...l, r]); }), []);
  const upd = useCallback((k, id, patch) => run(async () => { const r = await api(`/api/${k}/${id}`, { method: "PATCH", body: patch }); put(k, (l) => l.map((x) => (x.id === id ? r : x))); }), []);
  const del = useCallback((k, id) => run(async () => {
    await api(`/api/${k}/${id}`, { method: "DELETE" });
    setD((p) => { const n = { ...p, [k]: p[k].filter((x) => x.id !== id) }; if (k === "projects") for (const t of CHILD) n[t] = p[t].filter((x) => x.project !== id); return n; });
  }), []);
  const nameOf = (id) => d.projects.find((p) => p.id === id)?.name || "-";
  return { d, add, upd, del, nameOf, ready, error, user };
}

export async function uploadFile(project, file, category, note) {
  const qs = new URLSearchParams({ project, name: file.name, category: category || "", note: note || "" });
  let res;
  try { res = await fetch(`${API}/api/files?${qs}`, { method: "POST", headers: { authorization: `Bearer ${getToken()}`, "content-type": "application/octet-stream" }, body: file }); }
  catch { throw new Error("Cannot reach the server."); }
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(j.error || `Upload failed (${res.status})`);
  return j;
}

export async function downloadFile(f) {
  const res = await fetch(`${API}/api/files/${f.id}/download`, { headers: { authorization: `Bearer ${getToken()}` } });
  if (!res.ok) throw new Error("Download failed");
  const url = URL.createObjectURL(await res.blob());
  const a = document.createElement("a"); a.href = url; a.download = f.name; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
