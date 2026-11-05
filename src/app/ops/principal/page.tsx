'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Card, Chip, PageHead, Prov, Sample, Stat, Bar } from '@/components/ui';
import { StackBar, Treemap, ramp } from '@/components/charts';
import { Portrait } from '@/components/brand';
import { ELECTION, QUOTES, SCENARIOS, type ScenarioKey } from '@/data/campaign';
import { EVENTS } from '@/data/content';
import { RELEASES, WEEKS } from '@/data/weeks';
import { daysToElection, weekOf } from '@/lib/clock';
import { dayLabel, naira, nairaShort, num } from '@/lib/format';
import { useClock, useMetrics, useWardMetrics } from '@/lib/hooks';
import { PU_TARGET, WEEKLY_GOAL, pathToSeat } from '@/lib/model';
import { releaseStatus } from '@/lib/releases';
import { setState, useStore } from '@/lib/store';

export default function Cockpit() {
  const clock = useClock();
  const m = useMetrics();
  const rows = useWardMetrics();
  const approvals = useStore((s) => s.approvals);
  const quotes = useStore((s) => s.quotesApproved);
  const gifts = useStore((s) => s.gifts);
  const [sc, setSc] = useState<ScenarioKey>('contested');
  const wk = Math.max(1, Math.min(13, weekOf(clock.date)));
  const w = WEEKS[wk - 1];
  const days = daysToElection(clock.date);
  const waiting = RELEASES.filter((r) => releaseStatus(r, clock.date, approvals) === 'awaiting').slice(0, 4);
  const pending = QUOTES.filter((q) => !q.approved && !quotes[q.id]);
  const path = pathToSeat(sc);
  const S = SCENARIOS[sc];
  const myGifts = gifts.reduce((a, g) => a + g.amount, 0);
  const upcoming = EVENTS.filter((e) => e.date >= clock.date && e.kind !== 'milestone').slice(0, 4);
  const foundingDone = Math.min(25, m.giving.founding);

  const tm = useMemo(
    () => rows.map((r) => ({ label: r.ward.name, value: r.ward.pus, color: ramp(r.readiness), href: `/ops/ward/${r.ward.slug}`, sub: `${r.readiness}%` })),
    [rows],
  );

  return (
    <>
      <PageHead
        title={<span className="row gap14"><Portrait size={46} />Good day, Chief Barr. Dumo</span>}
        sub={<>Week {wk} · <b>{w.issue}</b>. {days > 0 ? `${days} days to ${ELECTION.label}.` : 'Election Day.'}</>}
        actions={<Link href="/ops/approvals" className="btn">Approvals{waiting.length ? ` (${waiting.length})` : ''}</Link>}
      />

      <div className="grid g4 keep2">
        <Card><Stat label="Days to the election" value={Math.max(0, days)} sub={ELECTION.label} prov="plan" /></Card>
        <Card><Stat label="Releases published" value={m.releases} unit="planned" sub="Publication schedule pending" prov="sample" /></Card>
        <Card><Stat label="People on the registry" value={num(m.signups + 0)} sub={`${num(m.optIn)} opted in to SMS`} prov="sample" /></Card>
        <Card><Stat label="Given by Rivers" value={nairaShort(m.giving.amount + myGifts)} sub={`${num(m.giving.count + gifts.length)} gifts · ${nairaShort(m.giving.thisWeek + myGifts)} so far this week`} prov="sample" /></Card>
      </div>

      <div className="grid g21 mt16">
        <div className="col gap14">
          <Card title="Needs you" right={<Chip tone={waiting.length || pending.length ? 'red' : undefined}>{waiting.length + pending.length} open</Chip>}>
            {waiting.length === 0 && pending.length === 0 && <p className="small muted">Nothing is waiting for you. Everything scheduled has been approved.</p>}
            {waiting.map((r) => (
              <div className="li" key={r.id}>
                <div className="tm">{dayLabel(r.date)}</div>
                <div className="sp">
                  <div className="b small">{r.headline}</div>
                  <div className="tiny muted">{r.paper} · {r.type}{r.hasDraft ? ' · full draft ready' : ''}</div>
                </div>
                <div className="row gap6">
                  <button className="btn sm" onClick={() => setState((s) => ({ approvals: { ...s.approvals, [r.id]: 'approved' } }))}>Approve</button>
                  <button className="btn ghost sm" onClick={() => setState((s) => ({ approvals: { ...s.approvals, [r.id]: 'held' } }))}>Hold</button>
                </div>
              </div>
            ))}
            {pending.slice(0, 2).map((q) => (
              <div className="li" key={q.id}>
                <div className="tm">Quote</div>
                <div className="sp"><div className="small">“{q.text}”</div><div className="tiny muted">Proposed in a release. Not used until you approve.</div></div>
                <button className="btn sm" onClick={() => setState((s) => ({ quotesApproved: { ...s.quotesApproved, [q.id]: true } }))}>Approve</button>
              </div>
            ))}
            <div className="li">
              <div className="tm">This week</div>
              <div className="sp"><div className="b small">We need from you: {w.need}</div><div className="tiny muted">For {w.tag}, Week {w.n}</div></div>
            </div>
            <div className="li">
              <div className="tm">Calls</div>
              <div className="sp">
                <div className="b small">Founding donors: your first 25 calls</div>
                <div className="row gap8 mt4"><div className="sp"><Bar pct={(foundingDone / 25) * 100} /></div><span className="small b">{foundingDone} of 25</span></div>
              </div>
              <Sample />
            </div>
          </Card>

          <Card title="The ground at a glance" right={<Link href="/ops/structure" className="small b">Open structure →</Link>}>
            <div className="grid g3 keep2" style={{ marginBottom: 12 }}>
              <Stat label="Coordinators named" value={m.coordinators} unit="of 319" prov="sample" />
              <Stat label="Captains approved" value={m.agents} unit={`of ~${PU_TARGET}`} prov="sample" />
              <Stat label="Unit coverage" value={`${Math.round(m.coverage * 100)}%`} sub="Target: a captain in every unit" prov="sample" />
            </div>
            <Treemap items={tm} w={760} h={250} />
            <div className="row gap8 wrap tiny muted mt8">
              <span>Tile size = polling units · colour = ward readiness:</span>
              {[85, 70, 55, 40, 25, 0].map((p) => (<span key={p} className="row gap4"><i style={{ width: 11, height: 11, borderRadius: 3, background: ramp(p), display: 'inline-block' }} />{p ? `${p}+` : 'under 25'}</span>))}
            </div>
          </Card>
        </div>

        <div className="col gap14">
          <Card title="The arithmetic of the seat" right={<Prov k="plan" />}>
            <p className="small muted">No vote scenarios supplied.</p>
            <StackBar parts={[{ v: S.pdp, color: 'var(--green)', label: 'NDC' }, { v: S.apc, color: 'var(--red)', label: 'APC' }, { v: S.ndc, color: 'var(--blue)', label: 'Other parties' }, { v: S.other, color: '#b9c4bd', label: 'Others' }]} h={18} />
            <div className="grid g2 keep2 mt12" style={{ gap: 8 }}>
              <Stat label="NDC (Lulu Briggs)" value={num(S.pdp)} />
              <Stat label="APC" value={num(S.apc)} />
            </div>
            <p className="small mt12">No campaign vote forecast has been supplied. Scenario totals are unavailable until the campaign provides an approved model.</p>
            <p className="tiny muted mt8">Vote forecasts are not configured. This preview does not include historical Rivers polling-unit or voter-register figures.</p>
          </Card>

          <Card title="This week’s One Push" right={<Chip tone="blue">{w.tag}</Chip>}>
            <div className="tl">
              {[['10:00', 'The call release in ThisDay'], ['17:00', 'WhatsApp kit to champions'], ['18:30', 'Ward SMS, 319 wards'], ['19:00', 'The trend under the tag'], ['20:00', 'Give hour'], ['21:30', 'Thank-you post']].map(([t, x]) => (
                <div key={t}><b className="small">{t}</b> <span className="small">{x}</span></div>
              ))}
            </div>
            <div className="small muted">No approved campaign giving target has been supplied.</div>
          </Card>

          <Card title="Coming up">
            {upcoming.map((e) => (
              <div className="li" key={e.id} style={{ padding: '8px 0' }}>
                <div className="tm" style={{ width: 74 }}>{dayLabel(e.date)}</div>
                <div className="small"><b>{e.title}</b><div className="tiny muted">{e.time ?? ''} {e.time ? '· ' : ''}{e.where}</div></div>
              </div>
            ))}
            <Link href="/ops/events" className="small b">All events →</Link>
          </Card>
        </div>
      </div>

      <div className="grid g3 mt16">
        <Card title="Heard"><div className="grid g2 keep2"><Stat label="Help Desk cases" value={num(m.deskOpened)} sub={`${num(m.deskOnTime)} answered in 5 days`} prov="sample" /><Stat label="Live viewers (avg)" value={num(m.liveViewers)} sub={`${m.liveSessions} of 12 lives`} prov="sample" /></div></Card>
        <Card title="Reached"><div className="grid g2 keep2"><Stat label="Last trend reach" value={num(m.trendReach)} sub={m.trendPeak ? `Peak #${m.trendPeak} in Nigeria` : 'First trend Thu 22 Oct'} prov="sample" /><Stat label="SMS delivered" value={num(m.smsDelivered)} sub={m.gate0 ? `${m.smsOptOutPct}% opt-outs` : 'Gate 0 not yet cleared'} prov="sample" /></div></Card>
        <Card title="Skilled"><div className="grid g2 keep2"><Stat label="Academy registered" value={num(m.academy)} prov="sample" /><Stat label="Completed" value={num(m.academyDone)} prov="sample" /></div></Card>
      </div>
    </>
  );
}
