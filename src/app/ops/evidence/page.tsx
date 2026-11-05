'use client';

import { useMemo, useState } from 'react';
import { Card, Chip, PageHead } from '@/components/ui';
import { EVIDENCE, WHY_DIGITAL } from '@/data/evidence';

const LABEL: Record<string, string> = { opened: 'Source opened', reported: 'Reported', verify: 'To verify', campaign: 'Campaign material', official: 'Official source', 'source-data': 'Supplied source data', unavailable: 'Unavailable' } as const;
const FILTERS = ['all', 'opened', 'reported', 'verify', 'campaign'] as const;

export default function Evidence() {
  const [f, setF] = useState<(typeof FILTERS)[number]>('all');
  const [q, setQ] = useState('');
  const list = useMemo(
    () => EVIDENCE.filter((e) => (f === 'all' || e.status.includes(f)) && (q.trim() === '' || (e.topic + ' ' + e.text).toLowerCase().includes(q.trim().toLowerCase()))),
    [f, q],
  );
  return (
    <>
      <PageHead title="Evidence" sub="Twenty-one items the plan rests on, each with its source. Items marked “to verify” are open and shown as such wherever they are used." prov={['reported']} />
      <Card>
        <div className="row gap8 wrap mb12">
          <input type="search" placeholder="Search the evidence" aria-label="Search" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 260 }} />
          <div className="seg" role="group" aria-label="Filter">
            {FILTERS.map((k) => <button key={k} aria-pressed={f === k} onClick={() => setF(k)}>{k === 'all' ? 'All' : LABEL[k]}</button>)}
          </div>
          <span className="sp" />
          <span className="small muted">{list.length} of {EVIDENCE.length}</span>
        </div>
        {list.map((e) => (
          <div className="li" key={e.id}>
            <div className="k" style={{ width: 'auto', minWidth: 36, borderRadius: 14, padding: '0 8px' }}>{e.id}</div>
            <div className="sp">
              <div className="b small">{e.topic}</div>
              <div className="small">{e.text}</div>
              <div className="row gap6 wrap mt4">
                {e.src.map((s) => s.url ? <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="tiny b">{s.label} ↗</a> : <span key={s.label} className="tiny muted">{s.label}</span>)}
                {e.status.map((s) => <Chip key={s} tone={s === 'verify' ? 'amber' : s === 'opened' ? undefined : 'gray'}>{LABEL[s]}</Chip>)}
                {e.verify && <span className="tiny muted">Verify: {e.verify}</span>}
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="small muted">Nothing matches.</p>}
      </Card>

      <Card title="Why digital, and why this way" className="mt16">
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>#</th><th>Why</th><th>What is on the record</th><th>What the platform does</th></tr></thead>
            <tbody>
              {WHY_DIGITAL.map((w) => <tr key={w.n}><td className="b">{w.n}</td><td className="b small">{w.why}</td><td className="small">{w.record}</td><td className="small">{w.does}</td></tr>)}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
