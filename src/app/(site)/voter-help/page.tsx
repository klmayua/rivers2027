import Link from 'next/link';
import { PageHero, Section } from '@/components/site/ui';
import { KEY_FACTS } from '@/data/agenda';
import { URLS } from '@/data/campaign';
export const metadata = { title: 'Voter information', description: 'Rivers State election date and official polling-unit lookup information.' };
export default function VoterHelp() {
  return <><PageHero eyebrow="Voter information" title="Check your polling details" lead="INEC’s published timetable lists the Rivers governorship election for Saturday 6 March 2027." />
    <Section eyebrow="Rivers State geography" title="Use the official voter lookup"><div className="grid g3">{[KEY_FACTS.riversLgas, KEY_FACTS.riversWards, KEY_FACTS.riversPus].map((fact) => <article className="pcard" key={fact.label}><b>{fact.value}</b><p>{fact.label}</p><small>{fact.src}</small></article>)}</div>
      <p className="lead mt16">The supplied geography source contains LGA, ward and polling-unit names. It does not contain registered-voter counts or a live voter lookup. Confirm your registration details directly with INEC.</p>
      <div className="row gap8 wrap mt16"><a href="https://cvr.inecnigeria.org/pu" className="btn" target="_blank" rel="noreferrer">INEC polling-unit directory</a><a href={URLS.inecTimetable} className="btn sec" target="_blank" rel="noreferrer">INEC election timetable</a><Link href="/wards" className="btn ghost">Browse Rivers wards</Link></div>
    </Section></>;
}
