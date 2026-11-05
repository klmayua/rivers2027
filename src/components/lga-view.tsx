'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { Card, Chip, Note, PageHead, Prov, Stat } from './ui';
import { Treemap, ramp } from './charts';
import { WardTable } from './ward-table';
import { LGAS, type LgaKey } from '@/data/geo';
import { EVENTS, EVENT_KIND, STAKEHOLDERS } from '@/data/content';
import { dayLabel, num } from '@/lib/format';
import { useClock, useWardMetrics } from '@/lib/hooks';
import { lgaTotals } from '@/lib/model';



export function LgaView({ lga }: { lga: LgaKey }) {
  const L = LGAS[lga];
  const clock = useClock();
  const rows = useWardMetrics();
  const t = useMemo(() => lgaTotals(rows, lga), [rows, lga]);
  const events = EVENTS.filter((e) => e.date >= clock.date && (e.lga === lga) && e.kind === 'town').slice(0, 5);
  const people = STAKEHOLDERS.filter((s) => s.area === lga);
  const tm = t.rows.map((r) => ({ label: r.ward.name, value: r.ward.pus, color: ramp(r.readiness), href: `/ops/ward/${r.ward.slug}`, sub: `${r.readiness}%` }));
  const flagged = t.rows.filter((r) => r.flag);

  return (
    <>
      <PageHead
        title={`${L.name}: LGA desk`}
        sub={<>Headquarters {L.hq} · INEC code {L.code} · {t.rows.length} wards. Coverage, readiness and local events for the LGA coordinator.</>}
        actions={<Link href="/ops/structure" className="btn sec">All LGAs</Link>}
      />

      <div className="grid g4 keep2">
        <Card><Stat label="Polling units" value={t.pus} prov={L.pusProv === 'reported' ? 'inec' : 'sample'} /></Card>
        <Card><Stat label="Registered voters" value="Not supplied" prov="inec" /></Card>
        <Card><Stat label="Captains approved" value={t.captains} unit={`of ${t.pus}`} sub={`${Math.round(t.coverage * 100)}% covered`} prov="sample" /></Card>
        <Card><Stat label="Coordinators named" value={t.named} unit={`of ${t.rows.length}`} sub={`Readiness ${t.readiness}%`} prov="sample" /></Card>
      </div>

      <div className="mt12"><Note tone="warn">Registered-voter counts are not included in the supplied INEC-derived geography source.</Note></div>

      <div className="grid g21 mt16">
        <Card title="Wards by readiness" right={<Prov k="sample" />}>
          <Treemap items={tm} w={760} h={280} />
        </Card>
        <div className="col gap14">
          <Card title="Needs attention">
            {flagged.length === 0 && <p className="small muted">No ward is flagged on this date.</p>}
            {flagged.map((r) => (
              <div className="li" key={r.ward.slug} style={{ padding: '8px 0' }}>
                <Link href={`/ops/ward/${r.ward.slug}`} className="b small sp">{r.ward.name}</Link>
                <Chip tone="red">{r.flag}</Chip>
              </div>
            ))}
          </Card>
          <Card title="Town halls here">
            {events.length === 0 && <p className="small muted">No more town halls planned in {L.name}.</p>}
            {events.map((e) => (
              <div className="li" key={e.id} style={{ padding: '8px 0' }}>
                <div className="tm" style={{ width: 70 }}>{dayLabel(e.date)}</div>
                <div className="small"><b>{e.where}</b><div className="tiny muted">{EVENT_KIND[e.kind]} · proposed</div></div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <Card title="Wards" className="mt16">
        <WardTable rows={t.rows} showLga={false} />
      </Card>

      <Card title="Local leaders and institutions" className="mt16" right={<span className="small muted">As reported in the campaign material</span>}>
        {people.length === 0 ? (
          <Note tone="warn">No party or union leaders are named for {L.name} in the campaign material yet (open item 18). The ward coordinators map them in the first fortnight.</Note>
        ) : (
          <div className="tw">
            <table className="tbl">
              <thead><tr><th>Name</th><th>Role</th><th>Seen at</th><th>Suggested use</th></tr></thead>
              <tbody>
                {people.map((p) => (
                  <tr key={p.name}><td className="b small">{p.name}</td><td className="small">{p.role}</td><td className="small">{p.seen}</td><td className="small">{p.suggest}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
