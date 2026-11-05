'use client';

import { useMemo } from 'react';
import { Card, Chip, Note, PageHead, Prov, Stat } from '@/components/ui';
import { Bars } from '@/components/charts';
import { ASK_LADDER, CIRCLES } from '@/data/campaign';
import { GROUPS } from '@/data/content';
import { rngFor } from '@/lib/rng';
import { apportion, dayLabel, naira, nairaShort, num } from '@/lib/format';
import { useMetrics } from '@/lib/hooks';
import { WEEKLY_GOAL } from '@/lib/model';
import { useStore } from '@/lib/store';

const CIRCLE_WEIGHT = [0.22, 0.1, 0.12, 0.14, 0.1, 0.1, 0.14, 0.08];
const CITIES: Array<[string, number]> = [['Not reported', 1]];

export default function Giving() {
  const m = useMetrics();
  const gifts = useStore((s) => s.gifts);
  const g = m.giving;
  const mine = gifts.reduce((a, x) => a + x.amount, 0);
  const total = g.amount + mine;
  const count = g.count + gifts.length;

  const circles = useMemo(() => {
    const amt = apportion(g.amount, CIRCLE_WEIGHT);
    const cnt = apportion(g.count, CIRCLE_WEIGHT.map((w, i) => w * (i === 0 ? 0.12 : 1)));
    return CIRCLES.map((c, i) => ({ ...c, amount: amt[i], count: cnt[i] }));
  }, [g.amount, g.count]);

  const groups = useMemo(() => {
    const wt = GROUPS.map((x) => x.members * (0.5 + rngFor('gg:' + x.slug)()));
    const cnt = apportion(Math.round(g.count * 0.58), wt);
    return GROUPS.map((x, i) => ({ ...x, gifts: cnt[i] + gifts.filter((y) => y.group === x.slug).length })).sort((a, b) => b.gifts - a.gifts);
  }, [g.count, gifts]);

  const cities = apportion(Math.round(g.amount * 0.8), CITIES.map((c) => c[1]));

  return (
    <>
      <PageHead
        title="Trend & Give"
        sub="Giving and legal arrangements have not been supplied. Figures shown in this preview are illustrative and no payment is processed."
        prov={['sample']}
      />
      {m.d < 2 && <div className="mb12"><Note tone="warn">Giving opens on launch day, Wednesday 21 October. Move the preview date (Preview settings) to see it running.</Note></div>}

      <div className="grid g4 keep2">
        <Card><Stat label="Given by Rivers" value={nairaShort(total)} sub={`${num(count)} gifts`} prov="sample" /></Card>
        <Card><Stat label="Donors" value={num(g.donors + gifts.length)} sub={g.avg ? `Average gift ${naira(g.avg)}` : undefined} prov="sample" /></Card>
        <Card><Stat label="This week" value={nairaShort(g.thisWeek + mine)} sub={`So far this week · goal ${naira(WEEKLY_GOAL)}`} prov="plan" /></Card>
        <Card><Stat label="Founding donors" value={g.founding} unit="of 25" sub="₦100,000 and above, named only with consent" prov="sample" /></Card>
      </div>

      <div className="grid g21 mt16">
        <Card title="Weekly giving against the goal" right={<Chip>Goal {naira(WEEKLY_GOAL)}</Chip>}>
          {g.weekly.length ? <Bars values={g.weekly} labels={g.weekly.map((_, i) => `W${i + 1}`)} target={WEEKLY_GOAL} h={190} fmt={(n) => nairaShort(n)} /> : <p className="small muted">No gifts yet.</p>}
          <p className="tiny muted mt8">34 gifts of ₦25,000 pay for a whole week. The line is the weekly goal. Figures are sample.</p>
        </Card>
        <Card title="Where gifts come from" right={<Prov k="sample" />}>
          {CITIES.map((c, i) => (
            <div className="row gap8" key={c[0]} style={{ padding: '4px 0' }}>
              <span className="small sp">{c[0]}</span><span className="small b">{nairaShort(cities[i])}</span>
            </div>
          ))}
          <p className="tiny muted mt8">Donor map version 1 is due on 1 November (day-14 review).</p>
        </Card>
      </div>

      <Card title="Eight circles" className="mt16" right={<span className="small muted">Diaspora gifts: Nigerian citizens only, after counsel’s written opinion</span>}>
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>#</th><th>Circle</th><th>How it works</th><th className="num">Gifts</th><th className="num">Given</th></tr></thead>
            <tbody>
              {circles.map((c) => (
                <tr key={c.n}>
                  <td className="b">{c.n}</td>
                  <td><div className="b small">{c.name}</div><div className="tiny muted">{c.who}</div></td>
                  <td className="small">{c.how}<div className="tiny muted">First move: {c.first}</div></td>
                  <td className="num">{num(c.count)}</td>
                  <td className="num">{naira(c.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid g2 mt16">
        <Card title="Groups: counts only">
          <div className="tw">
            <table className="tbl">
              <thead><tr><th>Group</th><th>Circle</th><th className="num">Members</th><th className="num">Gifts</th></tr></thead>
              <tbody>
                {groups.map((x) => (
                  <tr key={x.slug}><td className="small"><b>{x.name}</b><div className="tiny muted">{x.place}</div></td><td className="small">{x.circle}</td><td className="num">{num(x.members)}</td><td className="num">{num(x.gifts)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="tiny muted mt8">Group names and sizes are sample. A group’s public page shows its running total of gifts and never a donor’s name.</p>
        </Card>
        <Card title={`Gifts made from this browser (${gifts.length})`}>
          {gifts.length === 0 && <p className="small muted">Open the public app and tap Give. A gift made there appears here at once, and in the ledger as a Paystack fee line.</p>}
          {gifts.map((x) => (
            <div className="li" key={x.id}>
              <div className="av">{x.initials}</div>
              <div className="sp small"><b>{naira(x.amount)}</b> · {x.tier}<div className="tiny muted">{x.ref} · {x.channel}{x.abroad ? ' · international card' : ''}{x.group ? ` · via ${x.group}` : ''}</div></div>
              <span className="tiny muted">{dayLabel(x.at.slice(0, 10))}</span>
            </div>
          ))}
          <div className="note mt12">Preview checkout only. No money moves and no card is charged.</div>
        </Card>
      </div>

      <Card title="The ask ladder" className="mt16">
        <div className="grid g3">
          {ASK_LADDER.map((a) => <div key={a.amount + a.name} className="issue"><small>{a.name}</small><b>{naira(a.amount)}</b><div className="small mt4">{a.adds}</div></div>)}
        </div>
      </Card>
    </>
  );
}
