'use client';

import { useMemo, useState } from 'react';
import { Card, Chip, PageHead } from '@/components/ui';
import { EVENTS, EVENT_KIND, type EventItem } from '@/data/content';
import { LGA_LIST } from '@/data/geo';
import { LGA_LIST } from '@/data/geo';
import { LGA_LIST } from '@/data/geo';
import { LGA_LIST } from '@/data/geo';
import { LGA_LIST } from '@/data/geo';
import { longDate } from '@/lib/format';
import { useClock } from '@/lib/hooks';

const KINDS = ['all', 'live', 'town', 'diaspora', 'debate', 'academy', 'milestone', 'closing'] as const;

function ics(e: EventItem): string {
  const d = e.date.replace(/-/g, '');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  const t = e.time ? e.time.replace(/[^0-9:]/g, '') : '';
  const am = /pm/i.test(e.time ?? '');
  let start = d;
  if (t) {
    const [h, mm] = t.split(':').map(Number);
    const hh = (am && h < 12 ? h + 12 : h).toString().padStart(2, '0');
    start = `${d}T${hh}${(mm || 0).toString().padStart(2, '0')}00`;
  }
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//DLB2027//EN', 'BEGIN:VEVENT', `UID:${e.id}@rivers2027`, `DTSTAMP:${stamp}`, t ? `DTSTART;TZID=Africa/Lagos:${start}` : `DTSTART;VALUE=DATE:${d}`, `SUMMARY:${e.title}`, `LOCATION:${e.where}`, `DESCRIPTION:${e.note}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}

export default function Events() {
  const clock = useClock();
  const [kind, setKind] = useState<(typeof KINDS)[number]>('all');
  const [lga, setLga] = useState<'all' | string>('all');
  const [past, setPast] = useState(false);
  const list = useMemo(
    () =>
      EVENTS.filter((e) => (kind === 'all' || e.kind === kind) && (lga === 'all' || !e.lga || e.lga === lga) && (past || e.date >= clock.date)).sort((a, b) => a.date.localeCompare(b.date)),
    [kind, lga, past, clock.date],
  );
  const download = (e: EventItem) => {
    const blob = new Blob([ics(e)], { type: 'text/calendar' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${e.id}.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  return (
    <>
      <PageHead title="Events" sub="No campaign event schedule has been supplied. This page will list events after dates and venues are confirmed." prov={['plan']} />
      <Card>
        <div className="row gap8 wrap mb12">
          <label className="row gap6 small">Type
            <select value={kind} onChange={(e) => setKind(e.target.value as (typeof KINDS)[number])} style={{ width: 'auto' }}>
              {KINDS.map((k) => <option key={k} value={k}>{k === 'all' ? 'All types' : EVENT_KIND[k]}</option>)}
            </select>
          </label>
          <label className="row gap6 small">Local government
            <select value={lga} onChange={(e) => setLga(e.target.value)} style={{ width: 'auto' }}>
              <option value="all">All LGAs</option>{LGA_LIST.map((item) => <option key={item.key} value={item.key}>{item.name}</option>)}
            </select>
          </label>
          <label className="chk small"><input type="checkbox" checked={past} onChange={(e) => setPast(e.target.checked)} /> Include past</label>
          <span className="sp" />
          <span className="small muted">{list.length} shown</span>
        </div>
        {list.map((e) => (
          <div className="li" key={e.id}>
            <div className="tm" style={{ width: 118 }}>{longDate(e.date)}</div>
            <div className="sp">
              <div className="b small">{e.title} {e.tentative && <Chip tone="amber">Proposed</Chip>}</div>
              <div className="tiny muted">{e.time ? `${e.time} · ` : ''}{e.where}</div>
              <div className="tiny">{e.note}</div>
            </div>
            <Chip tone={e.kind === 'closing' ? 'solidred' : e.kind === 'town' ? 'blue' : e.kind === 'milestone' ? 'gray' : undefined}>{EVENT_KIND[e.kind]}</Chip>
            <button className="btn ghost sm" onClick={() => download(e)} aria-label={`Add ${e.title} to calendar`}>Add to calendar</button>
          </div>
        ))}
        {!list.length && <p className="small muted">Nothing matches these filters.</p>}
      </Card>
    </>
  );
}
