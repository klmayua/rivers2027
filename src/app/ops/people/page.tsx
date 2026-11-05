'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Bar, Card, Chip, Note, PageHead, Prov, Stat } from '@/components/ui';
import { GROUPS, STAKEHOLDERS } from '@/data/content';
import { WARDS } from '@/data/geo';
import { dayLabel, num } from '@/lib/format';
import { useClock, useMetrics, usePersona, useWardMetrics } from '@/lib/hooks';
import { rngFor } from '@/lib/rng';
import { useStore, type Signup } from '@/lib/store';

const A = 'ACDEFGIKNOUTBM'.split('');
const VIA = ['Ward SMS link', 'Champion link', 'Public app', 'Town hall', 'WhatsApp group', 'Help Desk'];
const ROLE: Signup['role'][] = ['supporter', 'supporter', 'supporter', 'supporter', 'champion', 'agent'];
const LANG = ['English', 'English', 'Pidgin', 'Igbo'];

type Tab = 'registry' | 'leaders' | 'groups';

export default function People() {
  const clock = useClock();
  const persona = usePersona();
  const m = useMetrics();
  const wardRows = useWardMetrics();
  const mine = useStore((s) => s.signups);
  const [tab, setTab] = useState<Tab>('registry');
  const scopeWard = persona.id === 'ward' ? persona.scope : '';
  const scopeLga = persona.id === 'lga_ne' || persona.id === 'lga_south' ? (persona.scope ?? '') : '';
  const [ward, setWard] = useState<string>(scopeWard ?? '');

  const rows = useMemo<Signup[]>(() => {
    const n = Math.min(60, m.signups);
    return Array.from({ length: n }, (_, i) => {
      const g = rngFor('reg:' + i);
      const w = WARDS[Math.floor(g() * WARDS.length)];
      return {
        id: 'r' + i,
        initials: A[Math.floor(g() * A.length)] + '.' + A[Math.floor(g() * A.length)] + '.',
        ward: w.slug,
        lang: LANG[Math.floor(g() * LANG.length)],
        sms: g() < 0.82,
        whatsapp: g() < 0.7,
        via: VIA[Math.floor(g() * VIA.length)],
        role: ROLE[Math.floor(g() * ROLE.length)],
        at: '',
      };
    });
  }, [m.signups]);

  const all = [...mine, ...rows];
  const view = all.filter((r) => {
    const w = WARDS.find((x) => x.slug === r.ward);
    if (ward && r.ward !== ward) return false;
    if (scopeLga && w?.lga !== scopeLga) return false;
    return true;
  });
  const top = [...wardRows].sort((a, b) => b.signups - a.signups).slice(0, 8);
  const max = top[0]?.signups || 1;

  return (
    <>
      <PageHead
        title="People"
        sub="Everyone who has joined with consent, the leaders and institutions named in the campaign material, and the champion groups. Registry rows show initials only in this preview."
        prov={['sample', 'reported']}
      />
      <div className="seg mb12" role="group" aria-label="People">
        {([['registry', 'Registry'], ['leaders', 'Leaders and institutions'], ['groups', 'Champion groups']] as const).map(([k, l]) => (
          <button key={k} aria-pressed={tab === k} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === 'registry' && (
        <>
          <div className="grid g4 keep2">
            <Card><Stat label="On the registry" value={num(m.signups + mine.length)} prov="sample" /></Card>
            <Card><Stat label="SMS opt-in" value={num(m.optIn + mine.filter((x) => x.sms).length)} sub="Consented in the app or on a ward page" prov="sample" /></Card>
            <Card><Stat label="Champions" value={num(m.champions)} prov="sample" /></Card>
            <Card><Stat label="Joined from this browser" value={mine.length} sub="Via the public Join form" /></Card>
          </div>
          <div className="grid g21 mt16">
            <Card title="Registry" right={
              <label className="row gap6 small">Ward
                <select value={ward} onChange={(e) => setWard(e.target.value)} style={{ width: 'auto' }} disabled={Boolean(scopeWard)}>
                  <option value="">All wards</option>
                  {WARDS.filter((w) => !scopeLga || w.lga === scopeLga).map((w) => <option key={w.slug} value={w.slug}>{w.name}</option>)}
                </select>
              </label>
            }>
              <div className="tw">
                <table className="tbl">
                  <thead><tr><th>Person</th><th>Ward</th><th>Joined through</th><th>Role</th><th>Language</th><th>Consent</th></tr></thead>
                  <tbody>
                    {view.slice(0, 40).map((r) => (
                      <tr key={r.id} className={r.id.startsWith('r') ? '' : 'hl'}>
                        <td className="b">{r.initials}</td>
                        <td className="small">{WARDS.find((w) => w.slug === r.ward)?.name ?? '–'}</td>
                        <td className="small">{r.via}</td>
                        <td className="small" style={{ textTransform: 'capitalize' }}>{r.role}</td>
                        <td className="small">{r.lang}</td>
                        <td className="small">{r.sms ? 'SMS ' : ''}{r.whatsapp ? 'WhatsApp' : ''}{!r.sms && !r.whatsapp ? 'Email only' : ''}</td>
                      </tr>
                    ))}
                    {view.length === 0 && <tr><td colSpan={6} className="small muted">No one on the registry yet for this cut. Sign-ups begin on launch day.</td></tr>}
                  </tbody>
                </table>
              </div>
              <p className="tiny muted mt8">Showing the first 40 of {num(view.length)} sample rows as at {dayLabel(clock.date)}. Highlighted rows were added from this browser.</p>
            </Card>
            <Card title="Sign-ups by ward" right={<Prov k="sample" />}>
              {top.map((r) => (
                <div key={r.ward.slug} style={{ padding: '5px 0' }}>
                  <div className="row small"><span className="sp">{r.ward.name}</span><b>{num(r.signups)}</b></div>
                  <Bar pct={(r.signups / max) * 100} />
                </div>
              ))}
            </Card>
          </div>
        </>
      )}

      {tab === 'leaders' && (
        <Card title="Leaders and institutions" right={<span className="small muted">As reported in the campaign material</span>}>
          <div className="tw">
            <table className="tbl">
              <thead><tr><th>Name</th><th>Role</th><th>Area</th><th>Seen at</th><th>Suggested use</th></tr></thead>
              <tbody>
                {STAKEHOLDERS.map((s) => (
                  <tr key={s.name}><td className="b small">{s.name}</td><td className="small">{s.role}</td><td className="small">{s.area}</td><td className="small">{s.seen}</td><td className="small">{s.suggest}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt12"><Note tone="warn">A traditional ruler or leader appearing at an event is never used as an endorsement without their own words. No Rivers State leaders are named yet (open item 18).</Note></div>
        </Card>
      )}

      {tab === 'groups' && (
        <Card title="Champion groups" right={<Chip tone="amber">Sample groups</Chip>}>
          <div className="tw">
            <table className="tbl">
              <thead><tr><th>Group</th><th>Circle</th><th>Place</th><th className="num">Members</th><th>Page</th></tr></thead>
              <tbody>
                {GROUPS.map((g) => (
                  <tr key={g.slug}><td className="b small">{g.name}</td><td className="small">{g.circle}</td><td className="small">{g.place}</td><td className="num">{num(g.members)}</td><td><Link href={`/g/${g.slug}`} className="small b">Open →</Link></td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="tiny muted mt8">Group names and sizes are illustrative. Each real group is created when its champion is named.</p>
        </Card>
      )}
    </>
  );
}
