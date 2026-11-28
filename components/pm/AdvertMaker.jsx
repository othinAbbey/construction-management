import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FPS, H, W, drawFrame, duration, renderVideo } from "../../lib/socialVideo";
import { MUSIC_STYLES, decodeParts, mixAdvert, renderMusic } from "../../lib/socialMusic";
import { api } from "../../lib/pm";

/**
 * One-click adverts for the Buildsuite360 team: a portrait video (TikTok / WhatsApp Status) about one tender or notice,
 * made in the browser from fields copied from the notice. Every field can be checked and changed before the video is saved.
 */

const kampalaToday = () => new Date(Date.now() + 3 * 3600000).toISOString().slice(0, 10);
const daysLeft = (d) => Math.round((Date.parse(`${d}T00:00:00Z`) - Date.parse(`${kampalaToday()}T00:00:00Z`)) / 86400000);
const dateText = (d) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const isConsultancy = (type) => /consult|interest|individual/i.test(type || "");

/** A tender found in the app -> the same fields the notice reader gives. */
export function tenderToNotice(t, sourceName) {
  const ref = t.reference || (/Procurement reference (\S+)/.exec(t.description || "") || [])[1] || (/Ref (\S+)/.exec(t.description || "") || [])[1] || null;
  return {
    notice_type: isConsultancy(`${t.type} ${t.title}`) ? "Consultancy" : "Tender", method: t.type || null, title: t.title || "", buyer: t.buyer || "",
    reference: ref, place: t.country || null, summary: null, fee: null, funded_by: null, how_to_apply: null,
    closes_date: t.deadline || null, closes_time: null, website: null, source: sourceName || null,
  };
}

/** Notice fields -> the editable advert (what the video shows). */
export function noticeToAdvert(n, caption) {
  const consult = isConsultancy(n.notice_type);
  const facts = [[consult ? "Client" : "Buyer", n.buyer || ""]];
  if (n.summary) facts.push([consult ? "Positions" : "What", n.summary]);
  else if (n.place) facts.push(["Where", n.place]);
  if (n.fee) facts.push(["Bid document", n.fee]);
  else if (n.funded_by) facts.push(["Funded by", n.funded_by]);
  else if (n.how_to_apply) facts.push(["Apply", n.how_to_apply]);
  else if (n.summary && n.place) facts.push(["Where", n.place]);
  const left = n.closes_date ? daysLeft(n.closes_date) : null;
  facts.push(["Closes", n.closes_date ? `${dateText(n.closes_date)}${n.closes_time ? `, ${n.closes_time}` : ""}${left >= 0 ? ` · ${left} days left` : " · closed"}` : "See the notice"]);
  const label = [n.notice_type || "Tender", n.method].filter(Boolean).join(" · ");
  const when = n.closes_date ? `Closes ${dateText(n.closes_date)}${n.closes_time ? `, ${n.closes_time}` : ""}.` : "";
  return {
    label,
    headline: (n.title || "").slice(0, 90),
    source: [n.reference ? `Ref. ${n.reference}` : null, n.source].filter(Boolean).join(" · "),
    facts,
    more: n.website ? `Full notice: ${n.website}` : "Find it on buildsuite360.org",
    intro: consult ? "New consultancy opportunity in Uganda" : "New tender for Ugandan contractors",
    chip: consult ? "Consultancy" : "Tender",
    closes: n.closes_date,
    caption: caption || [`${consult ? "Consultancy opportunity" : "New tender"}: ${n.title}${n.buyer ? `, ${n.buyer}` : ""}.`, when,
      n.reference ? `Ref. ${n.reference}.` : "", "Always check the official notice before you apply.", n.website ? `Details: ${n.website}` : "More tenders daily on buildsuite360.org"].filter(Boolean).join(" "),
    hashtags: `#Uganda #UgandaTenders #Tenders ${consult ? "#Consultancy #Jobs" : "#Construction #Contractors"} #Buildsuite360`,
  };
}

const ordinal = (n) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th")}`;
const spokenDate = (d) => { const x = new Date(`${d}T12:00:00Z`); return `${ordinal(x.getUTCDate())} of ${x.toLocaleDateString("en-GB", { month: "long" })}`; };

