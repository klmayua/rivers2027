import Link from 'next/link';
import { CONTRACT } from '@/data/campaign';
import { PageHero, Section } from '@/components/site/ui';
import { ShareBtn } from '@/components/bits';

export const metadata = { title: 'The Rivers Contract', description: 'Three promises from Chief Barr. Dumo Lulu Briggs: speak and vote on the record, track every project in public, be reachable.' };

export default function Contract() {
  return (
    <>
      <PageHero eyebrow="The Rivers Contract" title="Three promises you can hold him to from his first day." lead="Drawn from his manifesto. The final wording is the candidate’s to approve." />
      <Section>
        <div className="s-contract">
          {CONTRACT.map((c) => (
            <article key={c.n}>
              <span className="n">{c.n}</span>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section tone="tint" narrow eyebrow="Kept in public" title="How the Contract is kept">
        <div className="s-kept">
          <div><b>The Report Card</b><p>Publishes each vote and question within 48 hours, in plain language, with how he voted and why.</p><Link href="/report-card">See the Report Card →</Link></div>
          <div><b>The Project Register</b><p>Shows contractor, promised date, status and a dated photograph. If a date passes, it says so.</p><Link href="/projects">See the Register →</Link></div>
          <div><b>The People’s Help Desk</b><p>Answers every question within 5 working days.</p><Link href="/help-desk">Ask a question →</Link></div>
          <div><b>Town halls</b><p>Open to everyone, with no gift or condition, streamed live, with the Help Desk open.</p><Link href="/events">See the dates →</Link></div>
        </div>
        <div className="mt24" style={{ maxWidth: 420 }}>
          <ShareBtn text="Chief Barr. Dumo Lulu Briggs’s Rivers Contract: speak and vote on the record, track every project in public, be reachable." path="/contract" />
        </div>
      </Section>
    </>
  );
}
