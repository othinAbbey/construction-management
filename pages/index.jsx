import Link from "next/link";

const TOOLS = [
  { href: "/boq", tag: "Estimating", title: "BOQ Extraction", text: "Upload a drawing set as a PDF. The AI reads every page, the system checks the quantities, and you download a priced bill of quantities in Excel.", cta: "Extract a BOQ", primary: true },
  { href: "/pm", tag: "Project control", title: "Project Manager", text: "Projects, tasks, schedule, budget and costs, site logs, issues and RFIs, documents, a live project summary and a full audit trail.", cta: "Open the dashboard" },
  { href: "/pm/sourcing", tag: "Procurement", title: "Material Sourcing", text: "Compare supplier prices by district across Uganda, keep a supplier directory, and calculate material quantities and cost for walls, slabs and concrete.", cta: "Find material rates" },
];

const SERVICES = [
  ["Civil engineering works", "Drainage, culverts, excavation, foundations, slabs and retaining walls."],
  ["Water infrastructure", "Borehole motorisation, pumps, pipelines and community water systems."],
  ["Steel & structural works", "Warehouses, steel roofing, industrial sheds and fabrication."],
  ["Planning & cost engineering", "Take-offs, budgets, feasibility studies and programmes."],
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#eab308_0,transparent_45%),radial-gradient(circle_at_80%_70%,#facc15_0,transparent_40%)]" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28">
          <div className="text-yellow-400 text-sm font-semibold tracking-widest">C &amp; A CONTRACTORS LIMITED</div>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-6xl font-extrabold leading-tight">Build smarter. Estimate faster. Deliver on time.</h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-300">Civil, steel and water infrastructure across Uganda, backed by our own software for estimating, material sourcing and project control.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/boq" className="rounded-md bg-yellow-500 px-6 py-3 font-semibold text-black hover:bg-yellow-400 transition">Extract a BOQ from drawings</Link>
            <Link href="/pm" className="rounded-md border border-white/40 px-6 py-3 font-semibold hover:border-yellow-400 hover:text-yellow-400 transition">Open Project Manager</Link>
            <Link href="/contact" className="rounded-md px-6 py-3 font-semibold text-gray-300 hover:text-white transition">Request a quote &rarr;</Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900">Our software</h2>
        <p className="mt-2 text-gray-600 max-w-2xl">The same tools we use on our own sites, in one place and one login.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
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

      <section className="bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-3xl font-bold text-gray-900">What we build</h2>
            <Link href="/services" className="text-sm font-semibold text-gray-700 hover:text-black">All services &rarr;</Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(([t, d]) => (
              <div key={t} className="border-l-4 border-yellow-500 pl-4"><h3 className="font-bold text-gray-900">{t}</h3><p className="mt-1 text-sm text-gray-600">{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Have a project in mind?</h2>
        <p className="mt-2 text-gray-600">Send us your drawings or a few details and we will come back with a plan and a price.</p>
        <Link href="/contact" className="mt-6 inline-block rounded-md bg-black px-8 py-3 font-semibold text-white hover:bg-gray-800 transition">Contact us</Link>
      </section>
    </>
  );
}
