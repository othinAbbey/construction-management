import { Shell, Card, Panel, Table } from "../../components/pm/ui";
import { money, useApi } from "../../lib/pm";

const LIMIT_LABEL = { boq_jobs_per_month: "BOQ extractions per month" };

/** PLACEHOLDER page: plans and usage are real, payment is not connected yet. */
export default function Billing() {
  const { data: b, error } = useApi("/api/billing");
  const limit = b?.plan.limits.boq_jobs_per_month;
  return (
    <Shell title="Plan & Billing" error={error}>
      <div className="text-sm text-blue-900 bg-blue-50 border border-blue-200 rounded-lg p-3">Subscriptions are coming soon. Everyone is on the Free plan for now and nothing is charged.</div>
      {b && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card label="Current plan" value={b.plan.name} sub={b.status} />
            <Card label="BOQ extractions this month" value={b.usage.boq_jobs_this_month} sub={limit === undefined || limit === null ? "unlimited" : `of ${limit} on this plan`} />
            <Card label="Limits enforced" value={b.limits_enforced ? "Yes" : "Not yet"} />
            <Card label="Price" value={b.plan.price_monthly ? `${b.plan.currency} ${money(b.plan.price_monthly)}` : "Free"} sub="per month" />
          </div>
          <Panel title="Available plans">
            <Table head={["Plan", "Price", "Includes", ""]}>
              {b.available_plans.map((p) => (
                <tr key={p.code} className="border-t">
                  <td className="p-2.5 font-medium">{p.name}{p.code === b.plan.code && <span className="ml-2 rounded bg-yellow-100 px-2 py-0.5 text-xs">current</span>}</td>
                  <td className="p-2.5">{p.price_monthly ? `${p.currency} ${money(p.price_monthly)}` : "To be announced"}</td>
                  <td className="p-2.5 text-gray-600">{Object.entries(p.limits).map(([k, v]) => `${v} ${LIMIT_LABEL[k] || k}`).join(", ") || "No limits"}</td>
                  <td className="p-2.5"><button disabled title="Payments are not available yet" className="rounded-md border px-3 py-1 text-xs text-gray-400">Coming soon</button></td>
                </tr>
              ))}
            </Table>
          </Panel>
        </>
      )}
    </Shell>
  );
}
