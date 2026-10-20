import { useRef, useState } from "react";
import { Btn, Del, Empty, Panel, Select, Table } from "./ui";
import { api, can, downloadFile, getUser, size, uploadFile, useApi, when } from "../../lib/pm";

const CATEGORIES = ["Drawings", "Contracts", "Permits", "Invoices", "Photos", "Reports", "Other"];

/** Upload, list, download and delete the documents of one project. */
export default function FilesPanel({ project }) {
  const files = useApi(project ? `/api/files?project=${project}` : null, [project]);
  const [category, setCategory] = useState("Drawings");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const input = useRef(null);
  const canWrite = can(getUser(), "files:write");
  const run = (fn) => fn().catch((x) => setErr(x.message));

  async function upload(e) {
    e.preventDefault();
    const list = [...(input.current?.files || [])];
    if (!list.length) return setErr("Choose a file first.");
    setBusy(true); setErr("");
    try { for (const f of list) await uploadFile(project, f, category, note); input.current.value = ""; setNote(""); await files.reload(); }
    catch (x) { setErr(x.message); } finally { setBusy(false); }
  }

  return (
    <div className="space-y-4">
      {(err || files.error) && <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">{err || files.error}</div>}
      {canWrite && (
        <Panel title="Upload">
          <form onSubmit={upload} className="grid gap-3 sm:grid-cols-4 items-end">
            <label className="text-sm text-gray-600 sm:col-span-2">File(s)<input ref={input} type="file" multiple className="mt-1 block w-full text-sm" /></label>
            <Select label="Category" value={category} onChange={setCategory} blank={null} options={CATEGORIES.map((c) => ({ v: c, l: c }))} />
            <label className="text-sm text-gray-600">Note<input className="mt-1 w-full border border-gray-300 rounded-md px-2.5 py-1.5" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Rev B" /></label>
            <div className="sm:col-span-4"><Btn disabled={busy}>{busy ? "Uploading..." : "Upload"}</Btn> <span className="text-xs text-gray-500 ml-2">PDF, images, Office files, CSV, DWG/DXF, ZIP. Up to 25 MB each.</span></div>
          </form>
        </Panel>
      )}
      {!files.data?.length ? <Empty>No documents for this project yet.</Empty> : (
        <Table head={["Name", "Category", "Size", "Uploaded", "By", "Note", ""]}>
          {files.data.map((f) => (
            <tr key={f.id} className="border-t">
              <td className="p-2.5"><button onClick={() => run(() => downloadFile(f))} className="text-blue-700 hover:underline text-left">{f.name}</button></td>
              <td className="p-2.5">{f.category || "-"}</td><td className="p-2.5 whitespace-nowrap">{size(f.size)}</td><td className="p-2.5 whitespace-nowrap">{when(f.created)}</td>
              <td className="p-2.5">{f.uploader || "-"}</td><td className="p-2.5">{f.note}</td>
              <td className="p-2.5">{canWrite && <Del onClick={() => run(async () => { await api(`/api/files/${f.id}`, { method: "DELETE" }); await files.reload(); })} />}</td>
            </tr>
          ))}
        </Table>
      )}
    </div>
  );
}
