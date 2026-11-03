import Link from "next/link";
import { useEffect, useState } from "react";
import { can, getToken, getUser } from "../lib/pm";
import { ApiError, BoqApi } from "../lib/boqApi";

const ACTIVE = ["queued", "reading", "building"];
const POLL_MS = 2000;
const fmt = (n, d = 2) => (n === null || n === undefined || n === "" ? "" : Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }));
const WHO = { anthropic: "Claude", openai: "OpenAI", gemini: "Gemini" };

function Banner({ msg, onClose }) {
  if (!msg) return null;
  const tone = { error: "bg-red-50 text-red-800 border-red-200", warn: "bg-amber-50 text-amber-800 border-amber-200", ok: "bg-green-50 text-green-800 border-green-200", info: "bg-blue-50 text-blue-800 border-blue-200" }[msg.kind];
  return <div className={`flex justify-between gap-3 rounded-lg border p-3 text-sm ${tone}`}><span>{msg.text}</span>{onClose && <button onClick={onClose} aria-label="Dismiss">&times;</button>}</div>;
}

export default function Boq() {
  const [authed, setAuthed] = useState(null);
  const [me, setMe] = useState(null);

  useEffect(() => { setAuthed(!!getToken()); setMe(getUser()); }, []);

  if (authed === null) return null;
  if (!authed) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">BOQ Extraction</h1>
        <p className="mt-3 text-gray-600">Upload a drawing set as a PDF and get a priced bill of quantities in Excel. Sign in to use it.</p>
        <Link href="/pm/login?next=/boq" className="inline-block mt-6 rounded-md bg-yellow-500 px-6 py-3 font-semibold text-black hover:bg-yellow-400">Sign in</Link>
        <div className="mt-3 text-sm text-gray-500">No account? <Link href="/contact" className="underline">Ask us for access</Link>.</div>
      </div>
    );
  }

  // BOQ is suspended until fully operational — show placeholder only.
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">BOQ Extraction</h1>
        <p className="text-gray-600 mt-1">Coming soon: AI-powered bill of quantities extraction from PDF drawings.</p>
      </div>

      <Banner msg={{ kind: "info", text: "BOQ extraction is currently suspended. This feature will be available once the backend processing is fully operational. All existing jobs and data remain saved in your account." }} onClose={() => setMsg(null)} />

      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
        <h2 className="font-semibold text-blue-800">What BOQ will do</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-3">
          <li>Upload PDF drawing sets and get a priced bill of quantities in Excel format</li>
          <li>Automatic detection of drawing elements (rooms, openings, components)</li>
          <li>Integration with rate book for per-item pricing</li>
          <li>Generation of checks and warnings for reviewed items</li>
          <li>Export results for project estimating and procurement</li>
        </ul>
      </div>

      <div className="bg-yellow-50 border-yellow-200 rounded-lg p-6">
        <h3 className="font-semibold text-yellow-800">Status</h3>
        <p className="text-yellow-700">The BOQ extraction service is currently suspended pending full operational readiness. All existing jobs and data remain saved in your account. Once the service is fully operational, you will be able to upload PDFs and receive complete BOQ extracts with pricing.</p>
      </div>
    </div>
  );
}
