import { useEffect, useMemo, useState } from "react";
import { Btn, Empty, Field, Select, Shell } from "../../components/pm/ui";
import { Logo } from "../../components/Brand";
import { api, can, getUser, money, useApi } from "../../lib/pm";

/**
 * The subcontracts marketplace: the one page shared by every company.
 * Companies post subcontracts (work they want to give out) or their availability (work they can take on);
 * others apply or send an enquiry, or simply call / WhatsApp / email the contact shown.
 */
const CURRENCIES = ["UGX", "USD", "EUR", "KES", "TZS"];
const KIND = {
  subcontract: { tab: "Subcontracts available", post: "Post a subcontract", act: "Apply", acted: "You applied", noun: "subcontract", reply: "application" },
  availability: { tab: "Subcontractors available", post: "List your availability", act: "Send enquiry", acted: "You sent an enquiry", noun: "availability", reply: "enquiry" },
};
const RESP_TONE = { new: "bg-blue-100 text-blue-800", shortlisted: "bg-amber-100 text-amber-800", accepted: "bg-green-100 text-green-800", declined: "bg-red-100 text-red-700", withdrawn: "bg-gray-100 text-gray-500" };
const LIST_TONE = { open: "bg-green-100 text-green-800", awarded: "bg-blue-100 text-blue-800", closed: "bg-gray-100 text-gray-600" };
const Badge = ({ tone, children }) => <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${tone}`}>{children}</span>;
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : "");

const daysLeft = (d) => (d ? Math.ceil((Date.parse(`${d}T23:59:59`) - Date.now()) / 86400000) : null);
function ApplyBy({ date }) {
  const n = daysLeft(date);
  if (!date) return null;
  const cls = n < 0 ? "bg-gray-100 text-gray-500" : n <= 3 ? "bg-red-100 text-red-700" : n <= 10 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800";
  return <span>Apply by {date} <Badge tone={cls}>{n < 0 ? "closed" : n === 0 ? "today" : `${n} day${n === 1 ? "" : "s"} left`}</Badge></span>;
}

/** Uganda numbers for WhatsApp: 0772 123456 -> 256772123456. */
const waNumber = (phone) => {
  let d = String(phone || "").replace(/\D/g, "");
  if (d.startsWith("0")) d = "256" + d.slice(1);
  else if (d.length === 9 && d.startsWith("7")) d = "256" + d;
  return d.length >= 10 ? d : null;
};
function ContactLinks({ name, phone, email, subject }) {
  const wa = waNumber(phone);
  if (!phone && !email) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {name && <span className="text-gray-600">{name}</span>}
      {phone && <a href={`tel:${phone.replace(/\s/g, "")}`} className="rounded-md border px-2.5 py-1 hover:bg-gray-50">📞 {phone}</a>}
      {wa && <a href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hello, about "${subject}" on the subcontracts marketplace.`)}`} target="_blank" rel="noreferrer" className="rounded-md border px-2.5 py-1 hover:bg-gray-50">WhatsApp</a>}
      {email && <a href={`mailto:${email}?subject=${encodeURIComponent(subject)}`} className="rounded-md border px-2.5 py-1 hover:bg-gray-50">✉️ {email}</a>}
    </div>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className={`bg-white rounded-2xl shadow-xl p-6 w-full ${wide ? "max-w-3xl" : "max-w-xl"} max-h-[90vh] overflow-y-auto space-y-4`}>
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black text-xl leading-none" aria-label="Close">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const box = "mt-1 w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400";
const Area = ({ label, value, onChange, rows = 3, placeholder }) => (
  <label className="text-sm text-gray-600 sm:col-span-2">{label}<textarea className={box} rows={rows} placeholder={placeholder} value={value ?? ""} onChange={(e) => onChange(e.target.value)} /></label>
);

/** Post or edit a listing. The fields shown depend on the kind. */
function ListingForm({ kind, listing, trades, locations, onClose, onSaved }) {
  const me = getUser() || {};
  const [v, setV] = useState(() => listing ? { ...listing } : { kind, title: "", trade: "", region: "", district: "", description: "", start_date: "", end_date: "", deadline: "",
    value: "", currency: "UGX", crew_size: "", equipment: "", requirements: "", contact_name: me.name || "", contact_phone: "", contact_email: me.email || "" });
  const [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const set = (k) => (x) => setV((p) => ({ ...p, [k]: x }));
  const regions = [...new Set(locations.map((l) => l.region))];
  const districts = locations.filter((l) => l.region === v.region).map((l) => l.district);
  const sub = (listing?.kind || kind) === "subcontract", K = KIND[listing?.kind || kind];

  async function save(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    const keys = ["title", "trade", "region", "district", "description", "start_date", "end_date", "value", "currency", "contact_name", "contact_phone", "contact_email",
      ...(sub ? ["deadline", "requirements"] : ["crew_size", "equipment"])];
    const body = Object.fromEntries(keys.map((k) => [k, v[k] === "" ? null : v[k]]));
    try {
      const saved = listing ? await api(`/api/market/listings/${listing.id}`, { method: "PATCH", body }) : await api("/api/market/listings", { method: "POST", body: { ...body, kind } });
      onSaved(saved);
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  return (
    <Modal title={listing ? `Edit ${K.noun}` : K.post} onClose={onClose} wide>
      <p className="text-sm text-gray-600">{sub ? "Describe the work you want to give out. Every company on the platform can see it and apply." : "Tell other companies what work your team can take on. They can contact you or send an enquiry."}</p>
      {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{err}</div>}
      <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2"><Field label="Title" required value={v.title} onChange={set("title")} placeholder={sub ? "e.g. Roofing for 3 classroom blocks in Gulu" : "e.g. Steel fixing team of 8, free from January"} /></div>
        <Select label="Trade" required value={v.trade} blank="Choose a trade" onChange={set("trade")} options={trades.map((t) => ({ v: t, l: t }))} />
        <div />
        {regions.length ? <>
          <Select label="Region" value={v.region || ""} blank="Any / not set" onChange={(x) => setV((p) => ({ ...p, region: x, district: "" }))} options={regions.map((r) => ({ v: r, l: r }))} />
          <Select label="District" value={v.district || ""} blank="Any / not set" onChange={set("district")} options={districts.map((d) => ({ v: d, l: d }))} />
        </> : <>
          <Field label="Region" value={v.region || ""} onChange={set("region")} />
          <Field label="District" value={v.district || ""} onChange={set("district")} />
        </>}
        <Field label={sub ? "Work starts" : "Available from"} type="date" value={v.start_date || ""} onChange={set("start_date")} />
        <Field label={sub ? "Work ends" : "Available until"} type="date" value={v.end_date || ""} onChange={set("end_date")} />
        {sub && <Field label="Apply by" type="date" value={v.deadline || ""} onChange={set("deadline")} />}
        {!sub && <Field label="Team size (workers)" type="number" min="0" value={v.crew_size ?? ""} onChange={set("crew_size")} />}
        <div className="grid grid-cols-[1fr_6rem] gap-2">
          <Field label={sub ? "Estimated value" : "Typical rate (optional)"} type="number" min="0" value={v.value ?? ""} onChange={set("value")} />
          <Select label="Currency" value={v.currency || "UGX"} blank={null} onChange={set("currency")} options={CURRENCIES.map((c) => ({ v: c, l: c }))} />
        </div>
        <Area label={sub ? "Scope of work" : "What you can do"} value={v.description} onChange={set("description")} rows={4}
          placeholder={sub ? "Quantities, specification, site conditions, what you supply and what they supply..." : "Types of work, recent projects, areas you cover..."} />
        {sub ? <Area label="Requirements" value={v.requirements} onChange={set("requirements")} placeholder="e.g. Registered company, 3 similar jobs, own scaffolding, NSSF and URA compliance" />
          : <Area label="Equipment" value={v.equipment} onChange={set("equipment")} placeholder="e.g. Bar bender, cutter, scaffolding, pickup truck" />}
        <div className="sm:col-span-2 text-sm font-semibold text-gray-800 pt-2">How companies reach you</div>
        <Field label="Contact person" value={v.contact_name || ""} onChange={set("contact_name")} />
        <Field label="Phone / WhatsApp" value={v.contact_phone || ""} onChange={set("contact_phone")} placeholder="e.g. 0772 123456" />
        <Field label="Email" type="email" value={v.contact_email || ""} onChange={set("contact_email")} />
        <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
          <Btn type="button" kind="secondary" onClick={onClose}>Cancel</Btn>
          <Btn disabled={busy}>{busy ? "Saving..." : listing ? "Save changes" : "Publish"}</Btn>
        </div>
      </form>
    </Modal>
  );
}

/** Apply to a subcontract, or send an enquiry to an available subcontractor. Sending again updates the earlier one. */
function RespondForm({ listing, existing, onClose, onSaved }) {
  const me = getUser() || {}, K = KIND[listing.kind];
  const [v, setV] = useState({ message: existing?.message || "", price: existing?.price ?? "", currency: existing?.currency || "UGX",
    contact_name: existing?.contact_name || me.name || "", contact_phone: existing?.contact_phone || "", contact_email: existing?.contact_email || me.email || "" });
  const [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const set = (k) => (x) => setV((p) => ({ ...p, [k]: x }));
  async function send(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    try { onSaved(await api(`/api/market/listings/${listing.id}/responses`, { method: "POST", body: { ...v, price: v.price === "" ? null : v.price } })); }
    catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  return (
    <Modal title={`${existing ? "Update your" : K.act + ":"} ${existing ? K.reply : ""} ${listing.title}`} onClose={onClose}>
      <p className="text-sm text-gray-600">Only <b>{listing.company_name}</b> will see this. They can reply by phone or email, and mark it shortlisted, accepted or declined.</p>
      {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{err}</div>}
      <form onSubmit={send} className="grid gap-3 sm:grid-cols-2">
        <Area label="Message" value={v.message} onChange={set("message")} rows={5}
          placeholder={listing.kind === "subcontract" ? "Why your company fits: similar jobs done, team and equipment, when you can start..." : "The work you need done, where, when and for how long..."} />
        <div className="grid grid-cols-[1fr_6rem] gap-2 sm:col-span-2">
          <Field label={listing.kind === "subcontract" ? "Your price (optional)" : "Your budget (optional)"} type="number" min="0" value={v.price} onChange={set("price")} />
          <Select label="Currency" value={v.currency} blank={null} onChange={set("currency")} options={CURRENCIES.map((c) => ({ v: c, l: c }))} />
        </div>
        <Field label="Contact person" value={v.contact_name} onChange={set("contact_name")} />
        <Field label="Phone / WhatsApp" value={v.contact_phone} onChange={set("contact_phone")} placeholder="e.g. 0772 123456" />
        <Field label="Email" type="email" value={v.contact_email} onChange={set("contact_email")} />
        <div className="sm:col-span-2 flex justify-end gap-2">
          <Btn type="button" kind="secondary" onClick={onClose}>Cancel</Btn>
          <Btn disabled={busy || !v.message.trim()}>{busy ? "Sending..." : existing ? "Update" : "Send"}</Btn>
        </div>
      </form>
    </Modal>
  );
}

function ListingCard({ l, canPost, onRespond, onManage }) {
  const K = KIND[l.kind], where = [l.district, l.region].filter(Boolean).join(", ");
  const period = l.start_date || l.end_date ? `${l.kind === "subcontract" ? "Work" : "Available"}: ${l.start_date || "now"} to ${l.end_date || "open-ended"}` : null;
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <Logo org={{ name: l.company_name, logo_url: l.company_logo }} size="h-10 w-10" className="border" />
        <div className="min-w-0 flex-1">
          <div className="text-xs text-gray-500">{l.company_name}{l.own && <Badge tone="bg-yellow-100 text-yellow-800 ml-2">Your company</Badge>}</div>
          <div className="font-semibold text-gray-900">{l.title}</div>
          <div className="mt-1 flex flex-wrap gap-2 text-xs">
            <Badge tone="bg-gray-100 text-gray-700">{l.trade}</Badge>
            {where && <span className="text-gray-600">📍 {where}</span>}
            {l.status !== "open" && <Badge tone={LIST_TONE[l.status]}>{cap(l.status)}</Badge>}
          </div>
        </div>
        {l.value != null && <div className="text-right shrink-0"><div className="text-xs text-gray-500">{l.kind === "subcontract" ? "Est. value" : "Rate"}</div><div className="font-semibold">{l.currency} {money(l.value)}</div></div>}
      </div>
      {l.description && <p className="text-sm text-gray-700 whitespace-pre-line line-clamp-4">{l.description}</p>}
      <div className="text-xs text-gray-600 space-y-0.5">
        {period && <div>{period}</div>}
        {l.kind === "subcontract" && l.deadline && <div><ApplyBy date={l.deadline} /></div>}
        {l.crew_size != null && <div>Team: {l.crew_size} workers</div>}
        {l.equipment && <div>Equipment: {l.equipment}</div>}
        {l.requirements && <div>Requirements: {l.requirements}</div>}
      </div>
      <ContactLinks name={l.contact_name} phone={l.contact_phone} email={l.contact_email} subject={l.title} />
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t">
        {l.own
          ? <><span className="text-sm text-gray-600 mt-2">{l.responses?.n || 0} response{l.responses?.n === 1 ? "" : "s"}{l.responses?.unread ? <b className="text-blue-700"> · {l.responses.unread} new</b> : null}</span>
              <Btn kind="secondary" className="mt-2" onClick={() => onManage(l)}>Manage</Btn></>
          : <>
              {l.my_response && <span className="mt-2 text-sm">{K.acted} <Badge tone={RESP_TONE[l.my_response.status]}>{l.my_response.status}</Badge></span>}
              {canPost && l.status === "open" && !["accepted", "declined"].includes(l.my_response?.status) &&
                <Btn className="mt-2" kind={l.my_response ? "secondary" : "primary"} onClick={() => onRespond(l)}>{l.my_response ? `Update ${K.reply}` : K.act}</Btn>}
            </>}
      </div>
    </div>
  );
}

/** Your own listing: change its status, edit it, and answer the responses it received. */
function Manage({ id, trades, locations, onClose, onChanged }) {
  const [l, setL] = useState(null), [err, setErr] = useState(""), [editing, setEditing] = useState(false);
  const load = () => api(`/api/market/listings/${id}`).then(setL).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  const act = (p) => p.then(() => { setErr(""); load(); onChanged(); }).catch((e) => setErr(e.message));
  if (!l) return <Modal title="Loading..." onClose={onClose}>{err && <p className="text-sm text-red-700">{err}</p>}</Modal>;
  const K = KIND[l.kind];
  return (
    <Modal title={l.title} onClose={onClose} wide>
      {err && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{err}</div>}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-gray-600">Status:</span>
        {["open", "awarded", "closed"].map((s) => (
          <button key={s} onClick={() => act(api(`/api/market/listings/${l.id}`, { method: "PATCH", body: { status: s } }))}
            className={`rounded-full px-3 py-1 text-xs font-semibold border ${l.status === s ? LIST_TONE[s] + " border-transparent" : "bg-white text-gray-600 hover:bg-gray-50"}`}>{cap(s)}</button>
        ))}
        <span className="text-xs text-gray-500">{l.status === "open" ? "Visible to every company." : "Hidden from the public list; still here for you."}</span>
        <div className="ml-auto flex gap-2">
          <Btn kind="secondary" onClick={() => setEditing(true)}>Edit</Btn>
          <button className="text-sm text-red-600 hover:underline" onClick={() => confirm("Delete this listing and all responses to it?") && api(`/api/market/listings/${l.id}`, { method: "DELETE" }).then(() => { onChanged(); onClose(); }).catch((e) => setErr(e.message))}>Delete</button>
        </div>
      </div>
      <h3 className="font-semibold text-gray-800">{cap(K.reply)}s received ({l.response_list.length})</h3>
      {!l.response_list.length ? <Empty>No {K.reply}s yet. Companies that respond will appear here with their contact details.</Empty> : (
        <div className="space-y-3">
          {l.response_list.map((r) => (
            <div key={r.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Logo org={{ name: r.company_name, logo_url: r.company_logo }} size="h-8 w-8" className="border" />
                <b>{r.company_name}</b>
                <Badge tone={RESP_TONE[r.status]}>{r.status}</Badge>
                {r.price != null && <span className="text-sm text-gray-700">· {r.currency} {money(r.price)}</span>}
                <span className="ml-auto text-xs text-gray-400">{new Date(r.updated || r.created).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-line">{r.message}</p>
              <ContactLinks name={r.contact_name} phone={r.contact_phone} email={r.contact_email} subject={l.title} />
              {r.status !== "withdrawn" && (
                <div className="flex gap-2 text-xs">
                  {["shortlisted", "accepted", "declined"].filter((s) => s !== r.status).map((s) => (
                    <button key={s} onClick={() => act(api(`/api/market/responses/${r.id}`, { method: "PATCH", body: { status: s } }))} className="rounded-md border px-2.5 py-1 hover:bg-gray-50">
                      {s === "shortlisted" ? "Shortlist" : s === "accepted" ? "Accept" : "Decline"}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {editing && <ListingForm listing={l} trades={trades} locations={locations} onClose={() => setEditing(false)} onSaved={() => { setEditing(false); load(); onChanged(); }} />}
    </Modal>
  );
}

function Browse({ kind, options, locations, canPost, refresh, bump, onManage }) {
  const [f, setF] = useState({ q: "", trade: "", region: "" });
  const qs = new URLSearchParams({ kind, ...Object.fromEntries(Object.entries(f).filter(([, v]) => v)) }).toString();
  const { data, error, reload } = useApi(`/api/market/listings?${qs}`, [refresh]);
  const [posting, setPosting] = useState(false), [responding, setResponding] = useState(null);
  const regions = [...new Set(locations.map((l) => l.region))];
  const K = KIND[kind];
  const [err, setErr] = useState("");
  /** Updating an earlier response starts from what was sent, so load it first. */
  const respond = (l) => (l.my_response
    ? api(`/api/market/listings/${l.id}`).then((d) => setResponding({ listing: l, existing: d.my_response })).catch((e) => setErr(e.message))
    : setResponding({ listing: l, existing: null }));
  return (
    <div className="space-y-4">
      {(error || err) && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{error || err}</div>}
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-64"><Field label="Search" value={f.q} onChange={(q) => setF({ ...f, q })} placeholder="title, company, district..." /></div>
        <div className="w-56"><Select label="Trade" value={f.trade} blank="All trades" onChange={(trade) => setF({ ...f, trade })} options={(options?.trades || []).map((t) => ({ v: t, l: t }))} /></div>
        {regions.length > 0 && <div className="w-44"><Select label="Region" value={f.region} blank="All regions" onChange={(region) => setF({ ...f, region })} options={regions.map((r) => ({ v: r, l: r }))} /></div>}
        {canPost && <Btn className="ml-auto" onClick={() => setPosting(true)}>{K.post}</Btn>}
      </div>
      {!data ? null : !data.length ? <Empty>No open {kind === "subcontract" ? "subcontracts" : "subcontractors"} {f.q || f.trade || f.region ? "match these filters" : "yet"}.{canPost ? ` Be the first: ${K.post.toLowerCase()}.` : ""}</Empty> : (
        <div className="grid gap-4 lg:grid-cols-2">
          {data.map((l) => <ListingCard key={l.id} l={l} canPost={canPost} onRespond={respond} onManage={onManage} />)}
        </div>
      )}
      {posting && <ListingForm kind={kind} trades={options?.trades || []} locations={locations} onClose={() => setPosting(false)} onSaved={() => { setPosting(false); reload(); bump(); }} />}
      {responding && <RespondForm listing={responding.listing} existing={responding.existing} onClose={() => setResponding(null)} onSaved={() => { setResponding(null); reload(); bump(); }} />}
    </div>
  );
}

function MyListings({ refresh, onManage }) {
  const { data, error } = useApi("/api/market/listings?mine=1", [refresh]);
  return (
    <div className="space-y-3">
      {error && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}
      {!data ? null : !data.length ? <Empty>Your company has not posted anything yet. Use the first two tabs to post a subcontract or list your availability.</Empty> : (
        <div className="bg-white border rounded-xl divide-y">
          {data.map((l) => (
            <div key={l.id} className="p-3 flex flex-wrap items-center gap-3">
              <Badge tone="bg-gray-100 text-gray-700">{l.kind === "subcontract" ? "Subcontract" : "Availability"}</Badge>
              <div className="min-w-0 flex-1"><div className="font-medium">{l.title}</div><div className="text-xs text-gray-500">{l.trade}{l.posted_by ? ` · posted by ${l.posted_by}` : ""}</div></div>
              <Badge tone={LIST_TONE[l.status]}>{cap(l.status)}</Badge>
              <span className="text-sm text-gray-600">{l.responses?.n || 0} response{l.responses?.n === 1 ? "" : "s"}{l.responses?.unread ? <b className="text-blue-700"> · {l.responses.unread} new</b> : null}</span>
              <Btn kind="secondary" onClick={() => onManage(l)}>Manage</Btn>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Sent({ refresh, bump, canPost }) {
  const { data, error, reload } = useApi("/api/market/responses", [refresh]);
  const [err, setErr] = useState("");
  return (
    <div className="space-y-3">
      {(error || err) && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{error || err}</div>}
      {!data ? null : !data.length ? <Empty>Applications and enquiries your company sends appear here, with the answer from the other company.</Empty> : (
        <div className="bg-white border rounded-xl divide-y">
          {data.map((r) => (
            <div key={r.id} className="p-3 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="bg-gray-100 text-gray-700">{r.listing_kind === "subcontract" ? "Application" : "Enquiry"}</Badge>
                <b>{r.listing_title}</b><span className="text-sm text-gray-500">· {r.listing_company}</span>
                <Badge tone={RESP_TONE[r.status]}>{r.status}</Badge>
                {canPost && !["withdrawn", "accepted", "declined"].includes(r.status) &&
                  <button className="ml-auto text-xs text-red-600 hover:underline" onClick={() => confirm("Withdraw this?") && api(`/api/market/responses/${r.id}`, { method: "PATCH", body: { status: "withdrawn" } }).then(() => { reload(); bump(); }).catch((e) => setErr(e.message))}>Withdraw</button>}
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-line line-clamp-2">{r.message}</p>
              <div className="text-xs text-gray-400">Sent by {r.sent_by || "-"} · {new Date(r.updated || r.created).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Subcontracts() {
  const [tab, setTab] = useState("subcontract");
  const [n, setN] = useState(0), bump = () => setN((x) => x + 1);
  const [canPost, setCanPost] = useState(false), [canCatalog, setCanCatalog] = useState(false);
  const [managing, setManaging] = useState(null);
  useEffect(() => { const u = getUser(); setCanPost(can(u, "market:post")); setCanCatalog(can(u, "catalog:read")); }, []);
  const options = useApi("/api/market/options");
  const locs = useApi(canCatalog ? "/api/locations" : null, [canCatalog]);
  const locations = useMemo(() => locs.data || [], [locs.data]);
  const tabs = [["subcontract", KIND.subcontract.tab], ["availability", KIND.availability.tab], ["mine", "My listings"], ["sent", "My applications & enquiries"]];
  return (
    <Shell title="Subcontracts" error={options.error}>
      <p className="text-sm text-gray-600 -mt-2">Shared by every company on the platform. Post work you want to subcontract, or list your team's availability; other companies apply, send an enquiry, or contact you directly. Your projects, tenders and other data stay private.</p>
      <div className="flex gap-1 border-b overflow-x-auto">
        {tabs.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 whitespace-nowrap ${tab === k ? "border-yellow-500 text-black" : "border-transparent text-gray-500 hover:text-black"}`}>{l}</button>)}
      </div>
      {(tab === "subcontract" || tab === "availability") && <Browse key={tab} kind={tab} options={options.data} locations={locations} canPost={canPost} refresh={n} bump={bump} onManage={(l) => setManaging(l.id)} />}
      {tab === "mine" && <MyListings refresh={n} onManage={(l) => setManaging(l.id)} />}
      {tab === "sent" && <Sent refresh={n} bump={bump} canPost={canPost} />}
      {managing && <Manage id={managing} trades={options.data?.trades || []} locations={locations} onClose={() => setManaging(null)} onChanged={bump} />}
    </Shell>
  );
}
