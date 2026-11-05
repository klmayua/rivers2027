/**
 * The demo clock. Everything that changes over the campaign (releases published, sign-ups, gifts,
 * agents approved, results) is a function of one date, so the same app can be shown on launch day,
 * in Week 6, or on Election Day. Real dates (campaign window, election day) never move.
 */
import { addDays, daysBetween } from './format';

export type ClockKey = 'today' | 'launch' | 'w3' | 'w6' | 'w9' | 'w12' | 'close' | 'day';

export type ClockPreset = {
  key: ClockKey;
  label: string;
  short: string;
  date: string;
  note: string;
};

/** Week 1 starts Monday 19 October 2026. */
export const WEEK1_START = '2026-10-19';
export const CAMPAIGN_CLOSE = '2027-01-15';
export const ELECTION_DAY = '2027-03-06';

export const CLOCKS: ClockPreset[] = [
  { key: 'today', label: 'Pre-launch · Sun 18 Oct', short: 'Pre-launch', date: '2026-10-18', note: 'Platform ready, nothing live yet' },
  { key: 'launch', label: 'Launch day · Wed 21 Oct', short: 'Launch', date: '2026-10-21', note: 'Site, apps and giving go live' },
  { key: 'w3', label: 'First ward SMS push · Thu 5 Nov', short: 'Week 3', date: '2026-11-05', note: 'Gate 0 cleared, first full One Push' },
  { key: 'w6', label: 'Week 6 · Thu 26 Nov', short: 'Week 6', date: '2026-11-26', note: 'Mid-campaign, the machine running' },
  { key: 'w9', label: 'Week 9 · Thu 17 Dec', short: 'Week 9', date: '2026-12-17', note: 'Nobody owns this seat' },
  { key: 'w12', label: 'Week 12 · Thu 7 Jan', short: 'Week 12', date: '2027-01-07', note: 'Your vote, your unit' },
  { key: 'close', label: 'Campaign closes · Fri 15 Jan', short: 'Close', date: '2027-01-15', note: 'Last day of campaigning' },
  { key: 'day', label: 'Election Day · Sat 16 Jan', short: 'Election Day', date: '2027-03-06', note: 'Agents report, results come in' },
];

export const DEFAULT_CLOCK: ClockKey = 'w6';

export function clockFor(key: ClockKey): ClockPreset {
  return CLOCKS.find((c) => c.key === key) ?? CLOCKS[3];
}

/** Days since Monday 19 October (negative before launch). */
export function dayIdx(date: string): number {
  return daysBetween(WEEK1_START, date);
}

/** Campaign week, 1 to 13. 0 before the first Monday, 14 for Election Day. */
export function weekOf(date: string): number {
  const d = dayIdx(date);
  if (d < 0) return 0;
  return Math.min(14, Math.floor(d / 7) + 1);
}

export function weekStart(week: number): string {
  return addDays(WEEK1_START, (week - 1) * 7);
}

export function thursdayOf(week: number): string {
  return addDays(weekStart(week), 3);
}

/** Position through the 88-day campaign, 0 to 1. */
export function progress(date: string): number {
  return Math.max(0, Math.min(1, dayIdx(date) / 88));
}

export function daysToElection(date: string): number {
  return daysBetween(date, ELECTION_DAY);
}

export function isElectionDay(date: string): boolean {
  return date >= ELECTION_DAY;
}

/** Thursdays passed up to and including `date`, counting from Week 1's Thursday (22 Oct). */
export function thursdaysPassed(date: string): number {
  const d = dayIdx(date) - 3;
  if (d < 0) return 0;
  return Math.min(13, Math.floor(d / 7) + 1);
}
