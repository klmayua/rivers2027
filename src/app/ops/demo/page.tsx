'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, Chip, Note, PageHead } from '@/components/ui';
import { startTour } from '@/components/shell';
import { TOUR } from '@/data/tour';
import { SCENARIOS, type ScenarioKey } from '@/data/campaign';
import { CLOCKS, type ClockKey } from '@/lib/clock';
import { num } from '@/lib/format';
import { resetDemo, setState, useStore, type GivingScenario } from '@/lib/store';

const GIVING: Array<[GivingScenario, string, string]> = [
  ['cautious', 'Cautious', 'Half the base weekly giving'],
  ['base', 'Base', 'The plan’s trajectory'],
  ['strong', 'Strong', 'About 45% above base'],
];

export default function PreviewSettings() {
  const router = useRouter();
  const st = useStore((s) => s);
  const counts = {
    gifts: st.gifts.length,
    tickets: st.tickets.length,
    signups: st.signups.length,
    reports: st.reports.length,
    sheets: st.sheets.length,
    approvals: Object.keys(st.approvals).length,
  };
  const touched = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <PageHead title="Preview settings" sub="Move the campaign date, change the scenarios, show where each figure comes from, or run the guided walkthrough. These controls are for reviewers and presenters." actions={<button className="btn" onClick={() => startTour(router, 0)}>Start the {TOUR.length}-stop walkthrough</button>} />

      <div className="grid g2">
        <Card title="Preview date" right={<Chip>{CLOCKS.find((c) => c.key === st.clock)?.short}</Chip>}>
          <p className="small muted mb8">Every running count (gifts, sign-ups, releases, agents) moves with this date. The election dates never move.</p>
          <div className="col gap8">
            {CLOCKS.map((c) => (
              <label key={c.key} className="chk" style={{ padding: '4px 0' }}>
                <input type="radio" name="clock" checked={st.clock === c.key} onChange={() => setState({ clock: c.key as ClockKey })} />
                <span><b className="small">{c.label}</b><br /><span className="tiny muted">{c.note}</span></span>
              </label>
            ))}
          </div>
        </Card>

        <div className="col gap14">
          <Card title="Data sources">
            <div className="seg" role="group" aria-label="Show data sources">
              <button aria-pressed={!st.showSources} onClick={() => setState({ showSources: false })}>Hidden</button>
              <button aria-pressed={st.showSources} onClick={() => setState({ showSources: true })}>Shown</button>
            </div>
            <p className="tiny muted mt8">Shown: every figure carries a chip saying whether it is INEC, reported, plan, derived or sample. <Link href="/ops/assumptions">The full register →</Link></p>
          </Card>
          <Card title="Giving scenario">
            <div className="seg" role="group" aria-label="Giving scenario">
              {GIVING.map(([k, l]) => <button key={k} aria-pressed={st.givingScenario === k} onClick={() => setState({ givingScenario: k })}>{l}</button>)}
            </div>
            <p className="tiny muted mt8">{GIVING.find((g) => g[0] === st.givingScenario)?.[2]}. Illustrative figures.</p>
          </Card>
          <Card title="Election Day scenario">
            <div className="seg" role="group" aria-label="Election scenario">
              {(Object.keys(SCENARIOS) as ScenarioKey[]).map((k) => <button key={k} aria-pressed={st.electionScenario === k} onClick={() => setState({ electionScenario: k })}>{SCENARIOS[k].label}</button>)}
            </div>
            <p className="tiny muted mt8">NDC {num(SCENARIOS[st.electionScenario].pdp)} · APC {num(SCENARIOS[st.electionScenario].apc)}. Used by the cockpit and the Election Day room.</p>
          </Card>
          <Card title="Another role">
            <p className="small muted">See the platform from another seat: sign in as a different role.</p>
            <Link href="/signin" className="btn sec sm mt8">Switch role</Link>
          </Card>
        </div>
      </div>

      <Card title="What has been done in this browser" className="mt16" right={<button className="btn red sm" onClick={() => resetDemo(true)}>Clear it</button>}>
        <div className="row gap8 wrap">
          <Chip tone="gray">{counts.gifts} gifts</Chip>
          <Chip tone="gray">{counts.tickets} Help Desk questions</Chip>
          <Chip tone="gray">{counts.signups} sign-ups</Chip>
          <Chip tone="gray">{counts.reports} ground reports</Chip>
          <Chip tone="gray">{counts.sheets} result sheets</Chip>
          <Chip tone="gray">{counts.approvals} approvals</Chip>
        </div>
        <p className="tiny muted mt8">{touched ? 'Everything above is kept in this browser only and shows up on the desks that would receive it.' : 'Nothing yet. Make a gift, ask a question or send a report and it appears on the desks.'}</p>
      </Card>

      <div className="mt12"><Note>This is a preview build with no backend and no payment processing: everything is kept in the browser. <Link href="/ops/assumptions">What is real, plan and sample →</Link></Note></div>
    </>
  );
}
