'use client';

import { useMemo } from 'react';
import { Card, Chip, PageHead, Prov } from '@/components/ui';
import { ELECTION, SCORECARD } from '@/data/campaign';
import { daysToElection, weekOf } from '@/lib/clock';
import { naira, num } from '@/lib/format';
import { useClock, useMetrics } from '@/lib/hooks';
import { WEEKLY_GOAL, ledger } from '@/lib/model';
import { useStore } from '@/lib/store';

type Row = { area: string; count: string; target: string; now: string; ok: boolean | null };

export default function Scorecard() {
  const clock = useClock();
  const m = useMetrics();
  const scen = useStore((s) => s.givingScenario);
  const launch = useStore((s) => s.launchAgreed);
  const contribution = useStore((s) => s.contribution);
  const opening = useStore((s) => s.openingSpend);
  const wk = Math.max(1, Math.min(13, weekOf(clock.date)));
  const led = useMemo(() => ledger(clock.date, { launch, contribution, opening, scen }), [clock.date, launch, contribution, opening, scen]);
  const days = daysToElection(clock.date);
  const lastWeek = m.giving.weekly.length > 1 ? m.giving.weekly[m.giving.weekly.length - 2] : 0;

  const now: Record<string, { now: string; ok: boolean | null }> = {
    Press: { now: `${m.releases} released`, ok: m.d >= 0 ? true : null },
    Trend: { now: m.trendReach ? `Reach ${num(m.trendReach)} · peak #${m.trendPeak}` : 'Not yet', ok: m.trendReach ? m.trendPeak <= 20 : null },
    SMS: { now: m.pushes ? `${num(m.smsDelivered)} delivered · ${num(m.smsClicks)} clicks · ${m.smsOptOutPct}% opt-outs` : m.gate0 ? 'Gate 0 cleared' : 'Locked until Gate 0', ok: m.pushes ? m.smsOptOutPct < 2 : null },
    'Sign-ups': { now: `${num(m.signups)} (${num(m.optIn)} SMS opt-in)`, ok: m.signups > 0 ? true : null },
    Giving: { now: `${num(m.giving.count)} gifts · last full week ${lastWeek ? naira(lastWeek) : '–'} (${lastWeek ? Math.round((lastWeek / WEEKLY_GOAL) * 100) : 0}% of goal)`, ok: lastWeek ? lastWeek >= WEEKLY_GOAL * 0.5 : null },
    Academy: { now: `${num(m.academy)} registered · ${num(m.academyDone)} completed`, ok: m.academy > 0 ? true : null },
    'Live events': { now: `${m.liveSessions} lives · ${num(m.liveViewers)} viewers · ${num(m.liveQuestions)} questions`, ok: m.liveSessions > 0 ? true : null },
    'Help Desk': { now: `${num(m.deskOpened)} opened · ${m.deskOpened ? Math.round((m.deskOnTime / m.deskOpened) * 100) : 100}% in 5 days`, ok: m.deskOpened ? m.deskOnTime / m.deskOpened >= 0.9 : null },
    'Agents’ app': { now: `${num(m.agents)} approved · ${num(m.reports)} reports`, ok: m.agents > 0 ? true : null },
    'Cap ledger': { now: ELECTION.cap ? `${naira(led.total)} of ${naira(ELECTION.cap)} (${((led.total / ELECTION.cap) * 100).toFixed(1)}%)` : 'Legal limit pending review', ok: false },
  };

  const rows: Row[] = SCORECARD.map((s) => ({ area: s.area, count: s.count, target: s.target, now: now[s.area]?.now ?? '–', ok: now[s.area]?.ok ?? null }));
  const okCount = rows.filter((r) => r.ok === true).length;

  return (
    <>
      <PageHead
        title="Friday scorecard"
        sub={<>Week {wk} · {days > 0 ? `${days} days to ${ELECTION.label}` : 'Election Day'}. Ten areas, one page. The candidate approves the next week against it.</>}
        actions={<button className="btn sec" onClick={() => window.print()}>Print or save as PDF</button>}
        prov={['sample']}
      />
      <Card>
        <div className="row gap8 wrap mb12">
          <Chip tone={okCount >= 8 ? undefined : 'amber'}>{okCount} of {rows.length} on track</Chip>
          <span className="small muted">“Set on 1 November” targets are agreed at the day-14 review.</span>
        </div>
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>Area</th><th>What we count</th><th>Target</th><th>Now</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.area}>
                  <td className="b">{r.area}</td>
                  <td className="small">{r.count}</td>
                  <td className="small">{r.target}</td>
                  <td className="small">{r.now} <Prov k="sample" /></td>
                  <td><Chip tone={r.ok === null ? 'gray' : r.ok ? undefined : 'red'}>{r.ok === null ? 'Not started' : r.ok ? 'On track' : 'Watch'}</Chip></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
