import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function daysBetween(startISO: string, endISO: string): number {
  const start = new Date(startISO).setHours(0, 0, 0, 0);
  const end = new Date(endISO).setHours(0, 0, 0, 0);
  return Math.round((end - start) / 86_400_000);
}

export function formatDateHe(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateShortHe(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
}

/** Formats seconds as m:ss, used for run times and plank durations. */
export function formatSecondsToClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.round(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/** Deterministic seedable PRNG (mulberry32) so demo data is stable across reloads. */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

export function weightedPick<T>(rng: () => number, entries: [T, number][]): T {
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let r = rng() * total;
  for (const [value, weight] of entries) {
    r -= weight;
    if (r <= 0) return value;
  }
  return entries[entries.length - 1][0];
}
