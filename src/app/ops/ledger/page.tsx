'use client';

import { useMemo } from 'react';
import { Bar, Card, Chip, Note, PageHead, Prov, Stat } from '@/components/ui';
import { Donut } from '@/components/charts';
import { ELECTION, MONEY } from '@/data/campaign';
import { dayLabel, naira, nairaShort } from '@/lib/format';
import { useClock } from '@/lib/hooks';
import { ledger } from '@/lib/model';
import { setState, useStore } from '@/lib/store';

const KIND: Record<string, string> = { farawa: 'Platform and media', ground: 'Ground', fees: 'Payment fees', opening: 'Opening balance' };

export default function Ledger() {
  const clock = useClock();
  const scen = useStore((s) => s.givingScenario);
  const launch = useStore((s) => s.launchAgreed);
  const contribution = useStore((s) => s.contribution);
  const opening = useStore((s) => s.openingSpend);
  const showPricing = useStore((s) => s.showVendorPricing);
  const led = useMemo(() => ledger(clock.date, { launch, contribution, opening, scen }), [clock.date, launch, contribution, opening, scen]);
  const pct = ELECTION.cap ? (led.total / ELECTION.cap) * 100 : 0;
  const by = (k: string) => led.lines.filter((l) => l.kind === k).reduce((a, l) => a + l.amount, 0);
  const headroom = ELECTION.cap ? ELECTION.cap - led.total : 0;
  const planTotal = MONEY.total;

  return (
    <>
      <PageHead
        title="Cap ledger"
        sub={<>Campaign spending limit and accounting start date are pending legal review. No campaign budget was supplied.</>}
        prov={['plan', 'sample']}
      />
      <div className="grid g4 keep2">
        <Card><Stat label="On the ledger" value={nairaShort(led.total)} sub={`${pct.toFixed(1)}% of the cap`} prov="sample" /></Card>
        <Card><Stat label="Headroom" value={nairaShort(headroom)} sub="Before any non-listed spend" prov="derived" /></Card>
        <Card><Stat label="Platform and media (plan)" value={nairaShort(planTotal)} sub="₦1.5m + 13 × ₦850,000" prov="plan" /></Card>
        <Card><Stat label="Entries" value={led.lines.length} sub={`as at ${dayLabel(clock.date)}`} /></Card>
      </div>

      <div className="grid g21 mt16">
        <Card title="Ledger" right={<Chip>{showPricing ? 'Vendor prices shown' : 'Vendor prices hidden'}</Chip>}>
          <Bar pct={pct} tone={pct > 80 ? 'red' : undefined} />
          <div className="tw mt12">
            <table className="tbl">
              <thead><tr><th>Date</th><th>Entry</th><th>Type</th><th className="num">Amount</th></tr></thead>
              <tbody>
                {led.lines.map((l, i) => {
                  const hide = !showPricing && l.kind === 'farawa';
                  return (
                    <tr key={l.date + l.label + i}>
                      <td className="small" style={{ whiteSpace: 'nowrap' }}>{dayLabel(l.date)}</td>
                      <td className="small">{l.label}{l.note && <div className="tiny muted">{l.note}</div>}</td>
                      <td className="small">{KIND[l.kind]} <Prov k={l.prov} /></td>
                      <td className="num">{hide ? 'On request' : naira(l.amount)}</td>
                    </tr>
                  );
                })}
                <tr className="tot"><td colSpan={3}>Total</td><td className="num">{naira(led.total)}</td></tr>
              </tbody>
            </table>
          </div>
        </Card>

        <div className="col gap14">
          <Card title="Where it goes">
            <Donut legend size={130} center={`${pct.toFixed(1)}%`} sub="of the cap" parts={[
              { v: by('farawa'), color: 'var(--green)', label: 'Platform and media' },
              { v: by('ground'), color: 'var(--blue)', label: 'Ground' },
              { v: by('opening'), color: '#b9c4bd', label: 'Opening balance' },
              { v: by('fees'), color: 'var(--red)', label: 'Fees' },
            ]} />
          </Card>

          <Card title="Finance officer inputs" right={<Prov k="sample" />}>
            <label className="fld">Opening balance: spend since 13 Feb 2026
              <input type="number" min={0} step={100000} value={opening} onChange={(e) => setState({ openingSpend: Math.max(0, Number(e.target.value) || 0) })} />
              <span className="h">Placeholder until the finance officer enters the actual figure.</span>
            </label>
            <label className="fld mt12">Agreed launch price (list: ₦1,500,000)
              <input type="number" min={0} step={50000} value={launch} onChange={(e) => setState({ launchAgreed: Math.max(0, Number(e.target.value) || 0) })} />
            </label>
            <label className="fld mt12">Gift in kind against the launch price
              <input type="number" min={0} step={50000} value={contribution} onChange={(e) => setState({ contribution: Math.max(0, Math.min(launch, Number(e.target.value) || 0)) })} />
              <span className="h">Recorded at full value either way. Counsel to confirm treatment and disclosure.</span>
            </label>
            <label className="chk mt12"><input type="checkbox" checked={showPricing} onChange={(e) => setState({ showVendorPricing: e.target.checked })} /> Show vendor prices on this screen</label>
          </Card>
          <Note tone="warn">Ground costs, SMS airtime, Paystack fees and the opening balance are illustrative. The real ledger is fed by the finance officer and, once live, by each gift automatically.</Note>
        </div>
      </div>
    </>
  );
}
