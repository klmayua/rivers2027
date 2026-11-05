import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon } from '@/components/brand';
import type { Fact, Issue, Pillar } from '@/data/agenda';
import { MotionFadeIn, MotionCard } from '@/components/motion-flow';

export function PageHero({ eyebrow, title, lead, children, tone }: { eyebrow?: string; title: ReactNode; lead?: ReactNode; children?: ReactNode; tone?: 'green' }) {
  return (
    <section className={`s-phero ${tone ?? ''}`}>
      <div className="wrap">
        <MotionFadeIn>
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h1 className="s-h1 sm">{title}</h1>
          {lead && <p className="lead">{lead}</p>}
          {children}
        </MotionFadeIn>
      </div>
    </section>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  tone,
  narrow,
}: {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  tone?: 'tint' | 'blue-tint' | 'red-tint' | 'panel' | 'dark';
  narrow?: boolean;
}) {
  return (
    <section id={id} className={`s-sec ${tone ?? ''}`}>
      <div className={narrow ? 'narrow' : 'wrap'}>
        {(eyebrow || title || lead) && (
          <MotionFadeIn>
            <header className="s-sechead">
              {eyebrow && <div className={`eyebrow ${tone === 'dark' ? 'light' : ''}`}>{eyebrow}</div>}
              {title && <h2 className="s-h2">{title}</h2>}
              {lead && <p className="lead">{lead}</p>}
            </header>
          </MotionFadeIn>
        )}
        <MotionFadeIn delay={0.06}>
          {children}
        </MotionFadeIn>
      </div>
    </section>
  );
}

export function Facts({ facts }: { facts: Fact[] }) {
  return (
    <ul className="s-facts">
      {facts.map((f, i) => (
        <li key={i}>
          <p>{f.text}</p>
          <span className="src">Source: {f.url ? <a href={f.url} target="_blank" rel="noreferrer">{f.src}</a> : f.src}</span>
        </li>
      ))}
    </ul>
  );
}

export function IssueCard({ issue }: { issue: Issue }) {
  return (
    <MotionCard>
      <Link href={`/agenda/${issue.slug}`} className="s-issue">
        <span className="ic"><Icon name={issue.icon} size={22} /></span>
        <div className="k">{issue.kicker}</div>
        <h3>{issue.title}</h3>
        <p>{issue.hook}</p>
        <span className="go">The facts and his commitment <Icon name="arrow" size={15} /></span>
      </Link>
    </MotionCard>
  );
}

export function PillarCard({ p, points }: { p: Pillar; points: string[] }) {
  return (
    <MotionCard>
      <article className="s-pillar">
        <div className="top"><span className="n">{p.n}</span><span className="ic"><Icon name={p.icon} size={22} /></span></div>
        <h3>{p.title}</h3>
        <p>{p.line}</p>
        <ul>
          {points.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </article>
    </MotionCard>
  );
}
