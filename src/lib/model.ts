/**
 * The demo model. Every running count is a pure function of the demo-clock date, so it is the same on
 * every load and device. These are SAMPLE figures that follow the plan's trajectory; they are not
 * forecasts. Operational targets and sample activity trajectories are illustrative, not campaign-approved.
 */
import { apportion } from './format';
import { dayIdx, thursdaysPassed, WEEK1_START } from './clock';
import { rngFor } from './rng';
import { SCENARIOS, type ScenarioKey } from '@/data/campaign';
import { EVENTS, SMS_PRICING } from '@/data/content';
import { PUS, TOTAL_PUS, WARDS, type PU, type Ward } from '@/data/geo';
import type { GivingScenario } from './store';

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const smooth = (x: number) => {
  const t = clamp(x);
  return t * t * (3 - 2 * t);
};

export const RELEASES_TOTAL = 65;
export const COORDINATORS_TARGET = 319;
export const PU_TARGET = 6866;
export const WEEKLY_GOAL = 0;
export const SMS_LIST = 0; // no verified opt-in list supplied
export const GATE0_CLEARS = '';

const GIVE_WEEK = [170, 230, 310, 350, 400, 435, 455, 485, 517, 555, 594, 632, 665].map((x) => x * 1000);
const GIVE_SCALE: Record<GivingScenario, number> = { cautious: 0.5, base: 1, strong: 1.45 };
const TREND_REACH = [21, 26, 34, 41, 52, 61, 70, 82, 95, 110, 121, 133, 148].map((x) => x * 1000);
const TREND_PEAK = [41, 33, 27, 21, 17, 14, 11, 9, 7, 6, 5, 4, 3];

export type Giving = {
  amount: number;
  count: number;
  donors: number;
  founding: number;
  avg: number;
  thisWeek: number;
  weekly: number[]; // amount per week, to date
};

export function giving(date: string, scen: GivingScenario = 'base'): Giving {
  const e = dayIdx(date) - 2; // giving opens on launch day, Wed 21 Oct
  const empty: Giving = { amount: 0, count: 0, donors: 0, founding: 0, avg: 0, thisWeek: 0, weekly: [] };
  if (e < 0) return empty;
  const s = GIVE_SCALE[scen];
  const w = Math.min(12, Math.floor(e / 7));
  const frac = e >= 86 ? 1 : ((e % 7) + 1) / 7;
  const weekly: number[] = [];
  for (let i = 0; i < w; i++) weekly.push(Math.round(GIVE_WEEK[i] * s));
  weekly.push(Math.round(GIVE_WEEK[w] * s * frac));
  const foundN = Math.round(Math.min(25, Math.floor((e / 14) * 25)) * Math.min(1, s));
  const found = foundN * 100_000;
  const weeklyTotal = weekly.reduce((a, b) => a + b, 0);
  const amount = found + weeklyTotal;
  const count = foundN + Math.round(weeklyTotal / 6800);
  return {
    amount,
    count,
    donors: Math.round(count * 0.78),
    founding: foundN,
    avg: count ? amount / count : 0,
    thisWeek: weekly[weekly.length - 1] ?? 0,
    weekly,
  };
}

export type Metrics = {
  d: number;
  releases: number;
  pushes: number;
  trendReach: number;
  trendPeak: number;
  trendHistory: number[];
  gate0: boolean;
  smsList: number;
  smsDelivered: number;
  smsClicks: number;
  smsSignups: number;
  smsOptOutPct: number;
  signups: number;
  optIn: number;
  coordinators: number;
  agents: number;
  coverage: number;
  reports: number;
  academy: number;
  academyDone: number;
  deskOpened: number;
  deskOnTime: number;
  liveSessions: number;
  liveViewers: number;
  liveQuestions: number;
  townHalls: number;
  diasporaCouncil: number;
  champions: number;
  giving: Giving;
  weeklyGoalPct: number;
};

function agentsAt(d: number): number {
  if (d < 17) return 0;
  if (d <= 46) return Math.round(396 * smooth((d - 17) / 29));
  return Math.min(424, Math.round(396 + ((d - 46) * (424 - 396)) / 42));
}

