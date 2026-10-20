import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="bg-black text-gray-400 print:hidden">
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <div className="text-white font-bold tracking-widest text-sm">C &amp; A CONTRACTORS LIMITED</div>
          <p className="mt-2 text-sm">Civil, steel and water infrastructure across Uganda, with in-house software for estimating and project control.</p>
        </div>
        <div className="text-sm space-y-2">
          <div className="text-white font-semibold">Company</div>
          <div><Link href="/about" className="hover:text-yellow-400">About us</Link></div>
          <div><Link href="/services" className="hover:text-yellow-400">Services</Link></div>
          <div><Link href="/gallery" className="hover:text-yellow-400">Projects gallery</Link></div>
          <div><Link href="/contact" className="hover:text-yellow-400">Contact</Link></div>
        </div>
        <div className="text-sm space-y-2">
          <div className="text-white font-semibold">Software</div>
          <div><Link href="/boq" className="hover:text-yellow-400">BOQ extraction</Link></div>
          <div><Link href="/pm" className="hover:text-yellow-400">Project manager</Link></div>
          <div><Link href="/pm/sourcing" className="hover:text-yellow-400">Material sourcing</Link></div>
          <div><Link href="/pm/calculator" className="hover:text-yellow-400">Quantity calculator</Link></div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">&copy; {new Date().getFullYear()} C &amp; A Contractors Limited. All rights reserved.</div>
    </footer>
  );
}
