import Link from "next/link";
import { PRODUCT, useOrg } from "../lib/pm";

export default function SiteFooter() {
  const org = useOrg();
  return (
    <footer className="bg-black text-gray-400 print:hidden">
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-2">
        <div>
          <div className="text-white font-bold tracking-widest text-sm">{org?.name || PRODUCT}</div>
          <p className="mt-2 text-sm">Project control, estimating, material sourcing and a subcontracts marketplace in one workspace.</p>
        </div>
        <div className="text-sm space-y-2">
          <div className="text-white font-semibold">Tools</div>
          <div><Link href="/pm/boq" className="hover:text-yellow-400">BOQ extraction</Link></div>
          <div><Link href="/pm" className="hover:text-yellow-400">Project manager</Link></div>
          <div><Link href="/pm/sourcing" className="hover:text-yellow-400">Material sourcing</Link></div>
          <div><Link href="/pm/subcontracts" className="hover:text-yellow-400">Subcontracts marketplace</Link></div>
          <div><Link href="/pm/calculator" className="hover:text-yellow-400">Quantity calculator</Link></div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">&copy; {new Date().getFullYear()} {org?.name || PRODUCT}. All rights reserved.</div>
    </footer>
  );
}
