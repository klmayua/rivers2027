'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, Chip, PageHead, Stat } from '@/components/ui';
import { PAPERS, RELEASES, WEEKS } from '@/data/weeks';
import { weekOf } from '@/lib/clock';
import { dayLabel } from '@/lib/format';
import { useClock } from '@/lib/hooks';
import { REL_LABEL, releaseStatus, type RelStatus } from '@/lib/releases';
import { useStore } from '@/lib/store';

const TONE: Record<RelStatus, 'blue' | 'amber' | 'red' | 'gray' | undefined> = { published: undefined, approved: 'blue', held: 'red', awaiting: 'amber', drafting: 'gray' };

export default function Press() {
  const clock = useClock();
  const approvals = useStore((s) => s.approvals);
  const cur = Math.max(1, Math.min(13, weekOf(clock.date)));
  const [wk, setWk] = useState<number | 0>(cur);
  const list = RELEASES.filter((r) => (wk === 0 ? true : r.week === wk));
  const counts = RELEASES.reduce<Record<RelStatus, number>>((a, r) => {
    const s = releaseStatus(r, clock.date, approvals);
    a[s] += 1;
    return a;
  }, { published: 0, approved: 0, held: 0, awaiting: 0, drafting: 0 });

  return (
    <>
      <PageHead
        title="Press releases"
        sub="Sixty-five releases: one a day for thirteen weeks, one national daily a day, all on the week’s issue. Proof of publication is attached the same day."
        actions={<Link href="/ops/approvals" className="btn">Approvals</Link>}
        prov={['plan']}
      />

      <div className="grid g4 keep2">
        <Card><Stat label="Published" value={counts.published} unit="of 65" /></Card>
        <Card><Stat label="Awaiting the candidate" value={counts.awaiting} /></Card>
        <Card><Stat label="Approved, scheduled" value={counts.approved} /></Card>
        <Card><Stat label="Held" value={counts.held} /></Card>
      </div>

      <Card className="mt16" title="Pipeline" right={
        <label className="row gap6 small">Week
          <select aria-label="Week" value={wk} onChange={(e) => setWk(Number(e.target.value))} style={{ width: 'auto' }}>
            <option value={0}>All 13</option>
            {WEEKS.map((w) => <option key={w.n} value={w.n}>{w.n} · {w.issue}</option>)}
          </select>
        </label>
      }>
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>Date</th><th>Paper</th><th>Job</th><th>Headline</th><th>Status</th></tr></thead>
            <tbody>
              {list.map((r) => {
                const st = releaseStatus(r, clock.date, approvals);
                return (
                  <tr key={r.id}>
                    <td className="small" style={{ whiteSpace: 'nowrap' }}>{dayLabel(r.date)}</td>
                    <td className="small b">{r.paper}</td>
                    <td className="small">{r.type}</td>
                    <td>{r.headline}{r.hasDraft && <span className="tiny green b"> · full draft</span>}</td>
                    <td><Chip tone={TONE[st]}>{REL_LABEL[st]}</Chip></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="tiny muted mt8">The five papers’ names are placeholders for the day’s national dailies until the placements are booked. Rates: ₦100,000 per placement.</p>
      </Card>

      <Card className="mt16" title="Jobs by day">
        <div className="grid g5">
          {PAPERS.map((p) => (
            <div key={p.day} className="issue"><small>{p.day}</small><b>{p.type}</b><div className="small mt4">{p.body}</div></div>
          ))}
        </div>
      </Card>
    </>
  );
}
