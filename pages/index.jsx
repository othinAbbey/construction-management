import Link from "next/link";
import { useEffect, useState } from "react";
import { PRODUCT, getToken } from "../lib/pm";

const TOOLS = [
  { href: "/pm/boq", tag: "Estimating", title: "BOQ Extraction", text: "Upload a drawing set as a PDF. The AI reads every page, the system checks the quantities, and you download a priced bill of quantities in Excel.", cta: "Extract a BOQ", primary: true },
  { href: "/pm", tag: "Project control", title: "Project Manager", text: "Projects, tasks, schedule, budget and costs, site logs, issues and RFIs, documents, a live project summary and a full audit trail.", cta: "Open the dashboard" },
  { href: "/pm/subcontracts", tag: "Marketplace", title: "Subcontracts", text: "Shared by every company on the platform: post work you want to subcontract, list your team's availability, and apply to or contact other companies directly.", cta: "Browse subcontracts" },
  { href: "/pm/sourcing", tag: "Procurement", title: "Material Sourcing", text: "Compare supplier prices by district, keep a supplier directory, and calculate material quantities and cost for walls, slabs and concrete.", cta: "Find material rates" },
];

export default function Home() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => { setSignedIn(!!getToken()); }, []);
  return (
    <>
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#eab308_0,transparent_45%),radial-gradient(circle_at_80%_70%,#facc15_0,transparent_40%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <div className="text-yellow-400 text-sm font-semibold tracking-widest uppercase">{PRODUCT}</div>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-6xl font-extrabold leading-tight">Build smarter. Estimate faster. Deliver on time.</h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-300">One private workspace for your company: projects, schedules, budgets, BOQ extraction and material sourcing, plus a subcontracts marketplace shared with other companies. Your projects stay visible only to your own team.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {signedIn
              ? <Link href="/pm" className="rounded-md bg-yellow-500 px-6 py-3 font-semibold text-black hover:bg-yellow-400 transition">Open your workspace</Link>
              : <>
                  <Link href="/pm/login?signup=1" className="rounded-md bg-yellow-500 px-6 py-3 font-semibold text-black hover:bg-yellow-400 transition">Create your company account</Link>
                  <Link href="/pm/login" className="rounded-md border border-white/40 px-6 py-3 font-semibold hover:border-yellow-400 hover:text-yellow-400 transition">Sign in</Link>
                </>}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900">What's inside</h2>
        <p className="mt-2 text-gray-600 max-w-2xl">Every tool in one place and one login, branded with your company's name and logo.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className={`group rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${t.primary ? "bg-black text-white border-black" : "bg-white"}`}>
              <div className={`text-xs font-semibold uppercase tracking-widest ${t.primary ? "text-yellow-400" : "text-yellow-600"}`}>{t.tag}</div>
              <h3 className="mt-2 text-xl font-bold">{t.title}</h3>
              <p className={`mt-3 text-sm leading-relaxed ${t.primary ? "text-gray-300" : "text-gray-600"}`}>{t.text}</p>
              <div className={`mt-5 text-sm font-semibold ${t.primary ? "text-yellow-400" : "text-gray-900"}`}>{t.cta} <span className="inline-block transition group-hover:translate-x-1">&rarr;</span></div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
