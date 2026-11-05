import { Card, Note, PageHead, Stat } from '@/components/ui';
import { WARDS, TOTAL_PUS } from '@/data/geo';
import { ELECTION, URLS } from '@/data/campaign';
export default function ElectionRoom() {
  return <><PageHead title="Election Day readiness" sub={'Rivers State governorship election · ' + ELECTION.label} />
    <div className="grid g3"><Card><Stat label="LGAs" value={23} prov="inec" /></Card><Card><Stat label="Wards" value={WARDS.length} prov="inec" /></Card><Card><Stat label="Polling units" value={TOTAL_PUS} prov="inec" /></Card></div>
    <div className="mt16"><Note tone="warn">Result reporting remains a placeholder until the official candidate list and ballot data fields are confirmed. Do not use the reference campaign’s simulated vote forecasts.</Note></div>
    <Card title="Official election timetable" className="mt16"><p className="small">The supplied INEC timetable lists 6 March 2027 for governorship and State House of Assembly elections.</p><a className="btn sec mt12" href={URLS.inecTimetable} target="_blank" rel="noreferrer">Open INEC timetable</a></Card>
  </>;
}
