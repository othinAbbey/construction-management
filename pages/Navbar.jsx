"use client";

import Link from "next/link";
import { useState } from "react";
import AudioPlayer from "@/components/audioPlayer";
import { usePathname } from "next/navigation";

const buttons = [
  { text: "Home", link: "/" },
  { text: "About Us", link: "/about" },
  { text: "Contact Us", link: "/contact" },
  { text: "Admin", link: "/admin" },
  { text: "Logout", link: "/logout" },
  { text: "Create Account", link: "/newaccount" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/80 border-b border-yellow-500/30 shadow-lg">

      <div className="flex items-center justify-between px-4 py-3">

        {/* 🏗 LOGO */}
        <div className="flex items-center gap-3">

          <img
            src="/assets/logo.jpg"
            alt="Logo"
            className="h-12 w-12 object-contain rounded-md bg-white p-1 border border-yellow-500/40 shadow-md hover:scale-105 transition"
          />

          <div className="leading-tight hidden sm:block">
            <h1 className="text-white font-bold text-sm tracking-widest">
              C & A CONTRACTORS
            </h1>
            <p className="text-yellow-400 text-[10px]">
              Civil • Steel • Water Infrastructure
            </p>
          </div>

        </div>

        {/* 🎵 AUDIO */}
        <div className="hidden md:block">
          <AudioPlayer />
        </div>

        {/* 📱 MOBILE BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white border border-yellow-500 px-3 py-1 rounded-md hover:bg-yellow-500 hover:text-black transition"
        >
          Menu
        </button>

        {/* 🖥 DESKTOP MENU */}
        <ul className="hidden lg:flex items-center gap-8">

          {buttons.map((btn, i) => {
            const isActive = pathname === btn.link;

            return (
              <li key={i}>
                <Link
                  href={btn.link}
                  className={`relative text-sm font-medium transition group ${
                    isActive ? "text-yellow-400" : "text-white"
                  }`}
                >

                  {btn.text}

                  {/* underline animation */}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-yellow-400 transition-all group-hover:w-full"></span>

                </Link>
              </li>
            );
          })}

        </ul>

      </div>

      {/* 📱 MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden bg-black/95 border-t border-yellow-500/30">

          <ul className="flex flex-col">

            {buttons.map((btn, i) => {
              const isActive = pathname === btn.link;

              return (
                <li key={i} className="border-b border-white/10">

                  <Link
                    href={btn.link}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 transition ${
                      isActive
                        ? "bg-yellow-500 text-black font-semibold"
                        : "text-white hover:bg-yellow-500/10"
                    }`}
                  >
                    {btn.text}
                  </Link>

                </li>
              );
            })}

          </ul>

        </div>
      )}

    </nav>
  );
}

export default Navbar;