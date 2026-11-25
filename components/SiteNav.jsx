import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MusicPlayer from "./MusicPlayer";
import Brand from "./Brand";
import { getUser, signOut, useOrg } from "../lib/pm";

const LINKS = [];

export default function SiteNav() {
  const { pathname } = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const org = useOrg();
  useEffect(() => { setUser(getUser()); setOpen(false); }, [pathname, org]);

  const on = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const link = (href, text, extra = "") => (
    <Link key={href} href={href} className={`text-sm font-medium transition hover:text-yellow-400 ${on(href) ? "text-yellow-400" : "text-gray-200"} ${extra}`}>{text}</Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-yellow-500/30 print:hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link href={user ? "/pm" : "/"} className="shrink-0 min-w-0"><Brand org={user ? org : null} sub={user ? "Project workspace" : "Projects • Estimating • Sourcing"} /></Link>

        <nav className="hidden lg:flex items-center gap-6">
          {LINKS.map(([h, t]) => link(h, t))}
          <span className="h-5 w-px bg-white/20" />
          {link("/pm", "Project Management and Tendering")}
          {link("/pm/sourcing", "Material Sourcing and Rates")}
          {link("/pm/subcontracts", "Subcontracts")}
          <Link href="/pm/boq" className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-400 transition">BOQ Extraction</Link>
          <MusicPlayer />
          {user
            ? <button onClick={signOut} className="text-sm text-gray-300 hover:text-white">Sign out</button>
            : <Link href="/pm/login" className="text-sm text-gray-200 border border-white/30 rounded-md px-3 py-1.5 hover:border-yellow-400 hover:text-yellow-400 transition">Sign in</Link>}
        </nav>

        <button onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}
          className="lg:hidden text-white border border-yellow-500 px-3 py-1 rounded-md hover:bg-yellow-500 hover:text-black transition">{open ? "Close" : "Menu"}</button>
      </div>

      {open && (
        <nav className="lg:hidden bg-black border-t border-yellow-500/30 px-4 py-3 flex flex-col gap-3">
          {LINKS.map(([h, t]) => link(h, t, "py-1"))}
          {link("/pm", "Project Manager", "py-1")}
          {link("/pm/sourcing", "Material Sourcing", "py-1")}
          {link("/pm/subcontracts", "Subcontracts Marketplace", "py-1")}
          <Link href="/pm/boq" className="rounded-md bg-yellow-500 px-4 py-2 text-center text-sm font-semibold text-black">BOQ Extraction</Link>
          <MusicPlayer compact />
          {user ? <button onClick={signOut} className="text-left text-sm text-gray-300">Sign out</button> : <Link href="/pm/login" className="text-sm text-gray-200">Sign in</Link>}
        </nav>
      )}
    </header>
  );
}
