import { useEffect, useRef, useState } from "react";

/** Set NEXT_PUBLIC_MUSIC_URL to change the station. Use an https:// address when the site itself is served over https. */
const STREAM = process.env.NEXT_PUBLIC_MUSIC_URL || "http://stream3.slowradio.com";

/**
 * "Play music" button. Lives in the site header, which stays mounted while you move between pages,
 * so the music keeps playing. Browsers only allow sound after a click, so it never starts by itself.
 */
export default function MusicPlayer({ compact = false }) {
  const audio = useRef(null);
  const [state, setState] = useState("stopped");           // stopped | loading | playing | error

  useEffect(() => () => { audio.current?.pause(); }, []);

  async function toggle() {
    const a = audio.current;
    if (state === "playing" || state === "loading") { a.pause(); setState("stopped"); return; }
    setState("loading");
    try { a.src = STREAM; await a.play(); setState("playing"); }
    catch { setState("error"); }
  }

  const label = { stopped: "Play music", loading: "Loading...", playing: "Pause music", error: "Music unavailable" }[state];
  return (
    <>
      <audio ref={audio} preload="none" onError={() => setState("error")} onPlaying={() => setState("playing")} />
      <button onClick={toggle} title={state === "error" ? "The radio stream could not be played. Try again, or ask the site owner to check the stream address." : "Background music"}
        className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition ${state === "playing" ? "border-yellow-400 text-yellow-400" : "border-white/30 text-gray-200 hover:border-yellow-400 hover:text-yellow-400"} ${compact ? "w-full justify-center" : ""}`}>
        <span aria-hidden="true">{state === "playing" ? "❚❚" : "♪"}</span>{label}
      </button>
    </>
  );
}
