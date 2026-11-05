/** Formatting helpers. Naira is written with the real sign in the app and with a plain "N" in SMS. */

/** Thousands separators by hand so the server and every browser print the same text. */
const group = (n: number): string => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const naira = (n: number): string => '₦' + group(n);

/** Compact naira: ₦12.55m, ₦850k, ₦1,500. */
export function nairaShort(n: number): string {
  const a = Math.abs(n);
  if (a >= 1_000_000) return '₦' + trim(n / 1_000_000, 2) + 'm';
  if (a >= 100_000) return '₦' + group(n / 1000) + 'k';
  return naira(n);
}

function trim(v: number, d: number): string {
  return Number(v.toFixed(d)).toString();
}

export const num = (n: number): string => group(n);

export function compact(n: number): string {
  const a = Math.abs(n);
  if (a >= 1_000_000) return trim(n / 1_000_000, 1) + 'm';
  if (a >= 10_000) return Math.round(n / 1000) + 'k';
  if (a >= 1000) return trim(n / 1000, 1) + 'k';
  return String(Math.round(n));
}

export const pct = (n: number, d = 0): string => n.toFixed(d) + '%';

/** ISO date (yyyy-mm-dd) read as Lagos noon so it never slips a day. */
export function at(date: string): Date {
  return new Date(date + 'T12:00:00+01:00');
}

// Dates are formatted by hand, not with Intl, so the server and every browser print exactly the same text
// (Node and Chrome disagree on punctuation in short weekday formats, which breaks hydration).
const WD = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MO = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function parts(date: string) {
  const [y, m, d] = date.slice(0, 10).split('-').map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay();
  return { y, m: m - 1, d, dow };
}

export function dayLabel(date: string, withYear = false): string {
  const p = parts(date);
  return `${WD[p.dow].slice(0, 3)} ${p.d} ${MO[p.m].slice(0, 3)}${withYear ? ` ${p.y}` : ''}`;
}

export function longDate(date: string): string {
  const p = parts(date);
  return `${WD[p.dow]} ${p.d} ${MO[p.m]} ${p.y}`;
}

export function shortDate(date: string): string {
  const p = parts(date);
  return `${p.d} ${MO[p.m].slice(0, 3)}`;
}

export function addDays(date: string, n: number): string {
  const [y, m, d] = date.slice(0, 10).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

export function daysBetween(a: string, b: string): number {
  return Math.round((at(b).getTime() - at(a).getTime()) / 86_400_000);
}

export function ago(iso: string, nowIso: string): string {
  const s = Math.max(0, Math.round((new Date(nowIso).getTime() - new Date(iso).getTime()) / 1000));
  if (s < 60) return 'just now';
  if (s < 3600) return Math.round(s / 60) + ' min ago';
  if (s < 86400) return Math.round(s / 3600) + ' h ago';
  return Math.round(s / 86400) + ' d ago';
}

export function clsx(...a: Array<string | false | null | undefined>): string {
  return a.filter(Boolean).join(' ');
}

/** Largest-remainder apportionment: integers that sum exactly to `total`. */
export function apportion(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  const raw = weights.map((w) => (total * w) / sum);
  const out = raw.map(Math.floor);
  let left = Math.round(total) - out.reduce((a, b) => a + b, 0);
  const order = raw.map((r, i) => ({ i, f: r - Math.floor(r) })).sort((a, b) => b.f - a.f);
  for (let k = 0; left > 0 && k < order.length; k++, left--) out[order[k].i]++;
  return out;
}

export function slugify(s: string): string {
  const roman: Record<string, string> = { i: '1', ii: '2', iii: '3', iv: '4', v: '5', vi: '6' };
  return s
    .toLowerCase()
    .split(' ')
    .map((t) => roman[t] ?? t)
    .join('-');
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
