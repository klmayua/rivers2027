'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Bar, Card, Chip, PageHead, Prov, Sample, Stat } from './ui';
import { QR } from './qr';
import type { Ward } from '@/data/geo';
import { WEEKS } from '@/data/weeks';
import { weekOf } from '@/lib/clock';
import { initials, num } from '@/lib/format';
import { useClock, usePersona, useWardMetrics } from '@/lib/hooks';
import { puStates } from '@/lib/model';
import { rngFor } from '@/lib/rng';
import { nowIso, setState, uid, useStore } from '@/lib/store';

const FIRST = ['C', 'E', 'N', 'O', 'I', 'U', 'A', 'F', 'B', 'D', 'K', 'T'];
const LAST = ['O', 'E', 'N', 'A', 'I', 'U', 'M', 'D'];

export function WardView({ ward }: { ward: Ward }) {
  const clock = useClock();
  const persona = usePersona();
  const scen = useStore((s) => s.givingScenario);
  const rows = useWardMetrics();
  const decisions = useStore((s) => s.agentApprovals);
  const chat = useStore((s) => s.chat);
  const [text, setText] = useState('');
  const r = rows.find((x) => x.ward.slug === ward.slug)!;
  const units = useMemo(() => puStates(clock.date, ward, scen).sort((a, b) => a.pu.n - b.pu.n), [clock.date, ward, scen]);
  const wk = Math.max(1, Math.min(13, weekOf(clock.date)));
  const w = WEEKS[wk - 1];
  const gaps = units.filter((u) => !u.hasCaptain);

  // Sample applicants, assigned to the first uncovered units. Initials only: no invented people.
  const applicants = useMemo(
    () =>
      gaps.slice(0, 4).map((u, i) => {
        const g = rngFor(`app:${ward.slug}:${i}`);
        return { id: `${ward.slug}-app-${u.pu.n}`, who: `${FIRST[Math.floor(g() * FIRST.length)]}.${LAST[Math.floor(g() * LAST.length)]}.`, pu: u.pu.n, via: g() > 0.5 ? 'Ward page' : 'Champion invite' };
      }),
    [gaps, ward.slug],
  );
  const open = applicants.filter((a) => !decisions[a.id]);
  const approvedHere = applicants.filter((a) => decisions[a.id] === 'approved').length;
  const captains = r.captains + approvedHere;
  const msgs = chat.filter((m) => m.ward === ward.slug);
  const me = persona.id === 'ward' ? 'Coordinator' : persona.short;
  const path = `/w/${ward.slug}/${w.slug}`;

  return (
    <>
      <PageHead
        title={`${ward.name} ward desk`}
        sub={<>{ward.lgaName} · INEC code {ward.id} · {ward.pus} polling units · registered-voter total unavailable</>}
        actions={<><Link href={`/ops/lga/${ward.lga}`} className="btn sec">{ward.lgaName} desk</Link><Link href={path} className="btn">Open ward page</Link></>}
      />

      <div className="grid g4 keep2">
        <Card><Stat label="Coordinator" value={r.coordinatorNamed ? 'Named' : 'Not yet'} prov="sample" /></Card>
        <Card><Stat label="Captains" value={captains} unit={`of ${ward.pus}`} sub={`${Math.round((captains / ward.pus) * 100)}% covered`} prov="sample" /></Card>
        <Card><Stat label="Sign-ups" value={num(r.signups)} sub={`${num(r.smsList)} on the cleared SMS list`} prov="sample" /></Card>
        <Card><Stat label="Readiness" value={`${r.readiness}%`} sub={r.flag ?? 'On track'} prov="sample" /></Card>
      </div>

      <div className="grid g21 mt16">
        <div className="col gap14">
          <Card title={`Polling units (${ward.pus})`} right={<span className="small muted">Tap a unit</span>}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(46px, 1fr))', gap: 6 }}>
              {units.map((u) => {
                const bg = !u.hasCaptain ? 'var(--red-tint)' : u.lastReport === 'stale' ? 'var(--amber-bg)' : 'var(--green-tint)';
                const bd = !u.hasCaptain ? '#f2c7cb' : u.lastReport === 'stale' ? '#ecd9a8' : '#cfe5d6';
                return (
                  <Link key={u.pu.id} href={`/ops/pu/${u.pu.slug}`} title={`PU ${u.pu.n}: ${u.hasCaptain ? 'captain approved' : 'no captain yet'}`} style={{ background: bg, border: `1px solid ${bd}`, borderRadius: 8, padding: '8px 0', textAlign: 'center', fontWeight: 700, fontSize: 12.5, color: 'var(--ink)' }}>
                    {String(u.pu.n).padStart(3, '0')}
                  </Link>
                );
              })}
            </div>
            <div className="row gap14 wrap tiny muted mt12">
              <span className="row gap4"><i style={{ width: 11, height: 11, borderRadius: 3, background: 'var(--green-tint)', border: '1px solid #cfe5d6', display: 'inline-block' }} />Captain, reporting</span>
              <span className="row gap4"><i style={{ width: 11, height: 11, borderRadius: 3, background: 'var(--amber-bg)', border: '1px solid #ecd9a8', display: 'inline-block' }} />Captain, report overdue</span>
              <span className="row gap4"><i style={{ width: 11, height: 11, borderRadius: 3, background: 'var(--red-tint)', border: '1px solid #f2c7cb', display: 'inline-block' }} />No captain</span>
              <Prov k="sample" />
            </div>
            <p className="tiny muted mt8">Unit numbering is sample until INEC’s polling-unit register is loaded.</p>
          </Card>

          <Card title="Captain applications" right={<Chip tone={open.length ? 'amber' : undefined}>{open.length} waiting</Chip>}>
            {applicants.length === 0 && <p className="small muted">Every unit in this ward has a captain.</p>}
            {applicants.map((a) => {
              const d = decisions[a.id];
              return (
                <div className="li" key={a.id}>
                  <div className="av">{a.who.replace(/\./g, '')}</div>
                  <div className="sp small"><b>{a.who}</b> for PU {String(a.pu).padStart(3, '0')}<div className="tiny muted">Applied through {a.via} · nominated to INEC through the party once approved</div></div>
                  {d ? <Chip tone={d === 'approved' ? undefined : 'red'}>{d === 'approved' ? 'Approved' : 'Declined'}</Chip> : (
                    <div className="row gap6">
                      <button className="btn sm" onClick={() => setState((s) => ({ agentApprovals: { ...s.agentApprovals, [a.id]: 'approved' } }))}>Approve</button>
                      <button className="btn ghost sm" onClick={() => setState((s) => ({ agentApprovals: { ...s.agentApprovals, [a.id]: 'rejected' } }))}>Decline</button>
                    </div>
                  )}
                </div>
              );
            })}
            <p className="tiny muted mt8">Applicants are shown by initials in this preview. Nobody is paid to post; any payment is a disclosed paid partnership and goes on the Cap ledger.</p>
          </Card>
        </div>

        <div className="col gap14">
          <Card title="This ward’s issue">
            <p className="small">{ward.leadIssue}</p>
            <p className="small mt8">This week the SMS link opens <b>{w.issue}</b> for {ward.name}.</p>
            <div className="mt12" style={{ display: 'grid', placeItems: 'center' }}><QR path={path} size={120} label={`QR code for the ${ward.name} ward page`} /></div>
          </Card>

          <Card title="Ward chat" right={<Sample>Sample thread</Sample>}>
            <div className="col gap8" role="log" aria-live="polite" style={{ maxHeight: 260, overflow: 'auto' }}>
              {msgs.length === 0 && <p className="small muted">No messages yet. The agents’ app shows this same thread.</p>}
              {msgs.map((m) => (
                <div key={m.id} className="row top gap8">
                  <div className="av" style={{ width: 28, height: 28, fontSize: 10.5 }}>{initials(m.who)}</div>
                  <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: 12, padding: '6px 10px' }}>
                    <div className="tiny b muted">{m.who}</div><div className="small">{m.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <form className="row gap6 mt12" onSubmit={(e) => { e.preventDefault(); if (!text.trim()) return; setState((s) => ({ chat: [...s.chat, { id: uid('ch'), ward: ward.slug, who: me, text: text.trim(), at: nowIso() }] })); setText(''); }}>
              <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Message the ward" aria-label="Message the ward" />
              <button className="btn" disabled={!text.trim()}>Send</button>
            </form>
          </Card>

          <Card title="Activity">
            <div className="grid g2 keep2">
              <Stat label="Reports" value={num(r.reports)} prov="sample" />
              <Stat label="Help Desk" value={num(r.desk)} prov="sample" />
              <Stat label="Academy" value={num(r.academy)} prov="sample" />
              <Stat label="Gifts" value={num(r.gifts)} prov="sample" />
            </div>
            <div className="mt12"><div className="tiny muted">Opt-outs on SMS</div><Bar pct={(r.optOut / 2) * 100} tone={r.optOut > 0.8 ? 'red' : undefined} /><div className="tiny muted mt4">{r.optOut.toFixed(2)}% · pause at 2%</div></div>
          </Card>
        </div>
      </div>
    </>
  );
}
