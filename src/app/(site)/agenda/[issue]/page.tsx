import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/brand';
import { ISSUES, ISSUE_BY_SLUG } from '@/data/agenda';
import { MANIFESTO } from '@/data/campaign';
import { Facts, PageHero, Section } from '@/components/site/ui';
import { GiveButton } from '@/components/site/islands';

export const dynamicParams = false;

export function generateStaticParams() {
  return ISSUES.map((i) => ({ issue: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ issue: string }> }) {
  const { issue } = await params;
  const i = ISSUE_BY_SLUG[issue];
  return i ? { title: i.title, description: i.hook } : {};
}

export default async function IssuePage({ params }: { params: Promise<{ issue: string }> }) {
  const { issue } = await params;
  const i = ISSUE_BY_SLUG[issue];
  if (!i) notFound();
  const others = ISSUES.filter((x) => x.slug !== i.slug).slice(0, 4);
  return (
    <>
      <PageHero eyebrow={i.kicker} title={i.title} lead={i.hook}>
        <div className="row gap8 wrap mt16">
          <Link href={`/help-desk?topic=${encodeURIComponent(i.askTopic)}`} className="btn red lg">Ask Chief Barr. Dumo</Link>
          <Link href="/agenda" className="btn sec lg">The whole Agenda</Link>
        </div>
      </PageHero>
      <Section narrow eyebrow="On the record" title="The facts">
        <Facts facts={i.facts} />
      </Section>
      <Section narrow tone="tint" eyebrow={i.stands.head} title={i.missing ? 'Where he stands' : 'His commitment'}>
        {i.missing ? (
          <div className="note warn"><b>Not yet published.</b> {i.missing}</div>
        ) : null}
        <p className="lead" style={{ marginTop: i.missing ? 14 : 0 }}>{i.stands.body}</p>
        {i.stands.points && (
          <div className="mt16">
            <div className="small b muted">In the Rivers Agenda</div>
            <ul className="s-agpoints">
              {i.stands.points.map((n) => (
                <li key={n}><span>{n}</span>{MANIFESTO[n - 1]}</li>
              ))}
            </ul>
          </div>
        )}
      </Section>
      <Section narrow eyebrow="What you can do" title="Take the next step">
        <div className="s-nextgrid">
          {i.next.map((a) => (
            <Link key={a.href + a.label} href={a.href} className="s-act slim"><span>{a.label}</span><Icon name="arrow" size={18} /></Link>
          ))}
          <GiveButton className="s-act slim giveact"><span>Support the campaign</span><Icon name="heart" size={18} /></GiveButton>
        </div>
      </Section>
      <Section tone="panel" eyebrow="Also on the table" title="Other issues">
        <div className="s-issues four">
          {others.map((o) => (
            <Link key={o.slug} href={`/agenda/${o.slug}`} className="s-issue small">
              <div className="k">{o.kicker}</div>
              <h3>{o.title}</h3>
              <span className="go">Read <Icon name="arrow" size={15} /></span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
