'use client';

import { useMemo, useState } from 'react';
import { Card, Chip, PageHead, Sample, Stat } from '@/components/ui';
import { WARD_BY_SLUG } from '@/data/geo';
import { dayLabel, num } from '@/lib/format';
import { useMetrics } from '@/lib/hooks';
import { setState, useStore } from '@/lib/store';

type Row = { id: string; ref: string; name: string; ward: string; topic: string; message: string; at: string; status: 'open' | 'answered'; mine: boolean };

const SEED: Array<Omit<Row, 'mine' | 'status'>> = [];

const REPLIES = [
  { id: 'r1', label: 'Received and routed', text: 'Thank you. Your question has been logged and sent to the right desk. You will have a written answer within 5 working days.' },
  { id: 'r2', label: 'Point to the Project Register', text: 'We have received your question. The campaign team will respond after it reviews the available information.' },
  { id: 'r3', label: 'Point to the Academy', text: 'Programme details have not yet been supplied. The campaign team will share confirmed information when it is available.' },
];

export default function Desk() {
  const m = useMetrics();
  const tickets = useStore((s) => s.tickets);
  const [answered, setAnswered] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<string | null>(null);
  const [text, setText] = useState(REPLIES[0].text);

  const rows = useMemo<Row[]>(() => {
    const mine: Row[] = tickets.map((t) => ({ ...t, mine: true }));
    const seeded: Row[] = m.deskOpened > 20 ? SEED.map((s) => ({ ...s, status: 'open' as const, mine: false })) : [];
    return [...mine, ...seeded];
  }, [tickets, m.deskOpened]);

  const isAnswered = (r: Row) => (r.mine ? r.status === 'answered' : Boolean(answered[r.id]));
  const done = rows.filter(isAnswered).length;

  const send = (r: Row) => {
    if (r.mine) setState((s) => ({ tickets: s.tickets.map((t) => (t.id === r.id ? { ...t, status: 'answered' as const } : t)) }));
    else setAnswered((a) => ({ ...a, [r.id]: text }));
    setOpen(null);
  };

  return (
    <>
      <PageHead title="Help Desk" sub="The People’s Help Desk: every question gets a reference and a written answer within 5 working days. Questions asked in the public app land here." prov={['sample']} />
      <div className="grid g4 keep2">
        <Card><Stat label="Cases opened" value={num(m.deskOpened + tickets.length)} prov="sample" /></Card>
        <Card><Stat label="Answered in 5 days" value={`${m.deskOpened ? Math.round((m.deskOnTime / m.deskOpened) * 100) : 100}%`} sub="Target: all" prov="sample" /></Card>
        <Card><Stat label="In this inbox" value={rows.length} sub={`${done} answered here`} /></Card>
        <Card><Stat label="Asked from this browser" value={tickets.length} sub="From the public site" /></Card>
      </div>

      <Card title="Inbox" className="mt16" right={<Sample>Questions from the sample set are illustrative</Sample>}>
        {rows.length === 0 && <p className="small muted">The inbox is empty. Ask a question on the public site under Help Desk and it appears here at once. Move the preview date past launch to see the sample set.</p>}
        {rows.map((r) => {
          const ans = isAnswered(r);
          const w = WARD_BY_SLUG[r.ward];
          return (
            <div key={r.id} style={{ borderBottom: '1px solid var(--line)', padding: '12px 0' }}>
              <div className="row top">
                <div className="sp">
                  <div className="small"><b>{r.ref}</b> · {r.topic} · {w ? w.name : 'No ward given'} <span className="muted">· {r.name}</span></div>
                  <p className="small mt4">{r.message}</p>
                  <div className="tiny muted">{dayLabel(r.at.slice(0, 10))}{r.mine ? ' · asked from this browser' : ''}</div>
                  {answered[r.id] && <div className="note ok mt8"><div className="tiny b">Your answer</div>{answered[r.id]}</div>}
                </div>
                {ans ? <Chip>Answered</Chip> : <button className="btn sm" onClick={() => { setOpen(open === r.id ? null : r.id); setText(REPLIES[0].text); }}>Answer</button>}
              </div>
              {open === r.id && !ans && (
                <div className="card panel mt8">
                  <div className="row gap6 wrap mb8">
                    {REPLIES.map((x) => <button key={x.id} className="btn ghost sm" onClick={() => setText(x.text)}>{x.label}</button>)}
                  </div>
                  <textarea value={text} onChange={(e) => setText(e.target.value)} aria-label="Answer" />
                  <div className="row gap6 mt8"><button className="btn" onClick={() => send(r)} disabled={!text.trim()}>Send answer</button><button className="btn ghost" onClick={() => setOpen(null)}>Cancel</button></div>
                </div>
              )}
            </div>
          );
        })}
      </Card>
    </>
  );
}
