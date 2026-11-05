'use client';

import Link from 'next/link';
import { Card, Chip, PageHead } from '@/components/ui';
import { ASK_LADDER, LAUNCH_LINES, MONEY, WEEKLY_LINES } from '@/data/campaign';
import { ONE_PUSH, PAPERS, WEEKS, WEEK_RHYTHM } from '@/data/weeks';
import { weekOf } from '@/lib/clock';
import { naira, shortDate } from '@/lib/format';
import { useClock } from '@/lib/hooks';

export default function Plan() {
  const clock = useClock();
  const cur = weekOf(clock.date);
  return (
    <>
      <PageHead
        title="The 13-week plan"
        sub="One issue a week, told five ways in five national dailies, then trended on Thursday. Each week is approved against the Friday scorecard before it runs."
        actions={<Link href="/ops/press" className="btn sec">Press pipeline</Link>}
        prov={['plan']}
      />

      <div className="grid g21">
        <Card title="Weeks and issues">
          <div className="tw">
            <table className="tbl">
              <thead><tr><th>Wk</th><th>Dates</th><th>Issue</th><th>Tag</th><th>Needed from the candidate</th></tr></thead>
              <tbody>
                {WEEKS.map((w) => (
                  <tr key={w.n} className={w.n === cur ? 'hl' : ''}>
                    <td className="b">{w.n}</td>
                    <td className="small" style={{ whiteSpace: 'nowrap' }}>{shortDate(w.start)} to {shortDate(w.end)}</td>
                    <td>
                      <div className="b small">{w.issue}</div>
                      <div className="tiny muted">{w.record}</div>
                    </td>
                    <td><Chip tone="blue">{w.tag}</Chip></td>
                    <td className="small">{w.need}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="tiny muted mt8">Week 6 (Reported priorities) waits for the candidate’s own position; if it is late the issue swaps. The highlighted row is the current week.</p>
        </Card>

        <div className="col gap14">
          <Card title="Five papers, five jobs">
            {PAPERS.map((p) => (
              <div className="li" key={p.day} style={{ padding: '8px 0' }}>
                <div className="tm" style={{ width: 82 }}>{p.day}</div>
                <div className="small"><b>{p.paper}</b>: {p.type}<div className="tiny muted">{p.body}</div></div>
              </div>
            ))}
          </Card>
          <Card title="Weekly rhythm">
            {WEEK_RHYTHM.map((r) => (
              <div className="li" key={r.day} style={{ padding: '8px 0' }}>
                <div className="tm" style={{ width: 82 }}>{r.day}</div>
                <div className="small">{r.what}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <div className="grid g2 mt16">
        <Card title="The Thursday One Push">
          <div className="tl">
            {ONE_PUSH.map((s) => (
              <div key={s.t}><b className="small">{s.t}</b> <b className="small">{s.head}</b><div className="tiny muted">{s.body}</div></div>
            ))}
          </div>
        </Card>
        <Card title="What it costs (plan)" right={<Chip>{naira(MONEY.total)} over 13 weeks</Chip>}>
          <div className="small b">Launch {naira(MONEY.launch)}</div>
          {LAUNCH_LINES.map((l) => (
            <div className="li" key={l.label} style={{ padding: '6px 0' }}><div className="tm" style={{ width: 40 }}>{l.pct}%</div><div className="small"><b>{l.label}</b><div className="tiny muted">{l.body}</div></div></div>
          ))}
          <div className="small b mt8">Weekly {naira(MONEY.weekly)}</div>
          {WEEKLY_LINES.map((l) => (
            <div className="li" key={l.label} style={{ padding: '6px 0' }}><div className="tm" style={{ width: 80 }}>{naira(l.amount)}</div><div className="small"><b>{l.label}</b><div className="tiny muted">{l.body}</div></div></div>
          ))}
          <p className="tiny muted mt8">These are list prices. The price actually agreed is recorded on the Cap ledger.</p>
        </Card>
      </div>

      <Card title="The ask ladder" right={<span className="small muted">Many small gifts, never a few large ones</span>} className="mt16">
        <div className="grid g3">
          {ASK_LADDER.map((a) => (
            <div key={a.amount + a.name} className="issue"><small>{a.name}</small><b>{naira(a.amount)}</b><div className="small mt4">{a.adds}</div></div>
          ))}
        </div>
      </Card>
    </>
  );
}
