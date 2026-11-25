import { useEffect, useState } from "react";
import { Shell, Panel, Btn } from "../../components/pm/ui";
import { Logo } from "../../components/Brand";
import { api, can, getUser, setUser, useApi } from "../../lib/pm";

const MAX_SIDE = 256;          // logos are shown small; shrinking keeps them well under the server's 512 KB limit

/** Reads any image the browser can open (PNG, JPEG, SVG, WebP...) and redraws it as a small PNG data URL. */
function toLogo(file) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("Choose an image file (PNG, JPEG, SVG or WebP)."));
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth || MAX_SIDE, img.naturalHeight || MAX_SIDE));
      const c = document.createElement("canvas");
      c.width = Math.max(1, Math.round((img.naturalWidth || MAX_SIDE) * scale));
      c.height = Math.max(1, Math.round((img.naturalHeight || MAX_SIDE) * scale));
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      let out = c.toDataURL("image/png");
      if (out.length > 600_000) out = c.toDataURL("image/jpeg", 0.85);
      resolve(out);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That image could not be read.")); };
    img.src = url;
  });
}

/** Company name and logo, shown in the header, sidebar, footer and browser tab for everyone in the company. Admins only. */
export default function CompanySettings() {
  const { data: org, error, reload } = useApi("/api/organization");
  const [name, setName] = useState("");
  const [logo, setLogo] = useState(null);
  const [msg, setMsg] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const [admin, setAdmin] = useState(true);

  useEffect(() => { setAdmin(can(getUser(), "users:manage")); }, []);
  useEffect(() => { if (org) { setName(org.name); setLogo(org.logo_url); } }, [org]);

  async function pick(e) {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file) return;
    setErr(""); setMsg("");
    try { setLogo(await toLogo(file)); } catch (x) { setErr(x.message); }
  }

  async function save(e) {
    e.preventDefault(); setErr(""); setMsg(""); setBusy(true);
    try {
      const saved = await api("/api/organization", { method: "PATCH", body: { name, logo_url: logo } });
      const u = getUser(); if (u) setUser({ ...u, organization: saved });          // header and sidebar update at once
      setMsg("Saved. Everyone in your company will see the new name and logo.");
      reload?.();
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }

  const preview = { name: name || org?.name || "", logo_url: logo };
  const changed = org && (name.trim() !== org.name || logo !== org.logo_url);
  return (
    <Shell title="Company Settings" error={error || err}>
      {!admin && <div className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3">Only an administrator can change the company name and logo.</div>}
      {msg && <div className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg p-3">{msg}</div>}
      {org && (
        <form onSubmit={save} className="grid gap-5 lg:grid-cols-2">
          <Panel title="Company">
            <label className="block text-sm">Company name
              <input className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required minLength={2} maxLength={120} disabled={!admin} value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <div className="mt-5 text-sm">Logo</div>
            <div className="mt-2 flex items-center gap-4">
              <Logo org={preview} size="h-20 w-20" className="border" />
              <div className="space-y-2">
                <label className={`inline-block rounded-md border px-3 py-1.5 text-sm ${admin ? "cursor-pointer hover:bg-gray-50" : "opacity-50"}`}>
                  {logo ? "Replace logo" : "Upload logo"}
                  <input type="file" accept="image/*" className="hidden" disabled={!admin} onChange={pick} />
                </label>
                {logo && admin && <button type="button" onClick={() => setLogo(null)} className="block text-xs text-red-600 hover:underline">Remove logo</button>}
                <p className="text-xs text-gray-500">PNG, JPEG, SVG or WebP. It is resized to fit {MAX_SIDE}×{MAX_SIDE}. Until you upload one, your initials are shown.</p>
              </div>
            </div>
            {admin && <div className="mt-6"><Btn disabled={busy || !changed}>{busy ? "Saving..." : "Save changes"}</Btn></div>}
          </Panel>
          <Panel title="Preview">
            <div className="rounded-lg bg-black p-4 flex items-center gap-3">
              <Logo org={preview} className="border border-yellow-500/40" />
              <div className="text-white font-bold text-sm tracking-wide truncate">{preview.name}</div>
            </div>
            <p className="mt-3 text-sm text-gray-600">This is how your company appears in the header, the sidebar, the footer and the browser tab. Other companies never see your projects, people or settings.</p>
          </Panel>
        </form>
      )}
    </Shell>
  );
}
