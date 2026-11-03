import { useState } from "react";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";   // no look-alike characters (0/O, 1/l/I)
export function randomPassword(length = 14) {
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

/** A password box with a Show/Hide button. `generate` adds a "make a strong password" link (used when creating accounts). */
export default function PasswordField({ label, value, onChange, required, minLength, autoComplete, generate = false, className = "", ...rest }) {
  const [show, setShow] = useState(false);
  return (
    <label className={`block text-sm text-gray-600 ${className}`}>{label}
      <span className="relative mt-1 block">
        <input type={show ? "text" : "password"} value={value} required={required} minLength={minLength} autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)} className="w-full border border-gray-300 rounded-md pl-2.5 pr-16 py-1.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400" {...rest} />
        <button type="button" onClick={() => setShow(!show)} aria-pressed={show} aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded px-2 py-0.5 text-xs font-medium text-gray-600 hover:bg-gray-100">{show ? "Hide" : "Show"}</button>
      </span>
      {generate && <button type="button" onClick={() => { onChange(randomPassword()); setShow(true); }} className="mt-1 text-xs text-blue-700 hover:underline">Make a strong password</button>}
    </label>
  );
}
