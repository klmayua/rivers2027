'use client';

import { Card, Chip, PageHead } from '@/components/ui';
import { AGENT_RULES, GROUND_RULES } from '@/data/campaign';
import { GATES, RISKS, VER } from '@/data/governance';
import { useClock } from '@/lib/hooks';
import { setState, useStore } from '@/lib/store';

const GROUPS = ['Gate 0: SMS', 'Giving', 'Ground', 'Brand'] as const;
const NEXT = { open: 'working', working: 'closed', closed: 'open' } as const;
const LABEL = { open: 'Open', working: 'In hand', closed: 'Closed' } as const;

export default function Counsel() {
  const clock = useClock();
  const ver = useStore((s) => s.ver);
  return (
    <>
      <PageHead title="Gates and counsel" sub="What must clear before each part of the plan goes live, the open legal and factual questions, and the ground rules every channel follows." prov={['plan']} />

      <div className="grid g2">
        {GROUPS.map((grp) => (
          <Card key={grp} title={grp}>
            {GATES.filter((g) => g.group === grp).map((g) => {
              const ok = g.clears <= clock.date;
              return (
                <div className="li" key={g.id}>
                  <div className="sp small">{g.item}<div className="tiny muted">{g.owner} · due {g.due}{g.ver ? ` · open item ${g.ver}` : ''}</div></div>
                  <Chip tone={ok ? undefined : 'amber'}>{ok ? 'Cleared' : 'Open'}</Chip>
                </div>
              );
            })}
          </Card>
        ))}
      </div>

      <Card title="Open items to verify" className="mt16" right={<span className="small muted">Tap a status to move it on. Kept in this browser.</span>}>
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>#</th><th>Question</th><th>Why it matters</th><th>Status</th></tr></thead>
            <tbody>
              {VER.map((v) => {
                const st = ver[String(v.n)] ?? 'open';
                return (
                  <tr key={v.n}>
                    <td className="b">{v.n}</td>
                    <td className="small">{v.item}</td>
                    <td className="small">{v.why}</td>
                    <td><button className="btn ghost sm" onClick={() => setState((s) => ({ ver: { ...s.ver, [String(v.n)]: NEXT[st] } }))}>{LABEL[st]}</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="tiny muted mt8">All {VER.length} open items from the plan. Several also appear as gates above (INEC numbers, Paystack, places of worship, agent deadline).</p>
      </Card>

      <div className="grid g2 mt16">
        <Card title="Risks">
          {RISKS.map((r) => (
            <div className="li" key={r.risk}>
              <div className="sp small"><b>{r.risk}</b><div className="tiny muted">{r.real}</div><div className="tiny">What we do: {r.does}</div></div>
              <Chip tone={r.level === 'high' ? 'red' : r.level === 'med' ? 'amber' : 'gray'}>{r.level === 'high' ? 'High' : r.level === 'med' ? 'Medium' : 'Low'}</Chip>
            </div>
          ))}
        </Card>
        <div className="col gap14">
          <Card title="Ground rules">
            {GROUND_RULES.map((r) => <div className="li" key={r.n} style={{ padding: '8px 0' }}><div className="k">{r.n}</div><div className="small"><b>{r.title}.</b> {r.body}</div></div>)}
          </Card>
          <Card title="Rules for agents">
            <ul className="small" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>{AGENT_RULES.map((r) => <li key={r}>{r}</li>)}</ul>
          </Card>
        </div>
      </div>
    </>
  );
}
