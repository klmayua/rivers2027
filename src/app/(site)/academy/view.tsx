'use client';

import { useState } from 'react';
import { WardSelect } from '@/components/bits';
import { Sample } from '@/components/ui';
import { initials, num } from '@/lib/format';
import { useMetrics } from '@/lib/hooks';
import { nowIso, setState, uid, useStore } from '@/lib/store';

// Course names to be confirmed with NSP Africa.
const COURSES = ['Mobile video and content creation', 'Social media management', 'Design basics', 'Practical use of AI tools'];

export function AcademyForm() {
  const m = useMetrics();
  const regs = useStore((s) => s.academy);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [ward, setWard] = useState('');
  const [course, setCourse] = useState(COURSES[0]);
  const [updates, setUpdates] = useState(false);
  const [ok, setOk] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setState((s) => ({ academy: [...s.academy, { id: uid('ac'), initials: initials(name), ward, course, at: nowIso() }] }));
    if (updates) setState((s) => ({ signups: [...s.signups, { id: uid('su'), initials: initials(name), ward, lang: 'English', sms: true, whatsapp: false, via: 'academy', role: 'supporter', at: nowIso() }] }));
    setOk(true);
  }

  return (
    <div className="wrap s-pad s-two">
      <div className="col gap14">
        <div className="card tint">
          <div className="row"><b>Registered so far</b><span className="sp" /><Sample /></div>
          <div className="stat"><div className="v">{num(m.academy + regs.length)}</div></div>
          <p className="tiny muted">Registration opened on launch day, Wednesday 21 October. First classes in early November; dates from NSP Africa.</p>
        </div>
        <div className="note warn">Open to everyone who qualifies. No cash, stipend, data bundles, devices or gifts, and no link between registering and voting.</div>
        <div className="card">
          <h3>What you will learn</h3>
          <ul className="small mt8" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
            {COURSES.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        {ok ? (
          <div className="note ok" role="status"><b>You are registered.</b><div className="small mt4">NSP Africa will contact you with class dates. Registering carries no condition and no link to voting.</div></div>
        ) : (
          <form className="col gap8 card" onSubmit={submit}>
            <h3>Register</h3>
            <label className="fld"><span>Full name</span><input type="text" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
            <label className="fld"><span>Phone number</span><input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="080…" /></label>
            <WardSelect value={ward} onChange={setWard} id="ac-ward" label="Your ward" />
            <label className="fld">
              <span>Course choice</span>
              <select value={course} onChange={(e) => setCourse(e.target.value)}>
                {COURSES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label className="chk"><input type="checkbox" checked={updates} onChange={(e) => setUpdates(e.target.checked)} /><span>I also want campaign updates by SMS. (Optional. Leave unticked to register for the Academy only.)</span></label>
            <button className="btn red block lg" disabled={!name || phone.length < 8 || !ward}>Register for the Academy</button>
            <p className="tiny muted">Registration asks only for a name, ward, phone and course choice, and nothing about politics.</p>
          </form>
        )}
      </div>
    </div>
  );
}
