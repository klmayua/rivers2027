'use client';

import { useMemo } from 'react';
import { CLOCKS, clockFor, type ClockPreset } from './clock';
import { PERSONA_BY_ID, type Persona } from './personas';
import { metrics, wardMetrics, type Metrics, type WardMetrics } from './model';
import { useStore } from './store';

export function useClock(): ClockPreset {
  const key = useStore((s) => s.clock);
  return clockFor(key) ?? CLOCKS[3];
}

export function usePersona(): Persona {
  const id = useStore((s) => s.persona);
  return PERSONA_BY_ID[id];
}

export function useMetrics(): Metrics {
  const c = useClock();
  const scen = useStore((s) => s.givingScenario);
  return useMemo(() => metrics(c.date, scen), [c.date, scen]);
}

export function useWardMetrics(): WardMetrics[] {
  const c = useClock();
  const scen = useStore((s) => s.givingScenario);
  return useMemo(() => wardMetrics(c.date, scen), [c.date, scen]);
}
