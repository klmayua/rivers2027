'use client';

import { useMemo, useState } from 'react';
import { Sample } from '@/components/ui';
import { WARDS, WARD_BY_SLUG } from '@/data/geo';
import { initials } from '@/lib/format';
import { usePersona } from '@/lib/hooks';
import { nowIso, setState, uid, useStore } from '@/lib/store';

const SEED = [
  { who: 'Coordinator', text: 'Good morning team. Today’s briefing is up. The issue this week is on the home screen.' },
  { who: 'Agent PU 002', text: 'Photos of the road near the junction uploaded under Report.' },
  { who: 'Coordinator', text: 'Thanks. Please no faces in the pictures, and keep to the briefing when you share.' },
  { who: 'Agent PU 007', text: 'Question: where do I send someone who wants to join?' },
  { who: 'Coordinator', text: 'Open More, then the invite link. It takes them to our ward page.' },
];

/** One chat per ward, so questions are answered in the open. */
export default function Chat() {
  const persona = usePersona();
  const locked = persona.id === 'pu' || persona.id === 'ward';
  const [slug, setSlug] = useState('abua-i-01');
  const ward = WARD_BY_SLUG[locked ? 'abua-i-01' : slug];
  const chat = useStore((s) => s.chat);
  const [text, setText] = useState('');
  const msgs = useMemo(() => chat.filter((m) => m.ward === ward.slug), [chat, ward.slug]);
  const me = persona.id === 'pu' ? 'Agent PU 004' : persona.id === 'ward' ? 'Coordinator' : persona.short;
  return (
    <div className="col gap8" style={{ minHeight: '100%' }}>
      <div className="row"><h2 className="sp" style={{ fontSize: 18 }}>{ward.name} chat</h2><Sample>Sample thread</Sample></div>
      {!locked && (
        <label className="fld"><span>Ward</span><select value={slug} onChange={(e) => setSlug(e.target.value)}>{WARDS.map((w) => (<option key={w.slug} value={w.slug}>{w.name}</option>))}</select></label>
      )}
      <div className="col gap8" role="log" aria-live="polite">
        {SEED.map((m, i) => (
          <Bubble key={i} who={m.who} text={m.text} mine={false} />
        ))}
        {msgs.map((m) => (
          <Bubble key={m.id} who={m.who} text={m.text} mine={m.who === me} time={m.at} />
        ))}
      </div>
      <form
        className="row gap6"
        style={{ position: 'sticky', bottom: 0, background: '#fff', paddingTop: 8 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          setState((s) => ({ chat: [...s.chat, { id: uid('ch'), ward: ward.slug, who: me, text: text.trim(), at: nowIso() }] }));
          setText('');
        }}
      >
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Message your ward" aria-label="Message" />
        <button className="btn" disabled={!text.trim()}>Send</button>
      </form>
    </div>
  );
}

function Bubble({ who, text, mine, time }: { who: string; text: string; mine: boolean; time?: string }) {
  return (
    <div className="row top gap8" style={{ flexDirection: mine ? 'row-reverse' : 'row' }}>
      <div className="av" style={{ width: 30, height: 30, fontSize: 11 }}>{initials(who)}</div>
      <div style={{ background: mine ? 'var(--green-tint)' : 'var(--panel)', border: '1px solid var(--line)', borderRadius: 14, padding: '7px 11px', maxWidth: '82%' }}>
        <div className="tiny b muted">{who}{time ? ` · ${new Date(time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : ''}</div>
        <div className="small">{text}</div>
      </div>
    </div>
  );
}
