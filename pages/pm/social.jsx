import { useEffect, useMemo, useRef, useState } from "react";
import { Btn, Empty, Shell, Table } from "../../components/pm/ui";
import { api, sendFile, useApi, when } from "../../lib/pm";
import AdvertMaker, { MusicPicker, Preview, audioMessage, useMusic } from "../../components/pm/AdvertMaker";
import { renderMusic } from "../../lib/socialMusic";
import { duration, renderVideo } from "../../lib/socialVideo";

const STATUS = { draft: ["Draft", "bg-gray-100 text-gray-700"], approved: ["Approved", "bg-blue-100 text-blue-800"], posted: ["Posted", "bg-green-100 text-green-800"], skipped: ["Skipped", "bg-yellow-100 text-yellow-800"] };
const KIND = { tender: "Tender", subcontract: "Subcontract", availability: "Team available" };
const Badge = ({ s }) => { const [l, c] = STATUS[s] || [s, "bg-gray-100"]; return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${c}`}>{l}</span>; };
const dayText = (d) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

function SlideRow({ s, i, n, editable, onChange, onMove, onRemove }) {
  return (
    <div className="border rounded-xl p-3 bg-white space-y-2">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-gray-500">{i + 1}.</span>
        <span className={`rounded-full px-2 py-0.5 font-semibold ${s.kind === "tender" ? "bg-blue-50 text-blue-800" : "bg-orange-50 text-orange-800"}`}>{KIND[s.kind]}</span>
        <span className="text-gray-500">{s.source_name}</span>
        {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">Open the notice</a>}
        {editable && <span className="ml-auto flex gap-1">
          <button disabled={i === 0} onClick={() => onMove(-1)} className="rounded border px-2 disabled:opacity-30" aria-label="Move up">↑</button>
          <button disabled={i === n - 1} onClick={() => onMove(1)} className="rounded border px-2 disabled:opacity-30" aria-label="Move down">↓</button>
          <button disabled={n === 1} onClick={onRemove} className="rounded border px-2 text-red-700 disabled:opacity-30">Remove</button>
        </span>}
      </div>
      {editable
        ? <input value={s.headline} maxLength={80} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border px-3 py-2 font-semibold" aria-label="Headline on the video" />
        : <div className="font-semibold">{s.headline}</div>}
      <div className="text-xs text-gray-600 space-y-0.5">
        {s.headline !== s.title && <div>Notice title: {s.title}</div>}
        <div>{[s.who, s.place, s.closes ? `${s.kind === "tender" ? "closes" : "apply by"} ${s.closes}` : s.kind === "tender" ? "closing date: see notice" : null, s.value].filter(Boolean).join(" · ")}</div>
      </div>
    </div>
  );
}

const BLANK = { notice_type: "Tender", method: null, title: "", buyer: "", reference: null, place: null, summary: null, fee: null, funded_by: null, how_to_apply: null, closes_date: null, closes_time: null, website: null };

/** One-click adverts: from a photo or screenshot of a notice (the AI reads it), or filled in by hand. */
function MakeAdvert() {
  const [open, setOpen] = useState(null), [found, setFound] = useState(null), [busy, setBusy] = useState(false), [err, setErr] = useState("");
  async function read(file) {
    if (!file) return;
    setErr(""); setFound(null); setBusy(true);
    try {
      const r = await sendFile("/api/social/read-notice", file);
      if (r.notices.length === 1) setOpen({ notice: r.notices[0], caption: r.caption }); else setFound(r);
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  }
  return (
    <div className="bg-white border rounded-xl p-4 space-y-3">
      <div><h2 className="font-semibold text-gray-900">Make an advert</h2>
        <p className="text-sm text-gray-600">Upload a photo or screenshot of a notice (newspaper, website, PDF) and the AI fills in the advert. Or use "Make advert" on any result under Tenders &gt; Find tenders.</p></div>
      <div className="flex flex-wrap items-center gap-2">
        <label className={`rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-black cursor-pointer ${busy ? "opacity-60 pointer-events-none" : ""}`}>
          {busy ? "Reading the notice..." : "Upload a notice photo"}
          <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="hidden" onChange={(e) => { read(e.target.files?.[0]); e.target.value = ""; }} />
        </label>
        <button onClick={() => setOpen({ notice: BLANK })} className="rounded-lg border px-4 py-2 text-sm font-semibold">Fill in by hand</button>
      </div>
      {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{err}</div>}
      {found && <div className="space-y-1"><div className="text-sm text-gray-700">That picture has {found.notices.length} notices. Pick one:</div>
        {found.notices.map((n, i) => <button key={i} onClick={() => setOpen({ notice: n, caption: i === 0 ? found.caption : "" })} className="block w-full text-left rounded-lg border px-3 py-2 text-sm hover:bg-yellow-50"><b>{n.title}</b><span className="text-gray-500"> · {n.buyer}{n.closes_date ? ` · closes ${n.closes_date}` : ""}</span></button>)}
      </div>}
      {open && <AdvertMaker notice={open.notice} caption={open.caption} onClose={() => setOpen(null)} />}
    </div>
  );
}

/**
 * Social Posts: Buildsuite360's daily TikTok / WhatsApp Status video of new tenders and featured subcontracts.
 * A draft is made each morning. Check it, change it if needed, approve it, save the MP4, post it, then mark it posted.
 */
export default function SocialPosts() {
  const { data: posts, error, reload } = useApi("/api/social/posts");
  const [openId, setOpenId] = useState(null);
  const post = useMemo(() => (posts || []).find((p) => p.id === openId) || posts?.[0] || null, [posts, openId]);
  const [edit, setEdit] = useState(null);
  const [msg, setMsg] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(""), [progress, setProgress] = useState(0), [url, setUrl] = useState("");

  useEffect(() => { if (post) setEdit({ items: post.items, caption: post.caption, hashtags: post.hashtags }); setUrl(""); }, [post?.id, post?.updated]); // eslint-disable-line react-hooks/exhaustive-deps
  const dirty = post && edit && (JSON.stringify(edit.items.map((s) => [s.ref, s.headline])) !== JSON.stringify(post.items.map((s) => [s.ref, s.headline])) || edit.caption !== post.caption || edit.hashtags !== post.hashtags);
  const view = post && edit ? { ...post, items: edit.items } : post;
  const [music, setMusic] = useState("upbeat");
  const audio = useMusic(view || { items: [] }, music);
  const editable = post && (post.status === "draft" || post.status === "approved");
  const spare = post && edit ? [...post.items, ...post.spare].filter((s) => !edit.items.some((i) => i.ref === s.ref)) : [];

  async function run(label, fn, done) {
    setErr(""); setMsg(""); setBusy(label);
    try { const r = await fn(); await reload(); if (r?.id) setOpenId(r.id); if (done) setMsg(done); } catch (e) { setErr(e.message); } finally { setBusy(""); }
  }
  const make = (replace) => run("make", () => api("/api/social/posts/generate", { method: "POST", body: { replace }, timeout: 120000 }), replace ? "A new draft was made." : "Today's draft is ready.");
  const save = () => run("save", () => api(`/api/social/posts/${post.id}`, { method: "PATCH", body: { items: edit.items.map((s) => ({ ref: s.ref, headline: s.headline })), caption: edit.caption, hashtags: edit.hashtags } }), "Changes saved.");
  const act = (path, body, done) => run(path, () => api(`/api/social/posts/${post.id}/${path}`, { method: "POST", body }), done);
  const setItems = (items) => setEdit((e) => ({ ...e, items }));

  async function download() {
    setErr(""); setBusy("video"); setProgress(0);
    try {
      const { blob, ext, audioNote } = await renderVideo(view, { onProgress: setProgress, audio: music === "none" ? null : audio || await renderMusic(duration(view), music) });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `buildsuite360-tenders-${post.day}.${ext}`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 60000);
      setMsg(audioMessage(ext, audioNote));
    } catch (e) { setErr(`The video could not be made here (${e.message}). Try Chrome or Edge on a computer.`); } finally { setBusy(""); }
  }
  async function copyCaption() {
    try { await navigator.clipboard.writeText(`${edit.caption}\n\n${edit.hashtags}`.trim()); setMsg("Caption and hashtags copied."); } catch { setErr("Copy didn't work in this browser: select the caption and copy it."); }
  }

  return (
    <Shell title="Adverts & Social Posts" error={error}>
      <p className="text-sm text-gray-600 -mt-2">A short portrait video of new tenders and featured subcontracts is made each morning for TikTok and WhatsApp Status. Check it, approve it, download it, post it from your phone, then mark it posted. Only the people on the Buildsuite360 team list see this page.</p>
      {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{err}</div>}
      {msg && <div className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg p-3">{msg}</div>}

      <MakeAdvert />
      <h2 className="text-lg font-semibold text-gray-900 pt-2">Daily post</h2>

      {!posts ? <p className="text-sm text-gray-500">Loading...</p> : !post ? (
        <Empty>No posts yet. <button onClick={() => make(false)} disabled={!!busy} className="ml-1 font-semibold text-blue-700 hover:underline">{busy === "make" ? "Making today's draft..." : "Make today's draft now"}</button></Empty>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold">{dayText(post.day)}</h2><Badge s={post.status} />
            <span className="text-xs text-gray-500">{post.made_by === "ai" ? "Chosen and worded by the AI; facts copied from the notices" : "Newest notices, chosen automatically"}</span>
            {!posts.some((p) => p.day === new Date(Date.now() + 3 * 3600000).toISOString().slice(0, 10)) && <Btn kind="secondary" disabled={!!busy} onClick={() => make(false)}>{busy === "make" ? "Making today's draft..." : "Make today's draft"}</Btn>}
          </div>

          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <div className="space-y-3"><Preview post={view} audio={audio} width={340} /><div style={{ maxWidth: 340 }}><MusicPicker value={music} onChange={setMusic} /></div></div>

            <div className="space-y-4 min-w-0">
              <div className="flex flex-wrap gap-2">
                {post.status === "draft" && <Btn disabled={!!busy || dirty} onClick={() => act("approve", null, "Approved. Download the video and post it.")} title={dirty ? "Save your changes first" : ""}>Approve</Btn>}
                {(post.status === "approved" || post.status === "posted") && <Btn disabled={!!busy || dirty} onClick={download}>{busy === "video" ? `Making the video... ${Math.round(progress * 100)}%` : "Download MP4"}</Btn>}
                {editable && <Btn kind="secondary" disabled={!!busy} onClick={copyCaption}>Copy caption</Btn>}
                {dirty && <Btn disabled={!!busy} onClick={save}>{busy === "save" ? "Saving..." : post.status === "approved" ? "Save (back to draft)" : "Save changes"}</Btn>}
                {post.status === "draft" && <Btn kind="secondary" disabled={!!busy} onClick={() => confirm("Make a new draft for this day? Your changes to this one are lost.") && make(true)}>{busy === "make" ? "Making..." : "Make a new draft"}</Btn>}
                {editable && <Btn kind="secondary" disabled={!!busy} onClick={() => confirm("Skip this day's post?") && act("skip", null, "Skipped.")}>Skip today</Btn>}
              </div>

              {post.status === "approved" && (
                <div className="flex flex-wrap items-end gap-2 bg-white border rounded-xl p-3">
                  <label className="flex-1 min-w-[240px] text-sm">Link to the TikTok post (optional)
                    <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.tiktok.com/@buildsuite360/video/..." className="mt-1 w-full rounded-md border px-3 py-2" />
                  </label>
                  <Btn disabled={!!busy} onClick={() => act("posted", { url: url || null }, "Marked as posted.")}>Mark as posted</Btn>
                </div>
              )}
              {post.status === "posted" && <div className="text-sm text-gray-700">Posted {when(post.posted_at)}{post.posted_url && <> · <a className="text-blue-700 hover:underline" href={post.posted_url} target="_blank" rel="noopener noreferrer">open the post</a></>}</div>}

              {edit && <div className="space-y-2">
                <h3 className="font-semibold text-gray-800">Slides ({edit.items.length} of 5)</h3>
                {edit.items.map((s, i) => (
                  <SlideRow key={s.ref} s={s} i={i} n={edit.items.length} editable={editable}
                    onChange={(h) => setItems(edit.items.map((x, j) => (j === i ? { ...x, headline: h } : x)))}
                    onMove={(d) => { const a = [...edit.items]; [a[i], a[i + d]] = [a[i + d], a[i]]; setItems(a); }}
                    onRemove={() => setItems(edit.items.filter((_, j) => j !== i))} />
                ))}
                <p className="text-xs text-gray-500">You can shorten a headline but not add numbers that aren't in the notice. Buyer, place, dates and value always come from the notice or listing.</p>
              </div>}

              {editable && spare.length > 0 && (
                <details className="bg-white border rounded-xl p-3">
                  <summary className="cursor-pointer text-sm font-semibold">Other tenders and listings today ({spare.length})</summary>
                  <div className="mt-2 divide-y">
                    {spare.map((s) => (
                      <div key={s.ref} className="flex items-center gap-3 py-2 text-sm">
                        <div className="min-w-0 flex-1"><div className="font-medium">{s.title}</div><div className="text-xs text-gray-500">{KIND[s.kind]} · {[s.who, s.closes && `closes ${s.closes}`].filter(Boolean).join(" · ")}</div></div>
                        <button disabled={edit.items.length >= 5} onClick={() => setItems([...edit.items, s])} className="rounded border px-2 py-1 text-xs disabled:opacity-40">Add</button>
                      </div>
                    ))}
                  </div>
                </details>
              )}

              {edit && <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">Caption
                  <textarea value={edit.caption} disabled={!editable} onChange={(e) => setEdit({ ...edit, caption: e.target.value })} rows={3} maxLength={600} className="mt-1 w-full rounded-md border px-3 py-2 font-normal" />
                </label>
                <label className="block text-sm font-semibold text-gray-800">Hashtags
                  <input value={edit.hashtags} disabled={!editable} onChange={(e) => setEdit({ ...edit, hashtags: e.target.value })} className="mt-1 w-full rounded-md border px-3 py-2 font-normal" />
                </label>
              </div>}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-semibold text-gray-800">Recent days</h2>
            <Table head={["Day", "Status", "Slides", ""]}>
              {posts.map((p) => (
                <tr key={p.id} className={`border-t ${p.id === post.id ? "bg-yellow-50" : ""}`}>
                  <td className="p-2.5">{dayText(p.day)}</td><td className="p-2.5"><Badge s={p.status} /></td><td className="p-2.5">{p.items.length}</td>
                  <td className="p-2.5"><button className="text-xs text-blue-700 hover:underline" onClick={() => setOpenId(p.id)}>Open</button></td>
                </tr>
              ))}
            </Table>
          </div>
        </>
      )}
    </Shell>
  );
}
