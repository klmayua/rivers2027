import Link from 'next/link';
import { ISSUES, PILLARS } from '@/data/agenda';
import { PageHero, Section, PillarCard, IssueCard } from '@/components/site/ui';
import { MANIFESTO } from '@/data/campaign';
export const metadata = { title: 'Reported priorities', description: 'Publicly reported statements attributed to Chief Barr. Dumo Lulu Briggs, with source links.' };
export default function AgendaPage() {
  return <><PageHero eyebrow="Candidate statements" title="Reported priorities" lead="These are attributed to public reporting and are not presented as a complete, approved manifesto." />
    <Section eyebrow="Reported themes" title="Statements from the 6 October 2026 report"><div className="s-pillars">{PILLARS.map((pillar) => <PillarCard key={pillar.slug} p={pillar} points={MANIFESTO.map((point) => point)} />)}</div></Section>
    <Section id="issues" tone="tint" eyebrow="Source notes" title="Read the reported statements"><div className="s-issues">{ISSUES.map((issue) => <IssueCard key={issue.slug} issue={issue} />)}</div><div className="row gap8 wrap mt24"><Link href="/news" className="btn sec">Source report</Link></div></Section>
    <Section eyebrow="What is still needed" title="Full campaign platform"><p className="lead">A candidate-approved manifesto, policy costings, timelines and implementation responsibilities have not been supplied for this site.</p></Section>
  </>;
}
