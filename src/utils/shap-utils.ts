import { ShapEntry } from "@/types/shap";

export function extractShaps(
  shapList: ShapEntry[] | null,
  selectedId: number | 'global'
): Record<string, number> | null {
  if (!shapList) return null;
  if (selectedId === 'global') {
    const acc: Record<string, number> = {};
    shapList.forEach((entry) => {
      for (const key in entry.shaps) {
        acc[key] = (acc[key] ?? 0) + entry.shaps[key];
      }
    });
    const avg: Record<string, number> = {};
    for (const key in acc) avg[key] = acc[key] / shapList.length;
    return avg;
  }
  const match = shapList.find((d) => d.id === selectedId);
  return match?.shaps ?? null;
}

export function normalizeData(data: Record<string, number> | null): Record<string, number> | null {
  if (!data) return null;
  const max = Math.max(...Object.values(data));
  if (max === 0) return data;
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(data)) out[k] = v / max;
  return out;
}

export function toChart(data: Record<string, number> | null) {
  if (!data) return [];
  return Object.entries(data).map(([label, value]) => ({ label, value }));
}

export function interpolate(
  a: Record<string, number> | null,
  b: Record<string, number> | null,
  t: number
): Record<string, number> | null {
  if (!a || !b) return null;
  const keys = Array.from(new Set([...Object.keys(a), ...Object.keys(b)]));
  const out: Record<string, number> = {};
  keys.forEach((k) => {
    out[k] = (a[k] ?? 0) * (1 - t) + (b[k] ?? 0) * t;
  });
  return out;
}
