'use client';

import { Card, Legend, PageHead, Prov } from '@/components/ui';
import { GO_LIVE, REGISTER } from '@/data/governance';

export default function Assumptions() {
  return (
    <div className="show-src">
      <PageHead
        title="Real, plan, sample"
        sub="An honest register of what in this preview is sourced, what is the plan’s own target, what is illustrative, and what changes when the platform goes live. Nothing here is a forecast."
      />
      <Card><Legend /></Card>

      <div className="grid g2 mt16">
        <Card title="Real and sourced" right={<Prov k="inec" />}>
          <ul className="small" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 7 }}>{REGISTER.real.map((x) => <li key={x}>{x}</li>)}</ul>
        </Card>
        <Card title="The plan’s own terms" right={<Prov k="plan" />}>
          <ul className="small" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 7 }}>{REGISTER.plan.map((x) => <li key={x}>{x}</li>)}</ul>
        </Card>
        <Card title="Sample: illustrative only" right={<Prov k="sample" />}>
          <ul className="small" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 7 }}>{REGISTER.sample.map((x) => <li key={x}>{x}</li>)}</ul>
        </Card>
        <Card title="Gaps and things to confirm" tone="red">
          <ul className="small" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 7 }}>{REGISTER.gaps.map((x) => <li key={x}>{x}</li>)}</ul>
        </Card>
      </div>

      <Card title="From this preview to go-live" className="mt16">
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>Piece</th><th>In this preview</th><th>At go-live</th></tr></thead>
            <tbody>
              {GO_LIVE.map((g) => <tr key={g.piece}><td className="b small">{g.piece}</td><td className="small">{g.demo}</td><td className="small">{g.live}</td></tr>)}
            </tbody>
          </table>
        </div>
        <p className="tiny muted mt8">This preview has no backend. Anything a visitor does is kept in their own browser and can be cleared from Preview settings.</p>
      </Card>
    </div>
  );
}
