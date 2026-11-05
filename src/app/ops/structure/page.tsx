'use client';
import Link from 'next/link';
import { useWardMetrics } from '@/lib/hooks';
import { lgaTotals } from '@/lib/model';
import { LGA_LIST } from '@/data/geo';
import { Card, Note, PageHead, Stat } from '@/components/ui';
import { WardTable } from '@/components/ward-table';
import { Treemap, ramp } from '@/components/charts';
import { num } from '@/lib/format';
export default function Structure() {
  const rows = useWardMetrics();
  const tm = rows.map((row) => ({ label: row.ward.name, value: row.ward.pus, color: ramp(row.readiness), href: '/ops/ward/' + row.ward.slug, sub: row.ward.pus + ' units' }));
  return <><PageHead title="Rivers State structure" sub="23 local government areas, 319 wards and 6,866 polling units. Polling-unit names are from the supplied INEC-derived geography source; registered-voter counts are not supplied." />
    <div className="grid g2">{LGA_LIST.map((lga) => { const totals = lgaTotals(rows, lga.key); return <Card key={lga.key} title={lga.name} right={<Link href={'/ops/lga/' + lga.key} className="small b">Open desk →</Link>}>
      <div className="grid g3 keep2"><Stat label="Wards" value={lga.wards} prov="inec" /><Stat label="Polling units" value={lga.pus} prov="inec" /><Stat label="Registered voters" value="Not supplied" prov="sample" /><Stat label="Coordinators named" value={totals.named} unit={'of ' + lga.wards} prov="sample" /><Stat label="Captain coverage" value={Math.round(totals.coverage * 100) + '%'} prov="sample" /><Stat label="Readiness" value={totals.readiness + '%'} prov="sample" /></div>
    </Card>; })}</div>
    <div className="mt12"><Note tone="warn">The supplied source includes polling-unit names and counts only. Registered-voter totals and live campaign coverage are not official data.</Note></div>
    <Card title="319 wards at a glance" className="mt16"><Treemap items={tm} w={900} h={320} /></Card>
    <Card title="All wards" className="mt16"><WardTable rows={rows} /></Card>
  </>;
}
