import Link from 'next/link';
import { PROJECTS } from '@/data/content';
import { URLS } from '@/data/campaign';
import { Chip } from '@/components/ui';
import { PageHero, Section } from '@/components/site/ui';

export const metadata = { title: 'Rivers Project Register', description: 'Each federal project in Rivers State: who holds the contract, when it was promised, what has been done, with a dated photograph.' };

const SRC: Record<string, string | undefined> = {
  E12: URLS.arise_road,
  E13: URLS.td_road,
  E14: URLS.legit,
};

export default function Projects() {
  return (
    <>
      <PageHero eyebrow="The Rivers Project Register" title="Every project, with a contractor, a date and a photograph." lead="Where the campaign has not confirmed something, it says so. The Register starts with what is already on the public record, and dated photographs are added as ward coordinators and the candidate visit each site." />
      <Section>
        <div className="s-grid2">
          {PROJECTS.map((p) => (
            <article className="pcard s-proj" key={p.id}>
              <div className="row top gap8">
                <div className="tt sp">{p.title}</div>
                <Chip tone={p.tone === 'red' ? 'red' : p.tone === 'amber' ? 'amber' : p.tone === 'blue' ? 'blue' : 'gray'}>{p.status}</Chip>
              </div>
              <div className="mm">{p.kind} · {p.where}</div>
              <p className="small mt8">{p.summary}</p>
              <div className="grid g2 mt8" style={{ gap: 8 }}>
                <div className="small"><span className="muted">Contractor</span><br /><b>{p.contractor}</b></div>
                <div className="small"><span className="muted">Promised</span><br /><b>{p.promised}</b></div>
              </div>
              <div className="small mt8"><span className="muted">Next:</span> {p.next}</div>
              <div className="ph-ph">{p.photo}</div>
              <div className="tiny muted mt8">
                Source: {SRC[p.evidence] ? <a href={SRC[p.evidence]} target="_blank" rel="noreferrer">{p.src}</a> : p.src}
              </div>
            </article>
          ))}
        </div>
        <div className="mt24"><Link href="/help-desk?topic=Roads%20and%20safety" className="btn sec">Know a project we have missed? Tell us</Link></div>
      </Section>
    </>
  );
}
