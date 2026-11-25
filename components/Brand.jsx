import { PRODUCT } from "../lib/pm";

const initials = (name) => (name || "").split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w[0] || "")).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "•";

/** The company's logo, or its initials until an admin uploads one (Company Settings). Without a company: a neutral mark. */
export function Logo({ org, size = "h-11 w-11", className = "" }) {
  if (org?.logo_url) return <img src={org.logo_url} alt={org.name} className={`${size} object-contain rounded-md bg-white p-1 ${className}`} />;
  return (
    <div aria-hidden className={`${size} shrink-0 rounded-md bg-yellow-500 text-black font-bold flex items-center justify-center text-sm ${className}`}>
      {org ? initials(org.name) : "PA"}
    </div>
  );
}

/** Logo plus name: the company's when signed in, the product's otherwise. */
export default function Brand({ org, sub }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <Logo org={org} className="border border-yellow-500/40" />
      <div className="leading-tight hidden sm:block min-w-0">
        <div className="text-white font-bold text-sm tracking-wide truncate max-w-[16rem]">{org?.name || PRODUCT}</div>
        {sub && <div className="text-yellow-400 text-[10px]">{sub}</div>}
      </div>
    </div>
  );
}