export function metrics(date: string, scen: GivingScenario = 'base'): Metrics {
  const d = dayIdx(date);
  const pub = Math.max(0, d - 2);
  const weekdays = d < 0 ? 0 : Math.min(RELEASES_TOTAL, Math.floor(d / 7) * 5 + Math.min((d % 7) + 1, 5));
  const th = thursdaysPassed(date);
  const pushes = Math.max(0, Math.min(11, th - 2));
  const gate0 = date >= GATE0_CLEARS;
  const x = clamp(pub / 86);
  const signups = Math.round(7640 * (0.45 * x + 0.55 * smooth(x)));
  const g = giving(date, scen);
  const agents = agentsAt(d);
  let reports = 0;
  for (let i = 0; i <= Math.min(d, 89); i++) reports += agentsAt(i) * 0.31;
  const acadX = clamp((d - 2) / 86);
  const academy = d < 2 ? 0 : Math.round(2140 * (1 - Math.pow(1 - acadX, 1.8)));
  const acadPrev = d < 23 ? 0 : Math.round(2140 * (1 - Math.pow(1 - clamp((d - 21 - 2) / 86), 1.8)));
  const live = d < 6 ? 0 : Math.min(12, Math.floor((d - 6) / 7) + 1);
  let q = 0;
  for (let i = 0; i < live; i++) q += 55 + 9 * i;
  const desk = Math.floor(3.8 * pub);
  const smsDelivered = Math.round(pushes * SMS_LIST * 0.964 + (d >= 10 && gate0 ? 482 : 0));
  return {
    d,
    releases: weekdays,
    pushes,
    trendReach: th ? TREND_REACH[th - 1] : 0,
    trendPeak: th ? TREND_PEAK[th - 1] : 0,
    trendHistory: TREND_REACH.slice(0, th),
    gate0,
    smsList: gate0 ? SMS_LIST : 0,
    smsDelivered,
    smsClicks: Math.round(smsDelivered * 0.078),
    smsSignups: Math.round(smsDelivered * 0.012),
    smsOptOutPct: pushes ? 0.6 : 0,
    signups,
    optIn: Math.round(signups * 0.82),
    coordinators: d < 7 ? 0 : Math.min(COORDINATORS_TARGET, Math.round(((d - 6) * COORDINATORS_TARGET) / 12)),
    agents,
    coverage: agents / TOTAL_PUS,
    reports: Math.round(reports),
    academy,
    academyDone: Math.round(acadPrev * 0.38),
    deskOpened: desk,
    deskOnTime: desk > 20 ? Math.round(desk * 0.94) : desk,
    liveSessions: live,
    liveViewers: live ? 1150 + 95 * live : 0,
    liveQuestions: q,
    townHalls: EVENTS.filter((e) => e.kind === 'town' && e.date <= date).length,
    diasporaCouncil: d < 14 ? 0 : Math.min(12, Math.round((d - 13) / 3)),
    champions: d < 3 ? 0 : Math.min(168, Math.round(168 * smooth((d - 3) / 55))),
    giving: g,
    weeklyGoalPct: g.thisWeek ? Math.min(160, Math.round((g.thisWeek / WEEKLY_GOAL) * 100)) : 0,
  };
}

// ------------------------------------------------------------------------------------------ WARD LEVEL
export type WardMetrics = {
  ward: Ward;
  signups: number;
  smsList: number;
  captains: number;
  coveragePct: number;
  coordinatorNamed: boolean;
  reports: number;
  desk: number;
  academy: number;
  gifts: number;
  optOut: number;
  readiness: number; // 0..100
  flag: string | null;
};

const wardFactor: Record<string, number> = Object.fromEntries(WARDS.map((w) => [w.slug, 0.72 + 0.56 * rngFor('wf:' + w.slug)()]));

export function wardMetrics(date: string, scen: GivingScenario = 'base'): WardMetrics[] {
  const m = metrics(date, scen);
  const dI = m.d;
  const wt = WARDS.map((w) => w.pus * wardFactor[w.slug]);
  const signups = apportion(m.signups, wt);
  const sms = apportion(m.smsList, WARDS.map((w) => w.pus));
  const cap = apportion(m.agents, WARDS.map((w) => w.pus * (0.85 + 0.3 * rngFor('cap:' + w.slug)())));
  const reports = apportion(m.reports, cap.map((c) => c + 1));
  const desk = apportion(m.deskOpened, wt);
  const acad = apportion(m.academy, wt);
  const gifts = apportion(m.giving.count, wt);
  return WARDS.map((w, i) => {
    const captains = Math.min(w.pus, cap[i]);
    const coveragePct = (captains / w.pus) * 100;
    const named = dI >= 7 + Math.round(rngFor('nm:' + w.slug)() * 11);
    const optOut = 0.35 + 0.55 * rngFor('oo:' + w.slug)();
    const sPer = signups[i] / Math.max(1, w.pus / 10);
    const readiness = Math.round(clamp(0.45 * (coveragePct / 100) + 0.25 * (named ? 1 : 0) + 0.3 * clamp(sPer / 40)) * 100);
    let flag: string | null = null;
    if (dI >= 20 && !named) flag = 'No coordinator named';
    else if (dI >= 46 && coveragePct < 80) flag = 'Captain gaps';
    else if (optOut > 0.8 && m.pushes > 1) flag = 'Opt-outs rising';
    return {
      ward: w,
      signups: signups[i],
      smsList: sms[i],
      captains,
      coveragePct,
      coordinatorNamed: named,
      reports: reports[i],
      desk: desk[i],
      academy: acad[i],
      gifts: gifts[i],
      optOut,
      readiness,
      flag,
    };
  });
}