/** What the voice says: one line for the opening, one for the slide, one for the close. */
export function voiceLines(a, notice) {
  const consult = /consult/i.test(a.chip || "") || isConsultancy(notice?.notice_type);
  const buyer = (a.facts.find(([k]) => /buyer|client/i.test(k)) || [])[1] || notice?.buyer || "";
  const what = (a.headline || "").replace(/\.$/, "");
  const lead = buyer && !what.toLowerCase().startsWith(buyer.toLowerCase().replace(/^the /, "").slice(0, 12))
    ? `${buyer} ${consult ? "is looking for" : "invites bids for"} ${what.charAt(0).toLowerCase() + what.slice(1)}.` : `${what}.`;
  const close = a.closes ? ` ${consult ? "Applications" : "Bids"} close on the ${spokenDate(a.closes)}, so don't miss it!` : "";
  return [
    consult ? "Here's a new consultancy opportunity in Uganda!" : "Contractors, here's a new tender for you!",
    `${lead}${close}`,
    `Find this and more tenders every day on buildsuite360.org. Always check the official notice before you ${consult ? "apply" : "bid"}.`,
  ];
}

const toPost = (a, timing) => ({ timing,
  day: kampalaToday(), intro: a.intro, chip: a.chip,
  items: [{ kind: "tender", ref: "advert", label: a.label, headline: a.headline || " ", source_name: a.source, facts: a.facts.filter(([k, v]) => k && v), more: a.more }],
});

