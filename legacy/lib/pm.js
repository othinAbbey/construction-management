import { useCallback, useEffect, useState } from "react";

const KEY = "cm_pm_v1";
export const uid = () => Math.random().toString(36).slice(2, 10);
export const today = () => new Date().toISOString().slice(0, 10);
export const money = (n) => Number(n || 0).toLocaleString("en-UG", { maximumFractionDigits: 0 });

const EMPTY = { projects: [], tasks: [], costs: [], logs: [], issues: [] };

/** All project data, saved in this browser (localStorage). Swap for an API later. */
export function usePM() {
  const [d, setD] = useState(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if (s) setD({ ...EMPTY, ...JSON.parse(s) }); } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {}
  }, [d, ready]);

  const add = useCallback((k, item) => setD((p) => ({ ...p, [k]: [...p[k], { id: uid(), created: today(), ...item }] })), []);
  const upd = useCallback((k, id, patch) => setD((p) => ({ ...p, [k]: p[k].map((x) => (x.id === id ? { ...x, ...patch } : x)) })), []);
  const del = useCallback((k, id) => setD((p) => ({ ...p, [k]: p[k].filter((x) => x.id !== id) })), []);
  const nameOf = (id) => d.projects.find((p) => p.id === id)?.name || "-";
  return { d, add, upd, del, nameOf, ready };
}
