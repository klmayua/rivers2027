'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { WardSelect } from '@/components/bits';
import { WARD_BY_SLUG } from '@/data/geo';
import { hash } from '@/lib/rng';
import { nowIso, setState, uid, useStore, type Ticket } from '@/lib/store';
import { dayLabel } from '@/lib/format';

const TOPICS = ['Roads and safety', 'Youth and jobs', 'Health', 'Schools and scholarships', 'Reported priorities', 'Markets and trade', 'Senior citizens', 'Something else'];

export function DeskForm() {
  const sp = useSearchParams();
  const pre = sp.get('topic') ?? '';
  const preWard = sp.get('ward') ?? '';
  const tickets = useStore((s) => s.tickets);
  const known = TOPICS.includes(pre);
  const [name, setName] = useState('');
  const [ward, setWard] = useState(preWard);
  const [topic, setTopic] = useState(known ? pre : pre ? 'Something else' : TOPICS[0]);
  const [msg, setMsg] = useState(pre && !known ? `About “${pre}”: ` : '');
  const [done, setDone] = useState<Ticket | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t: Ticket = {
      id: uid('tk'),
      ref: 'HD-' + (hash(name + msg + ward) % 9000 + 1000),
      name: name.trim() || 'Anonymous',
      ward,
      topic,
      message: msg.trim(),
      at: nowIso(),
      status: 'open',
    };
    setState((s) => ({ tickets: [t, ...s.tickets] }));
    setDone(t);
    setMsg('');
  }

  return (
    <div className="narrow s-pad">
      {done && (
        <div className="note ok mb12" role="status">
          <b>Received: {done.ref}</b>
          <div className="small mt4">Your question is with the campaign’s Help Desk. Keep this reference. You will get an answer within 5 working days.</div>
        </div>
      )}
      <form className="col gap8" onSubmit={submit}>
        <label className="fld"><span>Your name (optional)</span><input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
        <WardSelect value={ward} onChange={setWard} id="hd-ward" />
        <label className="fld">
          <span>About</span>
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            {TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="fld"><span>Your question</span><textarea required value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Tell us what is happening and where." /></label>
        <p className="tiny muted">Do not send photographs of voters or voter cards. The campaign stores your question in its own data store and will not use your details to send messages unless you opt in on the Join page.</p>
        <button className="btn red block lg" disabled={msg.trim().length < 8}>Send to the Help Desk</button>
      </form>
      {tickets.length > 0 && (
        <div className="mt24">
          <div className="pt">Your questions</div>
          {tickets.map((t) => (
            <div className="pcard" key={t.id}>
              <div className="row"><b className="sp">{t.ref}</b><span className="chip amber">{t.status === 'open' ? 'Open' : 'Answered'}</span></div>
              <div className="mm">{t.topic}{t.ward ? ` · ${WARD_BY_SLUG[t.ward]?.name ?? ''}` : ''} · {dayLabel(t.at.slice(0, 10))}</div>
              <p className="small mt4">{t.message}</p>
            </div>
          ))}
          <p className="tiny muted mt8">These also reach the campaign’s Help Desk inbox, where the team answers them.</p>
        </div>
      )}
    </div>
  );
}