/** Plays the video on a canvas exactly as the file will look, with its music if `audio` is given (sound off until asked). */
export function Preview({ post, audio, width = 300 }) {
  const ref = useRef(null), [t, setT] = useState(0), [playing, setPlaying] = useState(true), [sound, setSound] = useState(false), [epoch, setEpoch] = useState(0);
  const tRef = useRef(0), actx = useRef(null);
  const len = duration(post);
  tRef.current = t;
  useEffect(() => { const c = ref.current; if (c) drawFrame(c.getContext("2d"), post, Math.min(t, len)); }, [post, t, len]);
  useEffect(() => {
    if (!playing) return;
    let raf, last = performance.now();
    const step = (now) => { setT((x) => { const n = x + (now - last) / 1000; if (n >= len) { setEpoch((e) => e + 1); return 0; } return n; }); last = now; raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing, len]);
  // the music follows the picture: (re)started from the current moment whenever playback starts, loops or is moved
  useEffect(() => {
    if (!playing || !sound || !audio) return;
    actx.current ||= new AudioContext();
    const src = actx.current.createBufferSource(); src.buffer = audio; src.connect(actx.current.destination);
    src.start(0, Math.min(tRef.current, audio.duration - 0.01));
    return () => { try { src.stop(); } catch { /* already ended */ } };
  }, [playing, sound, audio, epoch]);
  useEffect(() => () => { actx.current?.close(); }, []);
  return (
    <div className="space-y-2">
      <canvas ref={ref} width={W} height={H} className="w-full aspect-[9/16] rounded-xl border shadow-sm bg-[#F4F1EA]" style={{ maxWidth: width }} />
      <div className="flex items-center gap-2" style={{ maxWidth: width }}>
        <button type="button" onClick={() => setPlaying((p) => !p)} className="rounded-md border px-3 py-1 text-sm bg-white">{playing ? "Pause" : "Play"}</button>
        {audio && <button type="button" onClick={() => setSound((x) => !x)} className="rounded-md border px-3 py-1 text-sm bg-white" aria-pressed={sound}>{sound ? "Sound off" : "Sound on"}</button>}
        <input type="range" min="0" max={len} step={1 / FPS} value={t} onChange={(e) => { setPlaying(false); setT(Number(e.target.value)); }} className="flex-1" aria-label="Position in the video" />
      </div>
    </div>
  );
}

/** The music for a video, made again when its length or style changes. */
export function useMusic(post, style) {
  const [audio, setAudio] = useState(null);
  const len = Math.round(duration(post) * 10) / 10;
  useEffect(() => {
    let live = true;
    if (style === "none") { setAudio(null); return undefined; }
    renderMusic(len, style).then((b) => live && setAudio(b)).catch(() => live && setAudio(null));
    return () => { live = false; };
  }, [len, style]);
  return audio;
}

export const MusicPicker = ({ value, onChange }) => (
  <label className="block text-xs font-semibold text-gray-600">Music
    <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-md border px-2.5 py-1.5 text-sm font-normal text-gray-900">
      {MUSIC_STYLES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  </label>
);

export const audioMessage = (ext, note) => (ext !== "mp4" ? "This browser can't make MP4s, so a WebM was saved (TikTok accepts it). Use Chrome or Edge for MP4."
  : note === "opus" ? "Saved. This browser can't make the usual MP4 sound format, so the music may not play on iPhones: for the safest file, use Chrome or Edge on Windows or Mac."
  : note === "no-audio" ? "Saved without music: this browser can't add sound to MP4s. Use Chrome or Edge on Windows or Mac."
  : "The MP4 is in your downloads.");

const Input = ({ label, value, onChange, max = 120, area }) => (
  <label className="block text-xs font-semibold text-gray-600">{label}
    {area ? <textarea value={value} maxLength={max} rows={3} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-md border px-2.5 py-1.5 text-sm font-normal text-gray-900" />
      : <input value={value} maxLength={max} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-md border px-2.5 py-1.5 text-sm font-normal text-gray-900" />}
  </label>
);

/** The advert maker, as an overlay. `notice` is the fields from tenderToNotice or the notice reader. */
export default function AdvertMaker({ notice, caption, onClose }) {
  const [a, setA] = useState(() => noticeToAdvert(notice, caption));
  const [busy, setBusy] = useState(false), [progress, setProgress] = useState(0), [msg, setMsg] = useState(""), [err, setErr] = useState("");
  const [music, setMusic] = useState("upbeat");
  // the voice: lines (editable), whether it's on, the decoded recordings and the lines they were made from
  const [voiceOn, setVoiceOn] = useState(false), [voiceInfo, setVoiceInfo] = useState(null);
  const [lines, setLines] = useState(null), [voices, setVoices] = useState(null), [voicedLines, setVoicedLines] = useState(null), [voicing, setVoicing] = useState(false);
  useEffect(() => { api("/api/social/voice").then((v) => { setVoiceInfo(v); setVoiceOn(!!v.configured); }).catch(() => setVoiceInfo({ configured: false })); }, []);
  const set = (k) => (v) => setA((x) => ({ ...x, [k]: v }));
  const setFact = (i, j) => (v) => setA((x) => ({ ...x, facts: x.facts.map((f, k) => (k === i ? (j ? [f[0], v] : [v, f[1]]) : f)) }));
  const shownLines = lines || voiceLines(a, notice);
  const useVoice = voiceOn && voices && voices.some(Boolean);
  const d = (i) => voices?.[i]?.duration || 0;
  const timing = useVoice ? { intro: 0.3 + d(0) + 0.6, slide: 0.6 + d(1) + 0.9, outro: 0.3 + d(2) + 1.1 } : undefined;
  const post = toPost(a, timing);
  const musicTrack = useMusic(post, music);
  const [mixed, setMixed] = useState(null);
  useEffect(() => {
    let live = true;
    if (!useVoice) { setMixed(null); return undefined; }
    const k = { intro: Math.max(3.2, timing.intro), slide: Math.max(4.6, timing.slide) };
    mixAdvert({ len: duration(post), music: music === "none" ? null : musicTrack, voices, starts: [0.3, k.intro + 0.6, k.intro + k.slide + 0.3] })
      .then((b) => live && setMixed(b)).catch(() => live && setMixed(null));
    return () => { live = false; };
  }, [useVoice, voices, musicTrack, music]); // eslint-disable-line react-hooks/exhaustive-deps
  const audio = useVoice ? mixed : musicTrack;
  const stale = useVoice && JSON.stringify(voicedLines) !== JSON.stringify(shownLines);

  async function makeVoice() {
    setErr(""); setMsg(""); setVoicing(true);
    try {
      const r = await api("/api/social/voice", { method: "POST", body: { lines: shownLines }, timeout: 90000 });
      setVoices(await decodeParts(r.parts)); setVoicedLines(shownLines); setVoiceOn(true);
      setMsg("Voice ready: press Play and Sound on to hear it.");
    } catch (e) { setErr(e.message); } finally { setVoicing(false); }
  }
  const closed = a.closes && daysLeft(a.closes) < 0;
  const name = (a.headline || "advert").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);

  async function download() {
    setErr(""); setMsg(""); setBusy(true); setProgress(0);
    try {
      const track = useVoice ? mixed : music === "none" ? null : audio || await renderMusic(duration(post), music);
      if (useVoice && !track) throw new Error("the voice is still being mixed; try again in a moment");
      const { blob, ext, audioNote } = await renderVideo(post, { onProgress: setProgress, audio: track });
      const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `buildsuite360-${name}.${ext}`; link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 60000);
      setMsg(audioMessage(ext, audioNote));
    } catch (e) { setErr(`The video could not be made here (${e.message}). Try Chrome or Edge on a computer.`); } finally { setBusy(false); }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(`${a.caption}\n\n${a.hashtags}`.trim()); setMsg("Caption and hashtags copied."); } catch { setErr("Copy didn't work here: select the caption and copy it."); }
  }

  return createPortal(
    <div className="fixed inset-0 z-[1000] bg-black/40 flex items-start justify-center overflow-y-auto p-3 sm:p-8" onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}>
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl p-4 sm:p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="text-lg font-semibold">Make an advert</h2><p className="text-sm text-gray-600">Check every field against the notice, then download the video and copy the caption.</p></div>
          <button onClick={onClose} disabled={busy} className="rounded-md border px-3 py-1 text-sm">Close</button>
        </div>
        {closed && <div className="text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3">This notice's closing date has passed.</div>}
        {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{err}</div>}
        {msg && <div className="text-sm text-green-800 bg-green-50 border border-green-200 rounded-lg p-3">{msg}</div>}
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <div className="space-y-3"><Preview post={post} audio={audio} /><MusicPicker value={music} onChange={setMusic} />
            <p className="text-xs text-gray-500">Original music made for these adverts: free to post. You can still swap it for a TikTok sound when you post.</p>
            <div className="rounded-lg border p-3 space-y-2" style={{ maxWidth: 300 }}>
              <div className="flex items-center justify-between"><span className="text-xs font-semibold text-gray-600">Voice{voiceInfo?.configured ? ` (${voiceInfo.name})` : ""}</span>
                {voiceInfo?.configured && <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={voiceOn} onChange={(e) => setVoiceOn(e.target.checked)} /> On</label>}</div>
              {voiceInfo && !voiceInfo.configured && <p className="text-xs text-gray-500">The voice isn't switched on: set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION on the server.</p>}
              {voiceInfo?.configured && voiceOn && <>
                {["Opening", "The notice", "Closing"].map((label, i) => (
                  <label key={label} className="block text-[11px] font-semibold text-gray-500">{label}
                    <textarea rows={i === 1 ? 4 : 2} maxLength={400} value={shownLines[i]} onChange={(e) => setLines(shownLines.map((l, j) => (j === i ? e.target.value : l)))} className="mt-0.5 w-full rounded-md border px-2 py-1 text-xs font-normal text-gray-900" />
                  </label>
                ))}
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={makeVoice} disabled={voicing || busy} className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60">{voicing ? "Making the voice..." : voices ? "Make the voice again" : "Make voice"}</button>
                  {lines && <button type="button" onClick={() => setLines(null)} className="text-xs text-blue-700 hover:underline">Write the lines again</button>}
                </div>
                {stale && <p className="text-xs text-amber-800">You changed the lines: make the voice again so it says them.</p>}
              </>}
            </div></div>
          <div className="space-y-3 min-w-0">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Opening line" value={a.intro} onChange={set("intro")} max={60} />
              <Input label="Opening tag" value={a.chip} onChange={set("chip")} max={24} />
              <Input label="Label (top of the slide)" value={a.label} onChange={set("label")} max={60} />
              <Input label="Reference line" value={a.source} onChange={set("source")} max={80} />
            </div>
            <Input label="Headline" value={a.headline} onChange={set("headline")} max={90} />
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-600">Facts on the card (up to 4)</div>
              {a.facts.map(([k, v], i) => (
                <div key={i} className="grid grid-cols-[130px_1fr_auto] gap-2">
                  <input value={k} maxLength={20} onChange={(e) => setFact(i, 0)(e.target.value)} className="rounded-md border px-2 py-1.5 text-sm" aria-label="Fact label" />
                  <input value={v} maxLength={110} onChange={(e) => setFact(i, 1)(e.target.value)} className="rounded-md border px-2 py-1.5 text-sm" aria-label="Fact" />
                  <button type="button" onClick={() => setA((x) => ({ ...x, facts: x.facts.filter((_, j) => j !== i) }))} className="text-xs text-red-700 px-1">Remove</button>
                </div>
              ))}
              {a.facts.length < 4 && <button type="button" onClick={() => setA((x) => ({ ...x, facts: [...x.facts, ["", ""]] }))} className="text-xs text-blue-700 hover:underline">Add a fact</button>}
            </div>
            <Input label="Bottom line" value={a.more} onChange={set("more")} max={60} />
            <Input label="Caption" value={a.caption} onChange={set("caption")} max={600} area />
            <Input label="Hashtags" value={a.hashtags} onChange={set("hashtags")} max={300} />
            <div className="flex flex-wrap gap-2 pt-1">
              <button onClick={download} disabled={busy} className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-black disabled:opacity-60">{busy ? `Making the video... ${Math.round(progress * 100)}%` : "Download MP4"}</button>
              <button onClick={copy} disabled={busy} className="rounded-lg border px-4 py-2 text-sm font-semibold">Copy caption</button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
