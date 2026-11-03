import { useEffect, useState } from "react";
import FilesPanel from "../../components/pm/FilesPanel";
import { Empty, Select, Shell } from "../../components/pm/ui";
import { useApi } from "../../lib/pm";

export default function Files() {
  const projects = useApi("/api/projects");
  const [pid, setPid] = useState("");
  useEffect(() => { if (!pid && projects.data?.length) setPid(projects.data[0].id); }, [projects.data, pid]);
  return (
    <Shell title="Documents" error={projects.error}>
      {!projects.data?.length ? <Empty>Add a project first, then upload its drawings, contracts and photos here.</Empty> : (
        <>
          <div className="max-w-sm"><Select label="Project" value={pid} onChange={setPid} blank={null} options={projects.data.map((p) => ({ v: p.id, l: p.name }))} /></div>
          <FilesPanel project={pid} />
        </>
      )}
    </Shell>
  );
}
