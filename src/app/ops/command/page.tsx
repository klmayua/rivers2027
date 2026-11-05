'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Bar, Card, Chip, PageHead, Prov, Stat } from '@/components/ui';
import { Donut } from '@/components/charts';
import { ELECTION, MONEY } from '@/data/campaign';
import { GATES, RISKS } from '@/data/governance';
import { RELEASES, WEEKS } from '@/data/weeks';
import { daysToElection, weekOf } from '@/lib/clock';
import { dayLabel, nairaShort, num } from '@/lib/format';
import { useClock, useMetrics, useWardMetrics } from '@/lib/hooks';
import { COORDINATORS_TARGET, PU_TARGET, WEEKLY_GOAL, ledger } from '@/lib/model';
import { releaseStatus, REL_LABEL } from '@/lib/releases';
import { useStore } from '@/lib/store';

export default function Command() {
  const clock = useClock();
  const m = useMetrics();
  const rows = useWardMetrics();
  const approvals = useStore((s) => s.approvals);
  const tickets = useStore((s) => s.tickets);
  const scen = useStore((s) => s.givingScenario);
  const launch = useStore((s) => s.launchAgreed);
  const contribution = useStore((s) => s.contribution);
  const opening = useStore((s) => s.openingSpend);
  const wk = Math.max(1, Math.min(13, weekOf(clock.date)));
  const w = WEEKS[wk - 1];
  const days = daysToElection(clock.date);
  const thisWeek = RELEASES.filter((r) => r.week === wk);
  const led = useMemo(() => ledger(clock.date, { launch, contribution, opening, scen }), [clock.date, launch, contribution, opening, scen]);
  const flags = rows.filter((r) => r.flag).sort((a, b) => a.readiness - b.readiness).slice(0, 6);
  const cleared = GATES.filter((g) => g.clears <= clock.date);
  const open = GATES.filter((g) => g.clears > clock.date);
  const high = RISKS.filter((r) => r.level === 'high');
  const capPct = ELECTION.cap ? (led.total / ELECTION.cap) * 100 : 0;
  const readiness = Math.round(rows.reduce((a, r) => a + r.readiness, 0) / rows.length);

  return (
    <>
      <PageHead
        title="Command room"
        sub={<>Week {wk}: <b>{w.issue}</b>. {days > 0 ? `${days} days to the election.` : 'Election Day.'} One page for the plan, the gates, the risks and every desk.</>}
        actions={<><Link href="/ops/scorecard" className="btn sec">Friday scorecard</Link><Link href="/ops/plan" className="btn">13-week plan</Link></>}
      />

      <div className="grid g4 keep2">
        <Card><Stat label="Ward readiness" value={`${readiness}%`} sub="Average of 319 wards" prov="sample" /></Card>
        <Card><Stat label="Coordinators named" value={m.coordinators} unit={`of ${COORDINATORS_TARGET}`} sub="Team structure pending confirmation" prov="sample" /></Card>
        <Card><Stat label="Captains approved" value={m.agents} unit={`of ${PU_TARGET}`} sub={`${Math.round(m.coverage * 100)}% of units covered (illustrative)`} prov="sample" /></Card>
        <Card><Stat label="Cap used" value={`${capPct.toFixed(1)}%`} unit="legal limit pending" sub={`${nairaShort(led.total)} on the ledger`} prov="sample" /></Card>
      </div>

      <div className="grid g21 mt16">
        <div className="col gap14">
          <Card title={`Week ${wk}: the five releases`} right={<Chip tone="blue">{w.tag}</Chip>}>
            {thisWeek.map((r) => {
              const st = releaseStatus(r, clock.date, approvals);
              return (
                <div className="li" key={r.id}>
                  <div className="tm">{dayLabel(r.date)}</div>
                  <div className="sp">
                    <div className="b small">{r.headline}</div>
                    <div className="tiny muted">{r.paper} · {r.type}</div>
                  </div>
                  <Chip tone={st === 'published' ? undefined : st === 'held' ? 'red' : st === 'awaiting' ? 'amber' : st === 'approved' ? 'blue' : 'gray'}>{REL_LABEL[st]}</Chip>
                </div>
              );
            })}
            <div className="small muted mt8">Needed from the candidate this week: <b>{w.need}</b>.</div>
          </Card>

          <Card title="Gates" right={<span className="small muted">{cleared.length} cleared · {open.length} open</span>}>
            <Bar pct={(cleared.length / GATES.length) * 100} />
            <div className="tw mt12">
              <table className="tbl">
                <thead><tr><th>Gate</th><th>Owner</th><th>Planned</th><th>Status</th></tr></thead>
                <tbody>
                  {GATES.map((g) => {
                    const ok = g.clears <= clock.date;
                    return (
                      <tr key={g.id}>
                        <td><span className="tiny muted">{g.group}</span><div>{g.item}{g.ver ? <span className="tiny muted"> · open item {g.ver}</span> : null}</div></td>
                        <td className="small">{g.owner}</td>
                        <td className="small">{g.due}</td>
                        <td><Chip tone={ok ? undefined : 'amber'}>{ok ? 'Cleared' : 'Open'}</Chip></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="tiny muted mt8">Clearing dates are the plan’s, shown on the preview date. Nothing is cleared in real life until counsel and the named owner confirm it.</p>
          </Card>
        </div>

        <div className="col gap14">
          <Card title="Watch list" right={<Prov k="sample" />}>
            {flags.length === 0 && <p className="small muted">No ward is flagged on this date.</p>}
            {flags.map((r) => (
              <div className="li" key={r.ward.slug} style={{ padding: '8px 0' }}>
                <div className="sp">
                  <Link href={`/ops/ward/${r.ward.slug}`} className="b small">{r.ward.name}</Link>
                  <div className="tiny muted">{r.ward.lgaName}</div>
                </div>
                <Chip tone="red">{r.flag}</Chip>
              </div>
            ))}
            <Link href="/ops/structure" className="small b">Open structure →</Link>
          </Card>

          <Card title="Top risks" right={<Link href="/ops/counsel" className="small b">All 10 →</Link>}>
            {high.map((r) => (
              <div className="li" key={r.risk} style={{ padding: '8px 0' }}>
                <div className="sp"><div className="b small">{r.risk}</div><div className="tiny muted">{r.does}</div></div>
                <Chip tone="red">High</Chip>
              </div>
            ))}
          </Card>

          <Card title="Money against the cap">
            <Donut
              legend
              size={120}
              center={`${capPct.toFixed(1)}%`}
              sub="legal limit pending"
              parts={[
                { v: led.lines.filter((l) => l.kind === 'farawa').reduce((a, l) => a + l.amount, 0), color: 'var(--green)', label: 'Platform and media' },
                { v: led.lines.filter((l) => l.kind === 'ground').reduce((a, l) => a + l.amount, 0), color: 'var(--blue)', label: 'Ground' },
                { v: led.lines.filter((l) => l.kind === 'opening').reduce((a, l) => a + l.amount, 0), color: '#b9c4bd', label: 'Spend to date' },
                { v: led.lines.filter((l) => l.kind === 'fees').reduce((a, l) => a + l.amount, 0), color: 'var(--red)', label: 'Fees' },
              ]}
            />
            <p className="tiny muted mt8">Plan: ₦1.5m launch + 13 × ₦850,000 = ₦{num(MONEY.total)}. Ground costs and the opening balance are sample figures.</p>
          </Card>

          <Card title="Desks this week">
            <div className="grid g2 keep2">
              <Stat label="Help Desk" value={num(m.deskOpened + tickets.length)} sub={`${m.deskOpened ? Math.round((m.deskOnTime / m.deskOpened) * 100) : 100}% answered in 5 days`} prov="sample" />
              <Stat label="Giving this week so far" value={nairaShort(m.giving.thisWeek)} sub={`Weekly goal ₦${num(WEEKLY_GOAL)}`} prov="sample" />
              <Stat label="Reports from agents" value={num(m.reports)} prov="sample" />
              <Stat label="SMS opt-outs" value={m.pushes ? `${m.smsOptOutPct}%` : '–'} sub="Pause at 2%" prov="sample" />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
