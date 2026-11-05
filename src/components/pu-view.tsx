'use client';
import Link from 'next/link';
import { Card, PageHead, Stat } from './ui';
import { type PU } from '@/data/geo';
import { ELECTION } from '@/data/campaign';
import { useStore } from '@/lib/store';
export function PuView({ pu }: { pu: PU }) {
  const reports = useStore((state) => state.reports.filter((report) => report.pu === pu.id));
  const sheets = useStore((state) => state.sheets);
  const sheet = sheets.find((entry) => entry.pu === pu.id);
  return <><PageHead title={pu.name} sub={pu.ward.lgaName + ' · ' + pu.ward.name + ' · INEC code ' + pu.id} actions={<Link href={'/ops/ward/' + pu.ward.slug} className="btn sec">Ward desk</Link>} />
    <div className="grid g3"><Card><Stat label="LGA" value={pu.ward.lgaName} prov="inec" /></Card><Card><Stat label="Ward" value={pu.ward.name} prov="inec" /></Card><Card><Stat label="Polling unit" value={pu.name} prov="inec" /></Card></div>
    <div className="mt12"><Card title="Voter register"><p className="small muted">Registered-voter totals are not included in the supplied source data.</p></Card></div>
    <div className="grid g2 mt16"><Card title="Ground reports">{reports.length ? reports.map((report) => <div className="li" key={report.id}><div className="small">{report.note || 'Report received'}<div className="tiny muted">{report.by} · {report.at}</div></div></div>) : <p className="small muted">No reports have been submitted for this polling unit.</p>}</Card>
      <Card title="Election result record"><p className="small muted">INEC’s governorship election date is {ELECTION.label}. Ballot-party fields and results must be configured from the official final list and the signed result sheet.</p>{sheet && <div className="mt12"><Stat label="Accredited voters on uploaded sheet" value={sheet.accredited} /><Stat label="Rejected ballots on uploaded sheet" value={sheet.rejected} /></div>}</Card></div>
  </>;
}
