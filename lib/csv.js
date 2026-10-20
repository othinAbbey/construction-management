const esc = (v) => { const s = v === null || v === undefined ? "" : String(v); return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };

/** Rows + column definitions -> CSV text. A column may give `csv(row)` to control what is exported. */
export function toCsv(rows, columns) {
  const cols = columns.filter((c) => c.label);
  return [cols.map((c) => esc(c.label)).join(","), ...rows.map((r) => cols.map((c) => esc(c.csv ? c.csv(r) : c.value ? c.value(r) : r[c.key])).join(","))].join("\r\n");
}

export function downloadText(name, text, type = "text/csv;charset=utf-8") {
  const url = URL.createObjectURL(new Blob(["\ufeff", text], { type }));
  const a = document.createElement("a"); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
