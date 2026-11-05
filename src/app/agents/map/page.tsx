'use client';

import { useMemo, useState } from 'react';
import { Bar, Prov, Sample } from '@/components/ui';
import { WARDS, WARD_BY_SLUG, pusOf } from '@/data/geo';
import { initials } from '@/lib/format';
import { useClock, usePersona } from '@/lib/hooks';
import { puStates } from '@/lib/model';
import { rngFor } from '@/lib/rng';
import { setState, useStore } from '@/lib/store';
import { isElectionDay } from '@/lib/clock';

const NAMES = ['Chioma', 'Ifeanyi', 'Ngozi', 'Emeka', 'Obiageli', 'Chinedu', 'Adaeze', 'Uche', 'Nneka', 'Kelechi'];

/** The ward's polling units on one screen: latest report and assigned agent. Coordinators approve agents here. */
export default function AgentMap() {
  const clock = useClock();
  const persona = usePersona();
  const scen = useStore((s) => s.givingScenario);
  const reports = useStore((s) => s.reports);
  const approvals = useStore((s) => s.agentApprovals);
  const sheets = useStore((s) => s.sheets);
  const coordinator = persona.id !== 'pu';
  const lockedWard = persona.id === 'ward' || persona.id === 'pu' ? 'abua-i-01' : null;
  const [slug, setSlug] = useState('abua-i-01');
  const ward = WARD_BY_SLUG[lockedWard ?? slug];
  const [sel, setSel] = useState<string | null>(null);
  const states = useMemo(() => puStates(clock.date, ward, scen), [clock.date, ward, scen]);
  const mine = pusOf(ward).find((p) => p.n === 4);
  const have = states.filter((s) => s.hasCaptain).length;
  const election = isElectionDay(clock.date);
  const picked = states.find((s) => s.pu.id === sel) ?? null;
  const repsFor = (id: string) => reports.filter((r) => r.pu === id).length;
  const sheetFor = (id: string) => sheets.find((s) => s.pu === id);

  // sample agents waiting for approval, plus anyone who joined as an agent on this device
  const pending = useMemo(() => {
    const r = rngFor('pend:' + ward.slug);
    return [0, 1, 2].map((i) => ({ id: `${ward.slug}-p${i}`, name: `${NAMES[Math.floor(r() * 10)]} ${String.fromCharCode(65 + Math.floor(r() * 26))}.`, pu: 1 + Math.floor(r() * ward.pus) }));
  }, [ward]);
  const joined = useStore((s) => s.signups).filter((x) => x.role === 'agent' && x.ward === ward.slug);

  return (
    <div className="col gap14">
      <div className="row">
        <h2 className="sp" style={{ fontSize: 18 }}>Ward map</h2>
        <Sample />
      </div>
      {!lockedWard && (
        <label className="fld"><span>Ward</span>
          <select value={slug} onChange={(e) => { setSlug(e.target.value); setSel(null); }}>
            {WARDS.map((w) => (<option key={w.slug} value={w.slug}>{w.name} · {w.lgaName}</option>))}
          </select>
        </label>
      )}
      <div className="card tint">
        <div className="row"><b className="sp">{ward.name}</b><span className="small">{have} of {ward.pus} units have a captain</span></div>
        <div className="mt8"><Bar pct={(have / ward.pus) * 100} /></div>
      </div>

      <div>
        <div className="pt">Polling units <Prov k="sample" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(46px, 1fr))', gap: 6 }}>
          {states.map((s) => {
            const sheet = sheetFor(s.pu.id);
            const has = s.hasCaptain;
            const bg = election && sheet ? 'var(--green)' : has ? (s.lastReport === 'stale' ? '#e0a526' : 'var(--green-tint)') : '#fff';
            const color = election && sheet ? '#fff' : 'var(--ink)';
            const isMine = coordinator ? false : mine?.id === s.pu.id;
            return (
              <button key={s.pu.id} onClick={() => setSel(s.pu.id)} aria-pressed={sel === s.pu.id} title={`PU ${s.pu.n}`}
                style={{ height: 46, borderRadius: 10, border: `1.5px ${has ? 'solid' : 'dashed'} ${sel === s.pu.id ? 'var(--red)' : isMine ? 'var(--blue-deep)' : has ? '#cfe5d6' : 'var(--line2)'}`, background: bg, color, fontWeight: 700, fontSize: 12.5 }}>
                {String(s.pu.n).padStart(3, '0')}
              </button>
            );
          })}
        </div>
        <div className="row gap8 wrap tiny muted mt8">
          <span>■ <span style={{ color: 'var(--green)' }}>captain</span></span><span>■ <span style={{ color: '#b47f00' }}>report overdue</span></span><span>□ no captain (gap)</span>{election && <span>■ sheet received</span>}
        </div>
        <p className="tiny muted mt4">Unit names and codes come from the supplied INEC-derived source; map positions are schematic.</p>
      </div>

      {picked && (
        <div className="card">
          <div className="row"><h3 className="sp">PU {String(picked.pu.n).padStart(3, '0')} · {ward.name}</h3><button className="btn ghost sm" onClick={() => setSel(null)}>Close</button></div>
          <div className="small mt8 col gap6">
            <div>Registered-voter count: <b>not supplied</b></div>
            <div>Captain: <b>{picked.hasCaptain ? `${NAMES[picked.pu.n % 10]} ${String.fromCharCode(65 + (picked.pu.n * 7) % 26)}.` : 'None yet'}</b></div>
            <div>Reports: <b>{picked.reports + repsFor(picked.pu.id)}</b>{picked.lastReport === 'stale' && <span className="chip amber" style={{ marginLeft: 6 }}>Overdue</span>}</div>
            {sheetFor(picked.pu.id) && <div className="chip solid" style={{ alignSelf: 'flex-start' }}>Result sheet received</div>}
          </div>
          {coordinator && !picked.hasCaptain && <button className="btn sm mt12" onClick={() => setState((s) => ({ agentApprovals: { ...s.agentApprovals, ['assign-' + picked.pu.id]: 'approved' } }))}>{approvals['assign-' + picked.pu.id] ? '✓ Invitation sent' : 'Invite a captain'}</button>}
        </div>
      )}

      {coordinator && (
        <div>
          <div className="pt">Agents waiting for your approval</div>
          <p className="tiny muted mb8">An agent sees no chat and no map until you approve them.</p>
          {[...joined.map((j) => ({ id: j.id, name: j.initials, pu: 0 })), ...pending].map((a) => {
            const st = approvals[a.id];
            return (
              <div className="pcard row" key={a.id}>
                <div className="av">{initials(a.name)}</div>
                <div className="sp"><div className="tt">{a.name}</div><div className="mm">{a.pu ? `Asked for PU ${String(a.pu).padStart(3, '0')}` : 'Joined from the app'}</div></div>
                {st ? <span className={`chip ${st === 'approved' ? '' : 'red'}`}>{st === 'approved' ? 'Approved' : 'Declined'}</span> : (
                  <div className="row gap6">
                    <button className="btn sm" onClick={() => setState((s) => ({ agentApprovals: { ...s.agentApprovals, [a.id]: 'approved' } }))}>Approve</button>
                    <button className="btn ghost sm" onClick={() => setState((s) => ({ agentApprovals: { ...s.agentApprovals, [a.id]: 'rejected' } }))}>Decline</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