export function lgaTotals(rows: WardMetrics[], lga: string) {
  const r = rows.filter((x) => x.ward.lga === lga);
  const pus = r.reduce((a, x) => a + x.ward.pus, 0);
  const cap = r.reduce((a, x) => a + x.captains, 0);
  return {
    rows: r,
    pus,
    captains: cap,
    coverage: pus ? cap / pus : 0,
    registered: r.reduce((a, x) => a + x.ward.registered, 0),
    signups: r.reduce((a, x) => a + x.signups, 0),
    named: r.filter((x) => x.coordinatorNamed).length,
    readiness: Math.round(r.reduce((a, x) => a + x.readiness, 0) / Math.max(1, r.length)),
  };
}

// ------------------------------------------------------------------------------------------ PU LEVEL
export type PuState = {
  pu: PU;
  hasCaptain: boolean;
  lastReport: 'none' | 'ok' | 'stale';
  reports: number;
  status: 'captain' | 'gap';
};

export function puStates(date: string, ward: Ward, scen: GivingScenario = 'base'): PuState[] {
  const rows = wardMetrics(date, scen);
  const wm = rows.find((r) => r.ward.id === ward.id);
  const cap = wm ? wm.captains : 0;
  const list = PUS.filter((p) => p.ward.id === ward.id).slice().sort((a, b) => a.order - b.order);
  const withCap = new Set(list.slice(0, cap).map((p) => p.id));
  return PUS.filter((p) => p.ward.id === ward.id).map((p) => {
    const has = withCap.has(p.id);
    const r = rngFor('rep:' + p.id)();
    const reports = has ? Math.round((wm?.reports ?? 0) / Math.max(1, cap) * (0.6 + r * 0.8)) : 0;
    return { pu: p, hasCaptain: has, lastReport: !has ? 'none' : r > 0.86 ? 'stale' : 'ok', reports, status: has ? 'captain' : 'gap' };
  });
}

// ------------------------------------------------------------------------------------------ LEDGER (SAMPLE ground costs)
export type LedgerLine = { date: string; label: string; amount: number; kind: 'farawa' | 'ground' | 'fees' | 'opening'; prov: 'plan' | 'sample'; note?: string };

export function ledger(date: string, opts: { launch: number; contribution: number; opening: number; scen: GivingScenario }): { lines: LedgerLine[]; total: number } {
  const d = dayIdx(date);
  const m = metrics(date, opts.scen);
  const lines: LedgerLine[] = [];
  lines.push({ date: '2026-10-18', label: 'Spend since 13 February 2026 (opening balance)', amount: opts.opening, kind: 'opening', prov: 'sample', note: 'Finance officer to enter the actual figure' });
  if (d >= 0) {
    lines.push({ date: '2026-10-19', label: 'Farawa: platform launch (list price less any contribution)', amount: Math.max(0, opts.launch - opts.contribution), kind: 'farawa', prov: 'plan' });
    if (opts.contribution > 0) lines.push({ date: '2026-10-19', label: 'Farawa: gift in kind recorded at full value', amount: opts.contribution, kind: 'farawa', prov: 'plan', note: 'Counsel to confirm treatment and disclosure' });
  }
  const weeksInvoiced = d < 0 ? 0 : Math.min(13, Math.floor((d + 3) / 7) + 1); // each Friday invoices the next week; Week 1 on Monday 19 Oct
  for (let w = 1; w <= weeksInvoiced; w++) {
    const inv = w === 1 ? '2026-10-19' : addIso(WEEK1_START, (w - 1) * 7 - 3);
    lines.push({ date: inv, label: `Farawa: Week ${w} programme (five releases, Thursday trend)`, amount: 850_000, kind: 'farawa', prov: 'plan' });
  }
  const halls = EVENTS.filter((e) => e.kind === 'town' && e.date <= date);
  halls.forEach((e) => lines.push({ date: e.date, label: `${e.title}: venue and sound`, amount: 380_000, kind: 'ground', prov: 'sample' }));
  for (let k = 0; k < Math.floor(Math.max(0, d - 12) / 14) + (d >= 12 ? 1 : 0); k++) {
    lines.push({ date: addIso(WEEK1_START, 12 + k * 14), label: 'Printing: posters, banners, flyers (fortnightly batch)', amount: 450_000, kind: 'ground', prov: 'sample' });
  }
  for (let k = 0; k < Math.min(11, m.pushes); k++) {
    const per = Math.round(SMS_LIST * 1 * SMS_PRICING.perPage * (1 + SMS_PRICING.vat));
    lines.push({ date: addIso(WEEK1_START, 17 + 7 * k), label: `SMS airtime: ward One Push ${k + 1}`, amount: per, kind: 'ground', prov: 'sample' });
  }
  for (let wk = 6; wk <= Math.min(13, Math.floor(d / 7) + 1); wk++) {
    lines.push({ date: addIso(WEEK1_START, (wk - 1) * 7 + 2), label: `Radio airtime, Week ${wk}`, amount: 400_000, kind: 'ground', prov: 'sample' });
  }
  if (d >= 89) lines.push({ date: '2027-03-06', label: 'Election Day logistics: transport and refreshments for about 440 units', amount: 2_640_000, kind: 'ground', prov: 'sample', note: 'Counsel to confirm what may be provided to agents' });
  const fees = Math.round(m.giving.amount * 0.016 + m.giving.count * 100 * 0.5);
  if (fees > 0) lines.push({ date, label: 'Paystack fees on gifts (indicative: 1.5% + ₦100 above ₦2,500)', amount: fees, kind: 'fees', prov: 'sample', note: 'Paystack to confirm in writing (open item 21)' });
  lines.sort((a, b) => a.date.localeCompare(b.date));
  const total = lines.reduce((a, l) => a + l.amount, 0);
  return { lines, total };
}

