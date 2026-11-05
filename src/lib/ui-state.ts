'use client';

/** Small non-persisted UI state: the Give popup. */
import { useSyncExternalStore } from 'react';

export type GiveCtx = { open: boolean; group: string | null; ward: string | null; channel: string };

const CLOSED: GiveCtx = { open: false, group: null, ward: null, channel: 'app' };
let cur: GiveCtx = CLOSED;
const ls = new Set<() => void>();

export function openGive(ctx: Partial<Omit<GiveCtx, 'open'>> = {}): void {
  cur = { ...CLOSED, ...ctx, open: true };
  ls.forEach((l) => l());
}

export function closeGive(): void {
  cur = { ...cur, open: false };
  ls.forEach((l) => l());
}

export function useGiveUi(): GiveCtx {
  return useSyncExternalStore(
    (cb) => {
      ls.add(cb);
      return () => {
        ls.delete(cb);
      };
    },
    () => cur,
    () => CLOSED,
  );
}
