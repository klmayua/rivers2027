import Link from 'next/link';
import { Icon, Pic } from '@/components/brand';
import { CANDIDATE, URLS } from '@/data/campaign';
import { ISSUES, KEY_FACTS } from '@/data/agenda';
import { NEWS } from '@/data/content';
import { Countdown, HomeChat, ThisWeek, WardFinder } from '@/components/site/islands';
import { IssueCard, Section } from '@/components/site/ui';

export const metadata = {
  title: { absolute: 'Chief Barr. Dumo Lulu Briggs · Reset Rivers' },
  description: 'Campaign information for Chief Barr. Dumo Lulu Briggs, NDC governorship candidate for Rivers State. Sourced state geography and reported candidate statements.',
};

const FACTS = [KEY_FACTS.riversLgas, KEY_FACTS.riversWards, KEY_FACTS.riversPus, KEY_FACTS.riversTurnout, KEY_FACTS.validVotes2023];

export default function Home() {
  return <>
    <section className="s-hero"><div className="wrap s-hero-in"><div className="s-hero-tx">
      <div className="eyebrow">NDC · Rivers State Governorship · 2027</div>
      <h1 className="s-h1"><b>Reset</b> <span>Rivers.</span></h1>
      <p className="lead">Campaign information for {CANDIDATE.name}, NDC governorship candidate for Rivers State.</p>
      <div className="row gap8 wrap mt16"><Link href="/agenda" className="btn sec lg">Reported priorities</Link><Link href="/about" className="btn lg">Meet the candidate</Link></div>
      <div className="s-hero-meta"><Countdown /><Link href="/voter-help" className="s-meta-link"><Icon name="check" size={18} /><span><b>Voter information</b><small>Election date and polling-unit lookup</small></span></Link></div>
    </div><figure className="s-hero-photo"><Pic src="/img/lulu-briggs-1.jpg" alt={CANDIDATE.name} w={600} h={900} priority /><figcaption><b>{CANDIDATE.name}</b><span>NDC · Rivers State governorship</span></figcaption></figure></div></section>
    <ThisWeek />
    <Section id="facts" tone="tint" eyebrow="Rivers State · sourced data" title="The state at a glance" lead="Geographic figures come from the supplied INEC-derived source. The 2023 result summary is from the supplied national dataset. Registered-voter totals are not included in that source.">
      <div className="s-facts-grid">{FACTS.map((fact) => <div key={fact.label} className="s-fact"><b>{fact.value}</b><span>{fact.label}</span><small>{fact.src}</small></div>)}</div>
      <div className="row gap8 wrap mt24"><Link href="/wards" className="btn">Find your ward</Link><Link href="/voter-help" className="btn sec">Voter help</Link></div>
    </Section>
    <Section id="agenda" eyebrow="Reported candidate statements" title="Reset Rivers priorities" lead="These priorities are attributed to public reporting. A complete, approved manifesto and delivery plan has not been supplied for this site.">
      <div className="s-issues">{ISSUES.map((issue) => <IssueCard key={issue.slug} issue={issue} />)}</div>
      <div className="row gap8 wrap mt24"><Link href="/agenda" className="btn sec">Read the source notes</Link><a href={URLS.candidateProfile} className="btn ghost" target="_blank" rel="noreferrer">Open the report</a></div>
    </Section>
    <Section id="candidate" tone="panel" eyebrow="The candidate" title={CANDIDATE.name}>
      <div className="s-meet"><div className="s-meet-photo"><Pic src="/img/lulu-briggs-2.jpg" alt={CANDIDATE.name} w={600} h={900} /></div><div>
        <p className="lead">The supplied campaign folder contains three candidate photographs. A verified biography and approved candidate profile have not yet been supplied for publication.</p>
        <p className="mt12">Current public reporting identifies him as the NDC governorship candidate in Rivers State and describes a “Reset Rivers” agenda.</p>
        <div className="row gap8 wrap mt16"><Link href="/about" className="btn">Candidate information</Link><Link href="/news" className="btn sec">Source report</Link></div>
      </div></div>
    </Section>
    <Section id="take-part" tone="blue-tint" eyebrow="Rivers State" title="Find your local area" lead="Browse the 23 LGAs, 319 wards and polling-unit names in the supplied INEC-derived geography source."><WardFinder /></Section>
    <Section id="ask" tone="tint" eyebrow="Ask the campaign" title="Ask for published information"><p className="lead">Ogami is an AI assistant. It does not speak for the candidate and will say when campaign information has not been published.</p><HomeChat /></Section>
    <Section id="news" tone="panel" eyebrow="Source notes" title="Published reporting"><div className="s-news">{NEWS.map((item) => <Link key={item.id} href="/news" className="s-newscard"><div className="in"><span className="k">{item.kicker}</span><h3>{item.title}</h3><p>{item.summary}</p><small>{item.source}</small></div></Link>)}</div></Section>
    <section className="s-closer"><div className="wrap"><h2>Rivers State Governorship · 2027</h2><p>INEC’s published timetable lists Saturday 6 March 2027 for governorship and State House of Assembly elections.</p><a className="btn ghost-light lg" href={URLS.inecTimetable} target="_blank" rel="noreferrer">Open INEC timetable</a></div></section>
  </>;
}
