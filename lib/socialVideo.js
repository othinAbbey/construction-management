/**
 * Buildsuite360's daily social video, drawn on a canvas in the browser and saved as an MP4.
 * Portrait 1080 x 1920 at 30 frames a second, in the same blueprint look as the adverts: cream grid, navy and orange.
 * Every word comes from the post (slides copied from tender and listing records). Words stay inside the area TikTok
 * leaves clear (not the top 250 px, the bottom 420 px or the right 120 px).
 *
 * drawFrame(ctx, post, t) draws one moment; it is a pure function of t, so the preview and the file always match.
 */
export const W = 1080, H = 1920, FPS = 30;
const INTRO = 3.2, SLIDE = 4.6, OUTRO = 3.6;
const C = { ground: "#F4F1EA", main: "#1F4E79", ink: "#1B1B1B", accent: "#E07A2E", deep: "#8F4A1C", muted: "#6B6862", hair: "#DCD8CF", card: "#FBFAF6", tint: "#F6E2D2" };
const FONT = '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const L = 70, R = 950, TOP = 270;                       // the safe area for words

/** Seconds for the intro, each slide and the outro; a post may lengthen them (to fit a voiceover). */
const timing = (post) => ({ intro: Math.max(INTRO, post.timing?.intro || 0), slide: Math.max(SLIDE, post.timing?.slide || 0), outro: Math.max(OUTRO, post.timing?.outro || 0) });
export const duration = (post) => { const k = timing(post); return k.intro + k.slide * Math.max(1, post.items.length) + k.outro; };

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const seg = (t, a, b) => clamp01((t - a) / (b - a));
const eo = (x) => 1 - Math.pow(1 - x, 3);
const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const eob = (x, s = 1.5) => { const c = s + 1; return 1 + c * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };

const font = (size, weight = 700) => `${weight} ${size}px ${FONT}`;
function wrap(ctx, text, maxW) {
  const words = String(text || "").split(/\s+/).filter(Boolean), lines = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (ctx.measureText(next).width <= maxW || !line) line = next; else { lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  return lines;
}
/** The biggest size (from `sizes`) at which the text fits in `maxLines` lines. */
function fit(ctx, text, maxW, sizes, maxLines, weight = 800) {
  for (const s of sizes) {
    ctx.font = font(s, weight); const lines = wrap(ctx, text, maxW);
    if (lines.length <= maxLines && lines.every((l) => ctx.measureText(l).width <= maxW)) return { size: s, lines };
  }
  const s = sizes[sizes.length - 1]; ctx.font = font(s, weight);
  const lines = wrap(ctx, text, maxW).slice(0, maxLines); lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[\s,.;:]+$/, "")}…`;
  return { size: s, lines };
}
const dateText = (d) => (d ? new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "");
const daysLeft = (d, from) => Math.round((Date.parse(`${d}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000);

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

let gridTile = null;
function background(ctx, t) {
  if (!gridTile && typeof document !== "undefined") {
    gridTile = document.createElement("canvas"); gridTile.width = 216; gridTile.height = 216;
    const g = gridTile.getContext("2d");
    g.fillStyle = C.ground; g.fillRect(0, 0, 216, 216);
    g.strokeStyle = "rgba(31,78,121,0.08)"; g.lineWidth = 1;
    for (let i = 54; i < 216; i += 54) { g.beginPath(); g.moveTo(i + 0.5, 0); g.lineTo(i + 0.5, 216); g.moveTo(0, i + 0.5); g.lineTo(216, i + 0.5); g.stroke(); }
    g.strokeStyle = "rgba(31,78,121,0.17)"; g.lineWidth = 2;
    g.beginPath(); g.moveTo(1, 0); g.lineTo(1, 216); g.moveTo(0, 1); g.lineTo(216, 1); g.stroke();
  }
  ctx.save();
  const drift = (t * 6) % 216;                                   // the table creeps a little, so no frame is frozen
  ctx.translate(-drift, -drift * 0.5);
  ctx.fillStyle = gridTile ? ctx.createPattern(gridTile, "repeat") : C.ground;
  ctx.fillRect(0, 0, W + 216, H + 216);
  ctx.restore();
}

