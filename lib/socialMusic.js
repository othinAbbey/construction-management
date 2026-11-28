/**
 * Original background music for Buildsuite360's adverts, composed in the browser (no recordings, so no licences to worry about).
 * The same style and length always give the same music. Styles:
 *   upbeat: bright marimba and bass over a light beat (about 112 beats a minute)
 *   calm:   soft piano and pad, no drums (about 84 beats a minute)
 * renderMusic(seconds, style) -> AudioBuffer (stereo, 48 kHz), ending with a held chord and a fade.
 */
export const MUSIC_STYLES = [["upbeat", "Upbeat"], ["calm", "Calm"], ["none", "No music"]];
const SR = 48000;
const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12);       // MIDI number -> Hz
// I - V - vi - IV in C major (C, G, Am, F): chord tones as MIDI numbers, and the bass root
const PROG = [{ tones: [60, 64, 67], root: 36 }, { tones: [59, 62, 67], root: 43 }, { tones: [60, 64, 69], root: 45 }, { tones: [60, 65, 69], root: 41 }];

function noiseBuffer(ctx) {
  const b = ctx.createBuffer(1, SR, SR), d = b.getChannelData(0);
  let x = 12345;
  for (let i = 0; i < d.length; i++) { x = (x * 1103515245 + 12345) & 0x7fffffff; d[i] = (x / 0x3fffffff) - 1; }   // seeded: same music every time
  return b;
}

function env(ctx, g, t, peak, attack, decay) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

function marimba(ctx, out, t, midi, vel = 0.25) {
  const f = NOTE(midi), g = ctx.createGain(); g.connect(out);
  [[1, 1], [3.98, 0.18], [10.2, 0.05]].forEach(([mult, amp]) => {
    const o = ctx.createOscillator(), og = ctx.createGain();
    o.type = "sine"; o.frequency.value = f * mult; og.gain.value = amp; o.connect(og).connect(g);
    o.start(t); o.stop(t + 0.6);
  });
  env(ctx, g, t, vel, 0.004, 0.45);
}
function pianoish(ctx, out, t, midi, vel = 0.16, len = 1.4) {
  const f = NOTE(midi), g = ctx.createGain(), lp = ctx.createBiquadFilter();
  lp.type = "lowpass"; lp.frequency.value = 2400; lp.connect(out); g.connect(lp);
  [["triangle", 1, 1], ["sine", 2, 0.25]].forEach(([type, mult, amp]) => {
    const o = ctx.createOscillator(), og = ctx.createGain();
    o.type = type; o.frequency.value = f * mult; og.gain.value = amp; o.connect(og).connect(g);
    o.start(t); o.stop(t + len + 0.1);
  });
  env(ctx, g, t, vel, 0.006, len);
}
function bass(ctx, out, t, midi, len, vel = 0.32) {
  const o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
  o.type = "triangle"; o.frequency.value = NOTE(midi); lp.type = "lowpass"; lp.frequency.value = 600;
  o.connect(lp).connect(g).connect(out);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vel, t + 0.01); g.gain.setTargetAtTime(0.0001, t + len * 0.6, len * 0.25);
  o.start(t); o.stop(t + len + 0.2);
}
function pad(ctx, out, t, tones, len, vel = 0.05) {
  const g = ctx.createGain(), lp = ctx.createBiquadFilter();
  lp.type = "lowpass"; lp.frequency.value = 1400; lp.connect(out); g.connect(lp);
  tones.forEach((m) => [-6, 6].forEach((cents) => {
    const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = NOTE(m); o.detune.value = cents; o.connect(g); o.start(t); o.stop(t + len + 0.6);
  }));
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vel, t + Math.min(0.8, len / 3)); g.gain.setValueAtTime(vel, t + len - 0.2); g.gain.linearRampToValueAtTime(0.0001, t + len + 0.5);
}
function kick(ctx, out, t, vel = 0.7) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
  o.connect(g).connect(out); env(ctx, g, t, vel, 0.002, 0.22); o.start(t); o.stop(t + 0.3);
}
function hiss(ctx, out, noise, t, { freq, type, vel, decay }) {
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = noise; f.type = type; f.frequency.value = freq; s.connect(f).connect(g).connect(out);
  env(ctx, g, t, vel, 0.001, decay); s.start(t, (t * 7.3) % 0.8); s.stop(t + decay + 0.05);
}

