'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setState, useStore } from '@/lib/store';
import { PERSONA_BY_ID } from '@/lib/personas';
import { TOUR } from '@/data/tour';

/** Walks the platform for a presenter: switches role and date, then opens the stop. Started from Preview settings. */
export function startTour(router: ReturnType<typeof useRouter>, step = 0) {
  const t = TOUR[step];
  setState({ tour: { on: true, step }, persona: t.persona, signedIn: true, ...(t.clock ? { clock: t.clock } : {}) });
  router.push(t.href);
}

export function TourBar() {
  const router = useRouter();
  const tour = useStore((s) => s.tour);
  if (!tour.on) return null;
  const step = Math.min(tour.step, TOUR.length - 1);
  const t = TOUR[step];
  const go = (n: number) => startTour(router, Math.max(0, Math.min(TOUR.length - 1, n)));
  return (
    <div className="tourbar" role="dialog" aria-label="Presenter walkthrough">
      <div className="t">
        <b>
          Walkthrough {step + 1} of {TOUR.length} · {t.title}
        </b>
        {t.say}
      </div>
      <button onClick={() => go(step - 1)} disabled={step === 0} aria-label="Previous stop">
        Back
      </button>
      {step < TOUR.length - 1 ? (
        <button className="go" onClick={() => go(step + 1)}>
          Next
        </button>
      ) : (
        <button className="go" onClick={() => setState({ tour: { on: false, step: 0 } })}>
          Finish
        </button>
      )}
      <button className="x" onClick={() => setState({ tour: { on: false, step: 0 } })} aria-label="Close walkthrough">
        ✕
      </button>
    </div>
  );
}

export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
  }, []);
  return null;
}

/** Mirrors the "show data sources" switch onto <html> so the CSS can reveal the source chips. */
export function SrcFlag() {
  const on = useStore((s) => s.showSources);
  useEffect(() => {
    document.documentElement.dataset.src = on ? 'on' : 'off';
  }, [on]);
  return null;
}

export function useSetPersona() {
  const router = useRouter();
  return (id: keyof typeof PERSONA_BY_ID) => {
    setState({ persona: id, signedIn: true });
    router.push(PERSONA_BY_ID[id].home);
  };
}
