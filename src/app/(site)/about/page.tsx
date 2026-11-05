import Link from 'next/link';
import { Pic } from '@/components/brand';
import { CANDIDATE, URLS } from '@/data/campaign';
import { NEWS } from '@/data/content';
import { PageHero, Section } from '@/components/site/ui';

export const metadata = { title: 'About Chief Barr. Dumo Lulu Briggs', description: 'Candidate information and source notes for the Rivers State governorship campaign.' };
export default function About() {
  return <>
    <PageHero eyebrow="Candidate information" title={CANDIDATE.name} lead="NDC governorship candidate for Rivers State, as identified in public reporting." />
    <Section><div className="s-meet"><div className="s-meet-photo"><Pic src="/img/lulu-briggs-3.png" alt={CANDIDATE.name} w={600} h={900} /></div><div>
      <p className="lead">A verified biography, personal particulars and candidate-approved profile have not yet been supplied for this site.</p>
      <p className="mt12">A Premium Times report published 6 October 2026 identifies Dumo Lulu Briggs as the NDC governorship candidate in Rivers State and describes his “Reset Rivers” agenda.</p>
      <div className="row gap8 wrap mt16"><a href={URLS.candidateProfile} className="btn" target="_blank" rel="noreferrer">Read the source report</a><Link href="/agenda" className="btn sec">Reported priorities</Link></div>
    </div></div></Section>
    <Section tone="tint" eyebrow="Publication status" title="Candidate materials"><p className="lead">The campaign has not supplied an approved biography, complete manifesto, costed implementation plan, contact details, or public event schedule for this site. Those items should be confirmed before publication.</p></Section>
    <Section eyebrow="Source report" title="Reported statements"><div className="s-news">{NEWS.map((item) => <article className="s-newscard" key={item.id}><div className="in"><h3>{item.title}</h3><p>{item.summary}</p><small>{item.source}</small></div></article>)}</div></Section>
  </>;
}
