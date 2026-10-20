import { useState } from "react";
import { toCsv, downloadText } from "../../lib/csv";

/**
 * A list with search, click-to-sort headers and CSV export.
 * columns: [{ key, label, render?(row), value?(row) for sort/search/export, align? }]
 * searchKeys: field names (or functions) the search box looks in.
 */
export default function DataTable({ rows, columns, searchKeys = [], onEdit, onDelete, empty = "Nothing here yet.", exportName = "export" }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState({ key: null, dir: 1 });
  const val = (r, c) => (c.value ? c.value(r) : r[c.key]);

  let shown = rows;
  const needle = q.trim().toLowerCase();
  if (needle) shown = shown.filter((r) => searchKeys.some((k) => String(typeof k === "function" ? k(r) : r[k] ?? "").toLowerCase().includes(needle)));
  const sortCol = columns.find((c) => c.key === sort.key);
  if (sortCol) {
    shown = [...shown].sort((a, b) => {
      const x = val(a, sortCol), y = val(b, sortCol);
      if (x === y) return 0;
      if (x === null || x === undefined || x === "") return 1;
      if (y === null || y === undefined || y === "") return -1;
      return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))) * sort.dir;
    });
  }
  const click = (key) => setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: 1 }));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3 print:hidden">
        {searchKeys.length > 0 && <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-60" />}
        <span className="text-xs text-gray-500">{shown.length} of {rows.length}</span>
        <button disabled={!shown.length} onClick={() => downloadText(`${exportName}.csv`, toCsv(shown, columns))} className="ml-auto text-xs text-blue-700 hover:underline disabled:text-gray-400">Export CSV</button>
      </div>
      {!shown.length ? <div className="text-sm text-gray-500 bg-white border border-dashed rounded-xl p-6 text-center">{rows.length ? "No matches." : empty}</div> : (
        <div className="bg-white border rounded-xl overflow-x-auto shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600"><tr>
              {columns.map((c) => (
                <th key={c.key || c.label} className={`p-2.5 font-medium whitespace-nowrap ${c.align === "right" ? "text-right" : ""}`}>
                  <button onClick={() => click(c.key)} className="hover:text-black">{c.label}{sort.key === c.key ? (sort.dir > 0 ? " ▲" : " ▼") : ""}</button>
                </th>
              ))}
              {(onEdit || onDelete) && <th />}
            </tr></thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id} className="border-t align-top hover:bg-gray-50">
                  {columns.map((c) => <td key={c.key || c.label} className={`p-2.5 ${c.align === "right" ? "text-right tabular-nums" : ""}`}>{c.render ? c.render(r) : val(r, c) ?? ""}</td>)}
                  {(onEdit || onDelete) && (
                    <td className="p-2.5 whitespace-nowrap space-x-3 print:hidden">
                      {onEdit && <button className="text-xs text-blue-700 hover:underline" onClick={() => onEdit(r)}>Edit</button>}
                      {onDelete && <button className="text-xs text-red-600 hover:underline" onClick={() => confirm("Delete this item? This cannot be undone.") && onDelete(r)}>Delete</button>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
