'use client';

import { useState } from 'react';
import { Card, Chip, PageHead } from '@/components/ui';
import { QUOTES } from '@/data/campaign';
import { DRAFTS, RELEASES, type Release } from '@/data/weeks';
import { dayLabel } from '@/lib/format';
import { useClock } from '@/lib/hooks';
import { REL_LABEL, releaseStatus, type RelStatus } from '@/lib/releases';
import { setState, useStore } from '@/lib/store';

const TONE: Record<RelStatus, 'blue' | 'amber' | 'red' | 'gray' | undefined> = {
  published: undefined,
  approved: 'blue',
  held: 'red',
  awaiting: 'amber',
  drafting: 'gray',
};

export default function Approvals() {
  const clock = useClock();
  const approvals = useStore((s) => s.approvals);
  const quotes = useStore((s) => s.quotesApproved);
  const [open, setOpen] = useState<string | null>('W1-1');
  const upcoming = RELEASES.filter((r) => releaseStatus(r, clock.date, approvals) !== 'published' && releaseStatus(r, clock.date, approvals) !== 'drafting').slice(0, 10);
  const pendingQuotes = QUOTES.filter((q) => !q.approved);
  const set = (r: Release, v: 'approved' | 'held' | null) =>
    setState((s) => {
      const next = { ...s.approvals };
      if (v) next[r.id] = v;
      else delete next[r.id];
      return { approvals: next };
    });

  return (
    <>
      <PageHead title="Approvals" sub="Nothing is published in Chief Barr. Dumo’s name without his approval, given in writing or by message. Approve, hold, or send back with a note." />
      <Card title="Releases" right={<span className="small muted">Week 1 drafts are written in full; later weeks are headlines until the week is approved.</span>}>
        {upcoming.length === 0 && <p className="small muted">Nothing awaiting approval on this date. Move the preview date earlier to see Week 1 waiting.</p>}
        {upcoming.map((r) => {
          const st = releaseStatus(r, clock.date, approvals);
          const d = DRAFTS[r.id];
          const isOpen = open === r.id;
          return (
            <div key={r.id} style={{ borderBottom: '1px solid var(--line)', padding: '12px 0' }}>
              <div className="row top">
                <div className="tm small b green" style={{ width: 82 }}>{dayLabel(r.date)}</div>
                <div className="sp">
                  <div className="b">{r.headline}</div>
                  <div className="small muted">{r.paper} · {r.type}</div>
                  {d && <button className="btn ghost sm mt8" onClick={() => setOpen(isOpen ? null : r.id)} aria-expanded={isOpen}>{isOpen ? 'Hide draft' : 'Read the draft'}</button>}
                </div>
                <Chip tone={TONE[st]}>{REL_LABEL[st]}</Chip>
                <div className="row gap6">
                  {st !== 'approved' && <button className="btn sm" onClick={() => set(r, 'approved')}>Approve</button>}
                  {st !== 'held' && <button className="btn ghost sm" onClick={() => set(r, 'held')}>Hold</button>}
                  {(st === 'approved' || st === 'held') && <button className="btn ghost sm" onClick={() => set(r, null)}>Undo</button>}
                </div>
              </div>
              {d && isOpen && (
                <div className="card panel mt8" style={{ marginLeft: 82 }}>
                  <div className="tiny b muted">{d.dateline}</div>
                  {d.paras.map((p, i) => (
                    <p key={i} className="small mt8" style={{ whiteSpace: 'pre-wrap' }}>{p}</p>
                  ))}
                  {d.proposedQuote && <div className="issue mt12"><small>Proposed quote: needs his approval</small>“{d.proposedQuote}”</div>}
                  <p className="tiny muted mt8">Anything in [square brackets] must be confirmed before this runs.</p>
                </div>
              )}
            </div>
          );
        })}
      </Card>

      <Card title="Quotes put in his mouth" right={<span className="small muted">Only approved quotes can be used in cards, posts and releases.</span>}>
        {pendingQuotes.map((q) => {
          const ok = quotes[q.id];
          return (
            <div className="li" key={q.id}>
              <div className="sp"><div className="small">“{q.text}”</div><div className="tiny muted">{q.source}</div></div>
              {ok ? <Chip>Approved</Chip> : <button className="btn sm" onClick={() => setState((s) => ({ quotesApproved: { ...s.quotesApproved, [q.id]: true } }))}>Approve</button>}
            </div>
          );
        })}
      </Card>
    </>
  );
}
