'use client';

import Link from 'next/link';
import { useState } from 'react';
import { WardSelect, ShareBtn } from './bits';
import { QR } from './qr';
import { initials } from '@/lib/format';
import { hash } from '@/lib/rng';
import { nowIso, setState, uid } from '@/lib/store';

type Role = 'supporter' | 'champion' | 'agent';

export function JoinForm({ ward: initialWard = '', via = 'app' }: { ward?: string; via?: string }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ward, setWard] = useState(initialWard);
  const [lang, setLang] = useState('English');
  const [role, setRole] = useState<Role>('supporter');
  const [sms, setSms] = useState(false);
  const [wa, setWa] = useState(false);
  const [done, setDone] = useState<{ code: string; role: Role } | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setState((s) => ({ signups: [...s.signups, { id: uid('su'), initials: initials(name), ward, lang, sms, whatsapp: wa, via, role, at: nowIso() }] }));
    setDone({ code: (name.split(' ')[0] || 'friend').toLowerCase().replace(/[^a-z]/g, '') + (hash(name + phone) % 90 + 10), role });
  }

  if (done) {
    const link = done.role === 'champion' ? `/g/${done.code}` : `/s/${done.code}`;
    return (
      <div className="col gap8">
        <div className="note ok" role="status">
          <b>Welcome to the team, {name.split(' ')[0]}.</b>
          <div className="small mt4">
            {done.role === 'agent'
              ? 'Your ward coordinator will approve you in the agents’ app before you see the chat or the map.'
              : done.role === 'champion'
                ? 'Here is your group link and QR code. Share the link in your WhatsApp group; gifts through it are counted for the group, never by name.'
                : 'Here is your personal link. Pass it on: gifts through it are counted for you, never shown by name.'}
          </div>
        </div>
        {done.role !== 'agent' && (
          <>
            <QR path={link} size={120} />
            <ShareBtn text="Join me in backing Chief Barr. Dumo Lulu Briggs for Rivers State:" path={link} />
          </>
        )}
        {done.role === 'agent' && <Link href="/signin" className="btn block">Sign in to the agents’ app</Link>}
        <Link href="/" className="btn sec block">Back to the site</Link>
      </div>
    );
  }

  return (
    <form className="col gap8" onSubmit={submit}>
      <label className="fld"><span>Full name</span><input type="text" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
      <label className="fld"><span>Phone number</span><input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="080…" /></label>
      <WardSelect value={ward} onChange={setWard} id="jn-ward" />
      <label className="fld">
        <span>Language for messages</span>
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option>English</option>
          <option>Pidgin</option>
          <option>Rivers</option>
        </select>
      </label>
      <fieldset style={{ border: 0, padding: 0, margin: 0 }} className="col gap6">
        <legend className="small b" style={{ marginBottom: 6 }}>How do you want to help?</legend>
        {([['supporter', 'Supporter: keep me informed'], ['champion', 'Champion: share one link in my group or market'], ['agent', 'Ground team: polling-unit agent or ward helper']] as const).map(([v, l]) => (
          <label className="chk" key={v}>
            <input type="radio" name="role" checked={role === v} onChange={() => setRole(v)} />
            <span>{l}</span>
          </label>
        ))}
      </fieldset>
      <label className="chk"><input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} /><span>Send me campaign updates by SMS. I can reply STOP at any time.</span></label>
      <label className="chk"><input type="checkbox" checked={wa} onChange={(e) => setWa(e.target.checked)} /><span>Add me to my ward’s WhatsApp group.</span></label>
      <button className="btn red block" disabled={!name || phone.length < 8 || !ward}>Join the team</button>
      <p className="tiny muted">Political opinion is sensitive personal data. The campaign holds your details in its own store, uses them only for what you tick above, and never sells them.</p>
    </form>
  );
}
