import { EVIDENCE } from '@/data/evidence';
import { PageHero, Section } from '@/components/site/ui';
export const metadata = { title: 'Campaign record and sources', description: 'Published statements and factual source notes for the Rivers State campaign.' };
export default function ReportCard() { return <><PageHero eyebrow="Sources and statements" title="Campaign record" lead="This page records material available for publication. It does not contain legislative votes or a record of service in office." /><Section narrow>
  <div className="col gap14">{EVIDENCE.map((item) => <article key={item.id} className="issue"><small>{item.topic}</small><p>{item.text}</p><div className="row gap8 wrap mt8">{item.src.map((source) => source.url ? <a key={source.label} href={source.url} target="_blank" rel="noreferrer" className="tiny">{source.label}</a> : <span key={source.label} className="tiny muted">{source.label}</span>)}</div></article>)}</div>
  </Section></>; }
