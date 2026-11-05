'use client';

import { useState } from 'react';
import { EVENTS, EVENT_KIND, type EventItem } from '@/data/content';
import { useClock } from '@/lib/hooks';
import { dayLabel } from '@/lib/format';

const FILTERS: Array<{ k: 'all' | EventItem['kind']; l: string }> = [
  { k: 'all', l: 'All' },
  { k: 'live', l: 'Live' },
  { k: 'town', l: 'Town halls' },
  { k: 'diaspora', l: 'Diaspora' },
];

export function EventList() {
  const clock = useClock();
  const [f, setF] = useState<'all' | EventItem['kind']>('all');
  const [reminded, setReminded] = useState<Record<string, boolean>>({});
  const upcoming = EVENTS.filter((e) => e.date >= clock.date && e.kind !== 'milestone' && (f === 'all' || e.kind === f)).slice(0, 18);
  return (
    <div className="col gap14">
      <div className="seg" role="group" aria-label="Filter" style={{ alignSelf: 'flex-start' }}>
        {FILTERS.map((x) => (
          <button key={x.k} aria-pressed={f === x.k} onClick={() => setF(x.k)}>{x.l}</button>
        ))}
      </div>
      {upcoming.length === 0 && <div className="note">No events left on this filter after {dayLabel(clock.date)}.</div>}
      <div className="s-grid2">
        {upcoming.map((e) => (
          <article className="pcard" key={e.id} style={{ margin: 0 }}>
            <div className="row gap6"><span className="chip blue">{EVENT_KIND[e.kind]}</span>{e.tentative && <span className="chip gray">Proposed</span>}</div>
            <div className="tt mt8">{e.title}</div>
            <div className="mm">{dayLabel(e.date, true)}{e.time ? ` · ${e.time}` : ''}</div>
            <div className="mm">{e.where}</div>
            <p className="small mt8">{e.note}</p>
            <button className="btn sec sm mt8" onClick={() => setReminded((r) => ({ ...r, [e.id]: !r[e.id] }))}>{reminded[e.id] ? '✓ Reminder set' : 'Remind me'}</button>
          </article>
        ))}
      </div>
    </div>
  );
}