/** Compose and render the music. Returns null for "none". */
export async function renderMusic(seconds, style = "upbeat") {
  if (style === "none" || typeof window === "undefined") return null;
  const len = Math.max(3, seconds), Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const ctx = new Ctx(2, Math.ceil(len * SR), SR);
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 3;
  const master = ctx.createGain(); master.gain.value = 0.7;
  comp.connect(master).connect(ctx.destination);
  const fade = ctx.createGain(); fade.connect(comp);
  fade.gain.setValueAtTime(0.0001, 0); fade.gain.linearRampToValueAtTime(1, 0.6);
  fade.gain.setValueAtTime(1, len - 1.6); fade.gain.linearRampToValueAtTime(0.0001, len - 0.05);
  const noise = noiseBuffer(ctx);
  const upbeat = style !== "calm", bpm = upbeat ? 112 : 84, beat = 60 / bpm, bar = beat * 4;
  const endHit = Math.max(bar * 2, len - 3.2);                        // a held final chord under the closing card
  const bars = Math.floor(endHit / bar);
  for (let b = 0; b < bars; b++) {
    const t0 = b * bar, c = PROG[b % 4];
    if (upbeat) {
      bass(ctx, fade, t0, c.root, beat * 1.4); bass(ctx, fade, t0 + beat * 1.5, c.root, beat * 0.9, 0.24); bass(ctx, fade, t0 + beat * 2.5, c.root + 12, beat * 0.9, 0.2);
      const arp = [c.tones[0] + 12, c.tones[1] + 12, c.tones[2] + 12, c.tones[1] + 12, c.tones[2] + 12, c.tones[0] + 24, c.tones[2] + 12, c.tones[1] + 12];
      arp.forEach((m, i) => marimba(ctx, fade, t0 + i * beat / 2, m, i % 2 ? 0.14 : 0.2));
      if (b > 0) {
        [0, 2].forEach((k) => kick(ctx, fade, t0 + k * beat));
        [1, 3].forEach((k) => hiss(ctx, fade, noise, t0 + k * beat, { freq: 1600, type: "bandpass", vel: 0.22, decay: 0.12 }));
        for (let i = 0; i < 8; i++) hiss(ctx, fade, noise, t0 + i * beat / 2, { freq: 8000, type: "highpass", vel: i % 2 ? 0.05 : 0.08, decay: 0.04 });
      }
      pad(ctx, fade, t0, c.tones, bar, 0.025);
    } else {
      pad(ctx, fade, t0, c.tones.map((m) => m - 12), bar, 0.05);
      bass(ctx, fade, t0, c.root, bar * 0.9, 0.18);
      [0, 1, 2, 1.5, 3].forEach((k, i) => pianoish(ctx, fade, t0 + k * beat, c.tones[i % 3] + 12, i === 0 ? 0.16 : 0.1, 1.6));
    }
  }
  // the end: one full chord that rings out while the name is on screen
  const tEnd = bars * bar, last = [60, 64, 67, 72];
  bass(ctx, fade, tEnd, 36, len - tEnd, 0.3);
  pad(ctx, fade, tEnd, last, Math.max(0.5, len - tEnd - 0.6), upbeat ? 0.04 : 0.06);
  last.forEach((m, i) => (upbeat ? marimba(ctx, fade, tEnd + i * 0.06, m + 12, 0.18) : pianoish(ctx, fade, tEnd + i * 0.08, m, 0.14, 2.5)));
  if (upbeat) kick(ctx, fade, tEnd, 0.8);
  return ctx.startRendering();
}

/** A WAV file of the music (for the team to add in a video editor if they like). */
export function wavBlob(buffer) {
  const ch = buffer.numberOfChannels, n = buffer.length, data = new DataView(new ArrayBuffer(44 + n * ch * 2));
  const w = (o, s) => [...s].forEach((c, i) => data.setUint8(o + i, c.charCodeAt(0)));
  w(0, "RIFF"); data.setUint32(4, 36 + n * ch * 2, true); w(8, "WAVE"); w(12, "fmt "); data.setUint32(16, 16, true); data.setUint16(20, 1, true);
  data.setUint16(22, ch, true); data.setUint32(24, buffer.sampleRate, true); data.setUint32(28, buffer.sampleRate * ch * 2, true); data.setUint16(32, ch * 2, true);
  data.setUint16(34, 16, true); w(36, "data"); data.setUint32(40, n * ch * 2, true);
  const chans = [...Array(ch)].map((_, c) => buffer.getChannelData(c));
  for (let i = 0, o = 44; i < n; i++) for (let c = 0; c < ch; c++, o += 2) data.setInt16(o, Math.max(-1, Math.min(1, chans[c][i])) * 0x7fff, true);
  return new Blob([data], { type: "audio/wav" });
}

/** Decode MP3s sent as base64 into AudioBuffers (null stays null). */
export async function decodeParts(parts) {
  const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext, ctx = new Ctx(1, 1, SR);
  return Promise.all(parts.map(async (p) => {
    if (!p) return null;
    const bytes = Uint8Array.from(atob(p.audio), (c) => c.charCodeAt(0));
    return ctx.decodeAudioData(bytes.buffer);
  }));
}

/**
 * The advert's soundtrack: the voice lines placed at their moments, over the music turned down underneath them.
 * starts[i] is when voice i begins (seconds); len the video's length.
 */
export async function mixAdvert({ len, music, voices, starts }) {
  const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext, ctx = new Ctx(2, Math.ceil(len * SR), SR);
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -10; comp.ratio.value = 4; comp.connect(ctx.destination);
  const anyVoice = voices.some(Boolean);
  if (music) { const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = music; g.gain.value = anyVoice ? 0.3 : 1; s.connect(g).connect(comp); s.start(0); }
  voices.forEach((v, i) => { if (!v) return; const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = v; g.gain.value = 1.15; s.connect(g).connect(comp); s.start(Math.max(0, starts[i] || 0)); });
  return ctx.startRendering();
}