function addIso(base: string, n: number): string {
  const d = new Date(base + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// ------------------------------------------------------------------------------------------ ELECTION DAY REHEARSAL (SAMPLE)
export type PuResult = {
  pu: PU;
  registered: number;
  accredited: number;
  apc: number;
  pdp: number;
  ndc: number;
  other: number;
  rejected: number;
  rank: number; // reporting order, 0..N-1
};

const resultCache: Partial<Record<ScenarioKey, PuResult[]>> = {};

export function electionResults(key: ScenarioKey): PuResult[] {
  const hit = resultCache[key];
  if (hit) return hit;
  const sc = SCENARIOS[key];
  const parties = ['apc', 'pdp', 'ndc', 'other'] as const;
  // 1. ward totals by party
  const wardTotals: Record<string, number[]> = {};
  const wardWeights = parties.map((p) =>
    WARDS.map((w) => w.pus * w.weight * (0.62 + 0.76 * rngFor(`lean:${key}:${p}:${w.slug}`)())),
  );
  parties.forEach((p, pi) => {
    const a = apportion(sc[p], wardWeights[pi]);
    WARDS.forEach((w, wi) => {
      (wardTotals[w.id] ??= [0, 0, 0, 0])[pi] = a[wi];
    });
  });
  // 2. to polling units
  const out: PuResult[] = [];
  for (const w of WARDS) {
    const pus = PUS.filter((p) => p.ward.id === w.id);
    const split = parties.map((p, pi) => apportion(wardTotals[w.id][pi], pus.map((u) => u.registered * (0.7 + 0.6 * rngFor(`pl:${key}:${p}:${u.id}`)()))));
    pus.forEach((u, i) => {
      const v = { apc: split[0][i], pdp: split[1][i], ndc: split[2][i], other: split[3][i] };
      const valid = v.apc + v.pdp + v.ndc + v.other;
      const rejected = Math.round(valid * (0.012 + 0.012 * rngFor('rej:' + u.id)()));
      const accredited = valid + rejected;
      out.push({ pu: u, registered: Math.max(u.registered, accredited + 20), accredited, ...v, rejected, rank: 0 });
    });
  }
  out.sort((a, b) => a.pu.order - b.pu.order);
  out.forEach((r, i) => (r.rank = i));
  resultCache[key] = out;
  return out;
}

export function tally(results: PuResult[], n: number) {
  const slice = results.slice(0, n);
  const t = { apc: 0, pdp: 0, ndc: 0, other: 0, rejected: 0, accredited: 0, registered: 0, n: slice.length };
  for (const r of slice) {
    t.apc += r.apc;
    t.pdp += r.pdp;
    t.ndc += r.ndc;
    t.other += r.other;
    t.rejected += r.rejected;
    t.accredited += r.accredited;
    t.registered += r.registered;
  }
  return t;
}

/** The queried-return pattern (E7): in the Contested rehearsal one ward's official collation reads lower than the agents' sheets. */
export const DISCREPANCY = { scenario: 'contested' as ScenarioKey, ward: 'abua-i-01', pdpShort: 120 };

/** The plan's arithmetic: how many more NDC votes than a scenario, to reach the Upset total, and what that is per polling unit. */
export function pathToSeat(scenario: ScenarioKey, pus = PU_TARGET) {
  const sc = SCENARIOS[scenario];
  const target = SCENARIOS.upset.pdp;
  const gap = Math.max(0, target - sc.pdp);
  const rival = Math.max(sc.apc, sc.ndc, sc.other);
  return { target, gap, perPu: Math.ceil(gap / pus), margin: sc.pdp - rival, leads: sc.pdp > rival };
}