/** The ink building and crane, drawn up to `p` (0..1), feet at (x, y), scaled by s. */
function building(ctx, x, y, s, p, lit) {
  const segs = [];
  const S = (x1, y1, x2, y2, hi) => segs.push([x1, y1, x2, y2, hi]);
  S(-60, 0, 940, 0);
  for (let i = 0; i <= 4; i++) S(i * 150, 0, i * 150, -480);
  for (let f = 0; f <= 4; f++) S(-20, -f * 120, 620, -f * 120);
  S(740, 0, 740, -700); S(770, 0, 770, -700); S(520, -690, 900, -690); S(520, -664, 900, -664); S(755, -700, 755, -750);
  S(755, -750, 520, -690); S(755, -750, 900, -690); S(580, -664, 580, -520, true);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = "round";
  if (lit > 0) {
    for (let f = 0; f < 4; f++) for (let i = 0; i < 4; i++) {
      const a = clamp01((lit - (f * 4 + i) / 16) * 4); if (!a) continue;
      ctx.globalAlpha = 0.85 * a; ctx.fillStyle = C.accent; ctx.fillRect(30 + i * 150, -105 - f * 120, 90, 60);
    }
    ctx.globalAlpha = 1;
  }
  segs.forEach(([x1, y1, x2, y2, hi], i) => {
    const q = clamp01(p * segs.length * 1.4 - i * 1.0); if (!q) return;
    ctx.strokeStyle = hi ? C.accent : "rgba(31,78,121,0.8)"; ctx.lineWidth = hi ? 7 : 4.5;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + (x2 - x1) * q, y1 + (y2 - y1) * q); ctx.stroke();
  });
  ctx.restore();
}

/** Words that slide in from the right with a fade, a word at a time. Returns the y after the block. */
function lines(ctx, list, x, y, size, color, t, t0, weight = 800, lh = 1.06) {
  ctx.font = font(size, weight); ctx.fillStyle = color; ctx.textBaseline = "top";
  let k = 0;
  list.forEach((ln, li) => {
    let cx = x;
    for (const w of ln.split(" ")) {
      const p = eo(seg(t, t0 + k * 0.08, t0 + k * 0.08 + 0.45)); k++;
      const ww = ctx.measureText(`${w} `).width;
      if (p > 0) { ctx.globalAlpha = p; ctx.fillText(w, cx + (1 - p) * 30, y + li * size * lh); }
      cx += ww;
    }
  });
  ctx.globalAlpha = 1;
  return y + list.length * size * lh;
}
function fade(ctx, p, dy, draw) { if (p <= 0) return; ctx.save(); ctx.globalAlpha = clamp01(p); ctx.translate(0, (1 - p) * dy); draw(); ctx.restore(); }

function pill(ctx, text, x, y, bg, fg, size = 32) {
  ctx.font = font(size, 800); const w = ctx.measureText(text).width + size * 1.4, h = size * 1.75;
  ctx.fillStyle = bg; roundRect(ctx, x, y, w, h, h / 2); ctx.fill();
  ctx.fillStyle = fg; ctx.textBaseline = "middle"; ctx.fillText(text, x + size * 0.7, y + h / 2 + 1); ctx.textBaseline = "top";
  return w;
}

