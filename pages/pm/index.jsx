import Link from "next/link";
import { Shell, Card, Bar, Empty, Health, Panel } from "../../components/pm/ui";
import { useEffect, useState } from "react";
import { can, getUser, money, today, useApi, usePM } from "../../lib/pm";
import { useRouter } from "next/router";
import Spinner from "../../components/spinner";



export default function Dashboard() {
  const router = useRouter();
  const [me, setMe] = useState(undefined);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const user = getUser();
    setMe(user);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (authChecked && !me) {
      router.replace("/pm/login");
    }
  }, [authChecked, me, router]);

  // Never mount the dashboard before checking authentication.
  if (!authChecked || !me) {
    return <Spinner />;
  }

  // Signed-in users without project access see the welcome page.
  if (!can(me, "projects:read")) {
    return <Welcome me={me} />;
  }

  return <ProjectDashboard />;
}



function Welcome({ me }) {
  return (
    <Shell title={`Welcome${me?.name ? `, ${me.name}` : ""}`}>
      <div className="grid sm:grid-cols-3 gap-3 text-sm">
        <Link href="/boq" className="bg-black text-white rounded-xl p-4 hover:bg-gray-900"><b className="text-yellow-400">Estimation and Tendering</b><div className="text-gray-300 mt-1">Upload a drawing PDF. Your files and results are saved to your account.</div></Link>
        <Link href="/pm/sourcing" className="bg-white border rounded-xl p-4 hover:bg-gray-50"><b>Material Supplier and Rates</b><div className="text-gray-500 mt-1">Compare supplier prices by district.</div></Link>
        <Link href="/pm/calculator" className="bg-white border rounded-xl p-4 hover:bg-gray-50"><b>Quantity Calculator</b><div className="text-gray-500 mt-1">Materials and cost for walls, slabs and concrete.</div></Link>
      </div>
      <p className="text-sm text-gray-500">Missing a material, supplier or district? <Link href="/pm/contribute" className="underline">Suggest it</Link>.</p>
    </Shell>
  );
}

function ProjectDashboard() {
  const { d, error } = usePM();
  const port = useApi("/api/summary");
  const open = d.tasks.filter((t) => t.status !== "done");
  const overdue = open.filter((t) => t.due && t.due < today());
  const t = port.data?.totals;
  return (
    <Shell title="Dashboard" error={error || port.error}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card label="Active projects" value={d.projects.filter((p) => p.status !== "complete").length} sub={t ? `${t.health.red} at risk, ${t.health.amber} need attention` : ""} />
        <Card label="Open tasks" value={open.length} sub={`${overdue.length} overdue`} tone={overdue.length ? "text-red-600" : undefined} />
        <Card label="Open issues" value={d.issues.filter((i) => i.status !== "closed").length} />
        <Card label="Spent / budget" value={t?.budget ? `${Math.round((t.spent / t.budget) * 100)}%` : "-"} sub={t ? `${money(t.spent)} of ${money(t.budget)}` : ""} tone={t && t.spent > t.budget && t.budget ? "text-red-600" : undefined} />
      </div>
      <Panel title="Projects at a glance">
        {!port.data?.projects.length ? <Empty>No projects yet. <Link href="/pm/projects" className="underline">Add your first project</Link>.</Empty> : (
          <div className="divide-y">
            {port.data.projects.map((p) => (
              <Link key={p.id} href={`/pm/summary?id=${p.id}`} className="block py-3 hover:bg-gray-50 px-1 rounded">
                <div className="flex items-center justify-between gap-3 text-sm mb-2">
                  <b>{p.name}</b><span className="flex items-center gap-3"><span className="text-gray-500">{p.progress === null ? "no tasks" : `${Math.round(p.progress)}% done`}</span><Health level={p.health} /></span>
                </div>
                <Bar pct={p.progress || 0} />
              </Link>
            ))}
          </div>
        )}
      </Panel>
      <div className="grid sm:grid-cols-3 gap-3 text-sm">
        <Link href="/boq" className="bg-black text-white rounded-xl p-4 hover:bg-gray-900"><b className="text-yellow-400">BOQ Extraction</b><div className="text-gray-300 mt-1">Turn a drawing PDF into a bill of quantities.</div></Link>
        <Link href="/pm/calculator" className="bg-white border rounded-xl p-4 hover:bg-gray-50"><b>Quantity Calculator</b><div className="text-gray-500 mt-1">Materials and cost for walls, slabs and concrete.</div></Link>
        <Link href="/pm/sourcing" className="bg-white border rounded-xl p-4 hover:bg-gray-50"><b>Material Rates</b><div className="text-gray-500 mt-1">Compare supplier prices by district.</div></Link>
      </div>
    </Shell>
  );
}
