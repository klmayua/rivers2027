'use client';

/**
 * Client-side store. There is no backend: everything a visitor does in the demo (a gift, a Help Desk
 * question, a ground report, an approval) is kept in the browser's local storage and shows up on the
 * desks that would receive it. A server snapshot is the default state, so pages hydrate cleanly.
 */
import { useSyncExternalStore } from 'react';
import type { ClockKey } from './clock';
import { DEFAULT_CLOCK } from './clock';
import type { ScenarioKey } from '@/data/campaign';
import type { PersonaId } from './personas';

export type Gift = {
  id: string;
  ref: string;
  amount: number;
  tier: string;
  group: string | null;
  ward: string | null;
  channel: string;
  abroad: boolean;
  initials: string;
  at: string;
  code: string;
};
export type Ticket = { id: string; ref: string; name: string; ward: string; topic: string; message: string; at: string; status: 'open' | 'answered' };
export type Signup = { id: string; initials: string; ward: string; lang: string; sms: boolean; whatsapp: boolean; via: string; role: 'supporter' | 'champion' | 'agent'; at: string };
export type AcademyReg = { id: string; initials: string; ward: string; course: string; at: string };
export type GroundReport = { id: string; pu: string; ward: string; note: string; at: string; by: string; photo: boolean; queued: boolean };
export type ChatMsg = { id: string; ward: string; who: string; text: string; at: string };
export type SmsSend = { id: string; at: string; clock: string; kind: 'test' | 'push'; audience: string; wards: string[]; text: string; recipients: number; cost: number; delivered: number; clicks: number; signups: number; optOuts: number };
export type ResultSheet = { id: string; pu: string; ward: string; registered: number; accredited: number; apc: number; pdp: number; ndc: number; other: number; rejected: number; at: string; photo: boolean; by: string };

export type GivingScenario = 'cautious' | 'base' | 'strong';

export type State = {
  v: 1;
  persona: PersonaId;
  clock: ClockKey;
  givingScenario: GivingScenario;
  electionScenario: ScenarioKey;
  showVendorPricing: boolean;
  launchAgreed: number;
  contribution: number;
  openingSpend: number;
  gifts: Gift[];
  tickets: Ticket[];
  signups: Signup[];
  academy: AcademyReg[];
  reports: GroundReport[];
  chat: ChatMsg[];
  sms: SmsSend[];
  sheets: ResultSheet[];
  approvals: Record<string, 'approved' | 'held'>;
  agentApprovals: Record<string, 'approved' | 'rejected'>;
  ver: Record<string, 'open' | 'working' | 'closed'>;
  quotesApproved: Record<string, boolean>;
  tour: { on: boolean; step: number };
  offline: boolean;
  /** Signed in to the platform (front-end session; no server). */
  signedIn: boolean;
  /** Show the data-source chips (INEC, Plan, Sample...) across the platform. */
  showSources: boolean;
};

export const DEFAULT_STATE: State = {
  v: 1,
  persona: 'public',
  clock: DEFAULT_CLOCK,
  givingScenario: 'base',
  electionScenario: 'contested',
  showVendorPricing: true,
  launchAgreed: 1_500_000,
  contribution: 0,
  openingSpend: 14_000_000,
  gifts: [],
  tickets: [],
  signups: [],
  academy: [],
  reports: [],
  chat: [],
  sms: [],
  sheets: [],
  approvals: {},
  agentApprovals: {},
  ver: {},
  quotesApproved: {},
  tour: { on: false, step: 0 },
  offline: false,
  signedIn: false,
  showSources: false,
};

const KEY = 'rivers2027.state.v1';
let cache: State = DEFAULT_STATE;
let raw: string | null = null;
const listeners = new Set<() => void>();

function read(): State {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const r = window.localStorage.getItem(KEY);
    if (r === raw) return cache;
    raw = r;
    cache = r ? { ...DEFAULT_STATE, ...(JSON.parse(r) as Partial<State>) } : DEFAULT_STATE;
  } catch {
    /* storage unavailable: keep the in-memory copy */
  }
  return cache;
}

function emit() {
  listeners.forEach((l) => l());
}

export function setState(patch: Partial<State> | ((s: State) => Partial<State>)): void {
  const cur = read();
  const next: State = { ...cur, ...(typeof patch === 'function' ? patch(cur) : patch) };
  cache = next;
  try {
    const s = JSON.stringify(next);
    window.localStorage.setItem(KEY, s);
    raw = s;
  } catch {
    /* ignore: the in-memory copy still updates the screen */
  }
  emit();
}

/** Clears what was done in this browser (gifts, questions, reports, approvals) but keeps the session and view settings. */
export function resetDemo(keepClock = true): void {
  const cur = read();
  setState({
    ...DEFAULT_STATE,
    clock: keepClock ? cur.clock : DEFAULT_CLOCK,
    persona: cur.persona,
    signedIn: cur.signedIn,
    showSources: cur.showSources,
  });
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', onStorage);
  };
}

/** Selectors must return a stable reference (a field of the state), not a freshly built object. */
export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => sel(read()),
    () => sel(DEFAULT_STATE),
  );
}

export function getState(): State {
  return read();
}

let seq = 0;
export function uid(prefix: string): string {
  seq += 1;
  return `${prefix}-${Date.now().toString(36)}${seq.toString(36)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}