function intro(ctx, post, t) {
  building(ctx, 150, 1480, 0.78, eo(seg(t, -0.2, 2.4)), 0);
  const nT = post.items.filter((s) => s.kind === "tender").length, nL = post.items.length - nT;
  ctx.font = font(34, 800); ctx.fillStyle = C.deep; ctx.globalAlpha = eo(seg(t, 0, 0.4));
  ctx.fillText("BUILDSUITE360 · DAILY TENDERS", L, TOP); ctx.globalAlpha = 1;
  const one = post.items.length === 1;
  const head = post.intro || (nT ? `New tender${one ? "" : "s"} for Ugandan contractors` : `New subcontract${one ? "" : "s"} for Ugandan contractors`);
  const f = fit(ctx, head, R - L, [116, 104, 92], 4);
  let y = lines(ctx, f.lines, L, TOP + 70, f.size, C.ink, t, 0.1);
  const date = new Date(`${post.day}T12:00:00Z`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  fade(ctx, eo(seg(t, 0.8, 1.3)), 20, () => { ctx.font = font(50, 700); ctx.fillStyle = C.main; ctx.fillText(date, L, y + 30); });
  fade(ctx, eob(seg(t, 1.2, 1.7)), 24, () => {
    let x = L;
    if (post.chip) return pill(ctx, post.chip, x, y + 120, C.tint, C.deep, 38);
    if (nT) x += pill(ctx, `${nT} tender${nT > 1 ? "s" : ""}`, x, y + 120, C.tint, C.deep, 38) + 18;
    if (nL) pill(ctx, `${nL} subcontract${nL > 1 ? "s" : ""}`, x, y + 120, "#DCE4EC", C.main, 38);
  });
}

function slide(ctx, post, s, i, t) {
  const tender = s.kind === "tender";
  const label = s.label ? s.label.toUpperCase() : tender ? "TENDER" : s.kind === "subcontract" ? "SUBCONTRACT" : "TEAM AVAILABLE";
  ctx.font = font(32, 800); ctx.fillStyle = C.deep; ctx.globalAlpha = eo(seg(t, 0, 0.35));
  ctx.fillText(post.items.length > 1 ? `${label} ${i + 1} OF ${post.items.length}` : label, L, TOP);
  ctx.font = font(30, 600); ctx.fillStyle = C.muted; ctx.fillText(s.source_name || "", L, TOP + 46); ctx.globalAlpha = 1;
  const f = fit(ctx, s.headline, R - L, [96, 86, 76, 68], 4);
  const y0 = lines(ctx, f.lines, L, TOP + 110, f.size, C.ink, t, 0.15);

  // the facts that matter most first: who, where, when it closes, how much; the card shows four
  const rows = [];
  if (s.who) rows.push([tender ? "Buyer" : "Company", s.who]);
  if (s.place) rows.push(["Where", s.place]);
  if (s.closes) { const n = daysLeft(s.closes, post.day); rows.push([tender ? "Closes" : "Apply by", `${dateText(s.closes)}${n >= 0 ? ` · ${n} days left` : ""}`]); }
  else if (tender) rows.push(["Closes", "See the notice"]);
  if (s.crew_size) rows.push(["Team", `${s.crew_size} workers`]);
  if (s.available_from) rows.push(["Available from", dateText(s.available_from)]);
  if (s.value) rows.push(["Value", s.value]);
  if (s.trade) rows.push(["Trade", s.trade]);
  // a slide may carry its own fact rows, copied from the notice ([label, value] pairs)
  const shown = (Array.isArray(s.facts) && s.facts.length ? s.facts : rows).slice(0, 4);

  // the card: values wrap to two lines at most
  ctx.font = font(42, 700);
  const wrapped = shown.map(([k, v]) => [k, wrap(ctx, v, R - L - 80).slice(0, 2)]);
  const cardY = Math.max(y0 + 60, TOP + 420), rowH = (n) => 44 + n * 52 + 30;
  const cardH = wrapped.reduce((a, [, v]) => a + rowH(v.length), 0) + 20;
  const up = eo(seg(t, 0.55, 1.05));
  fade(ctx, up, 40, () => {
    ctx.shadowColor = "rgba(0,0,0,0.12)"; ctx.shadowBlur = 50; ctx.shadowOffsetY = 20;
    ctx.fillStyle = C.card; roundRect(ctx, L, cardY, R - L, Math.min(cardH, 1490 - cardY), 36); ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.fillStyle = tender ? C.main : C.accent; roundRect(ctx, L, cardY, 14, Math.min(cardH, 1490 - cardY), 7); ctx.fill();
  });
  let y = cardY + 30;
  wrapped.forEach(([k, v], r) => {
    if (y + rowH(v.length) > 1490) return;
    const p = eo(seg(t, 0.9 + r * 0.18, 1.3 + r * 0.18)), yy = y;
    fade(ctx, p, 16, () => {
      ctx.font = font(28, 700); ctx.fillStyle = C.muted; ctx.fillText(k.toUpperCase(), L + 50, yy);
      ctx.font = font(42, 700); ctx.fillStyle = C.ink; v.forEach((ln, j) => ctx.fillText(ln, L + 50, yy + 44 + j * 52));
    });
    y += rowH(v.length);
  });

  // where to look next, and progress dots
  fade(ctx, eo(seg(t, 1.8, 2.2)), 10, () => {
    ctx.font = font(32, 600); ctx.fillStyle = C.main;
    ctx.fillText(s.more || (tender ? "Full notice: search it on buildsuite360.org" : "Apply on buildsuite360.org > Subcontracts"), L, Math.min(cardY + cardH + 34, 1440));
  });
  if (post.items.length > 1) post.items.forEach((_, k) => {
    ctx.fillStyle = k === i ? C.accent : C.hair;
    roundRect(ctx, L + k * 54, 1478, k === i ? 40 : 24, 12, 6); ctx.fill();
  });
}

function outro(ctx, post, t) {
  building(ctx, 150, 1480, 0.78, 1, eo(seg(t, 0.4, 2.2)));
  fade(ctx, eob(seg(t, 0.05, 0.6), 1.4), 30, () => { ctx.font = font(52, 700); ctx.fillStyle = C.ink; ctx.fillText(post.items.length > 1 ? "Find these and more on" : "Find this and more on", L, TOP + 20); });
  fade(ctx, eob(seg(t, 0.3, 0.85), 1.4), 30, () => {
    const f = fit(ctx, "buildsuite360.org", R - L, [112, 104, 96, 88, 80, 72], 1);
    ctx.font = font(f.size, 800); ctx.fillStyle = C.main; ctx.fillText("buildsuite360.org", L, TOP + 100);
  });
  fade(ctx, eo(seg(t, 0.9, 1.4)), 20, () => {
    ctx.font = font(40, 600); ctx.fillStyle = C.ink;
    wrap(ctx, "Tenders, bids, site logs and subcontracts in one place.", R - L).forEach((ln, j) => ctx.fillText(ln, L, TOP + 250 + j * 52));
  });
  fade(ctx, eo(seg(t, 1.4, 1.9)), 10, () => { ctx.font = font(30, 600); ctx.fillStyle = C.muted; ctx.fillText("Always check the official notice before you bid.", L, TOP + 400); });
}

/** Draw the frame at time t (seconds). */
export function drawFrame(ctx, post, t) {
  background(ctx, t);
  const { intro: I, slide: S } = timing(post);
  if (t < I) return intro(ctx, post, t);
  const k = Math.floor((t - I) / S);
  if (k < post.items.length) return slide(ctx, post, post.items[k], k, t - I - k * S);
  return outro(ctx, post, t - I - post.items.length * S);
}

/** Can this browser save an MP4 (WebCodecs H.264)? */
export async function mp4Support() {
  if (typeof window === "undefined" || !window.VideoEncoder) return null;
  for (const codec of ["avc1.640028", "avc1.4d0028", "avc1.42e028"]) {
    try { const r = await VideoEncoder.isConfigSupported({ codec, width: W, height: H, bitrate: 8_000_000, framerate: FPS }); if (r.supported) return codec; } catch { /* try the next */ }
  }
  return null;
}

/** The sound format this browser can put in an MP4: AAC (plays everywhere) where it can, else Opus. */
export async function audioSupport() {
  if (typeof window === "undefined" || !window.AudioEncoder) return null;
  for (const [codec, mux] of [["mp4a.40.2", "aac"], ["opus", "opus"]]) {
    try { if ((await AudioEncoder.isConfigSupported({ codec, sampleRate: 48000, numberOfChannels: 2, bitrate: 128000 })).supported) return { codec, mux }; } catch { /* next */ }
  }
  return null;
}

/** Encode an AudioBuffer into the muxer, in 1024-frame pieces. */
async function encodeAudio(buffer, muxer, codec) {
  let failed = null;
  const enc = new AudioEncoder({ output: (chunk, meta) => muxer.addAudioChunk(chunk, meta), error: (e) => { failed = e; } });
  enc.configure({ codec, sampleRate: buffer.sampleRate, numberOfChannels: 2, bitrate: 128000 });
  const L = buffer.getChannelData(0), R = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : L, step = 1024;
  for (let i = 0; i < buffer.length; i += step) {
    if (failed) throw failed;
    const n = Math.min(step, buffer.length - i), data = new Float32Array(n * 2);
    data.set(L.subarray(i, i + n), 0); data.set(R.subarray(i, i + n), n);
    const a = new AudioData({ format: "f32-planar", sampleRate: buffer.sampleRate, numberOfFrames: n, numberOfChannels: 2, timestamp: Math.round((i * 1e6) / buffer.sampleRate), data });
    enc.encode(a); a.close();
    if (enc.encodeQueueSize > 20) await new Promise((r) => setTimeout(r, 2));
  }
  await enc.flush(); enc.close();
  if (failed) throw failed;
}

/**
 * Render the whole video to an MP4 Blob. onProgress(0..1). `audio` is an AudioBuffer (the music) or null.
 * Falls back to a real-time WebM recording where MP4 can't be made. Returns { blob, ext, audioNote }.
 */
export async function renderVideo(post, { onProgress = () => {}, audio = null } = {}) {
  const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");
  await document.fonts?.ready;
  const total = Math.round(duration(post) * FPS), codec = await mp4Support();
  if (codec) {
    const { Muxer, ArrayBufferTarget } = await import("mp4-muxer");
    const sound = audio ? await audioSupport() : null;
    const muxer = new Muxer({ target: new ArrayBufferTarget(), video: { codec: "avc", width: W, height: H, frameRate: FPS },
      ...(sound ? { audio: { codec: sound.mux, numberOfChannels: 2, sampleRate: audio.sampleRate } } : {}), fastStart: "in-memory" });
    if (sound) await encodeAudio(audio, muxer, sound.codec);
    let failed = null;
    const enc = new VideoEncoder({ output: (chunk, meta) => muxer.addVideoChunk(chunk, meta), error: (e) => { failed = e; } });
    enc.configure({ codec, width: W, height: H, bitrate: 8_000_000, framerate: FPS });
    for (let i = 0; i < total; i++) {
      if (failed) throw failed;
      drawFrame(ctx, post, i / FPS);
      const frame = new VideoFrame(canvas, { timestamp: Math.round((i * 1e6) / FPS), duration: Math.round(1e6 / FPS) });
      enc.encode(frame, { keyFrame: i % (FPS * 2) === 0 });
      frame.close();
      if (enc.encodeQueueSize > 8) await new Promise((r) => setTimeout(r, 5));
      if (i % 15 === 0) { onProgress(i / total); await new Promise((r) => setTimeout(r, 0)); }
    }
    await enc.flush(); enc.close(); muxer.finalize();
    if (failed) throw failed;
    onProgress(1);
    const audioNote = audio && !sound ? "no-audio" : sound?.mux === "opus" ? "opus" : null;
    return { blob: new Blob([muxer.target.buffer], { type: "video/mp4" }), ext: "mp4", audioNote };
  }
  // Fallback: record the canvas as it plays (takes as long as the video), with the music played into the recording.
  const stream = canvas.captureStream(FPS), chunks = [];
  let actx = null, src = null;
  if (audio) {
    actx = new AudioContext({ sampleRate: audio.sampleRate }); const dest = actx.createMediaStreamDestination();
    src = actx.createBufferSource(); src.buffer = audio; src.connect(dest);
    dest.stream.getAudioTracks().forEach((tr) => stream.addTrack(tr));
  }
  const mime = audio ? (MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus") ? "video/webm;codecs=vp9,opus" : "video/webm") : (MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm");
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  const done = new Promise((r) => { rec.onstop = r; });
  rec.start(); src?.start();
  const start = performance.now(), len = duration(post);
  await new Promise((resolve) => {
    const step = () => {
      const t = (performance.now() - start) / 1000;
      drawFrame(ctx, post, Math.min(t, len)); onProgress(Math.min(1, t / len));
      if (t >= len) return resolve();
      requestAnimationFrame(step);
    };
    step();
  });
  rec.stop(); await done; actx?.close();
  return { blob: new Blob(chunks, { type: "video/webm" }), ext: "webm", audioNote: null };
}
