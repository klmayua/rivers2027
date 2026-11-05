'use client';

import Link from 'next/link';
import { Back, whatsapp } from '@/components/bits';
import { Pic } from '@/components/brand';
import { Sample } from '@/components/ui';
import { EVIDENCE } from '@/data/evidence';
import { WARD_BY_SLUG } from '@/data/geo';
import { WEEK_BY_SLUG } from '@/data/weeks';
import { useClock } from '@/lib/hooks';
import { openGive } from '@/lib/ui-state';

const ISSUE_EVIDENCE: Record<string, string[]> = {
  contract: ['E16'],
  roads: ['E12', 'E13'],
  youth: ['E14', 'E21'],
  health: ['E14'],
  schools: ['E14'],
  
  roadwatch: ['E14'],
  'women-markets': ['E14'],
  'nobody-owns': ['E9', 'E11'],
  december: ['E19'],
  'farmers-seniors': ['E14'],
  'know-your-unit': ['E7', 'E8'],
  'what-we-promised': ['E16'],
};

const POSTER: Record<string, string> = {
  contract: '/img/lulu-briggs-1.jpg',
};

/** The page an SMS link opens: one ward, one issue, five buttons. Light enough for a basic phone. */
export function WardIssue({ wardSlug, issueSlug }: { wardSlug: string; issueSlug: string }) {
  const w = WARD_BY_SLUG[wardSlug];
  const k = WEEK_BY_SLUG[issueSlug];
  const clock = useClock();
  const facts = (ISSUE_EVIDENCE[issueSlug] ?? []).map((id) => EVIDENCE.find((e) => e.id === id)).filter((e): e is NonNullable<typeof e> => Boolean(e));
  const named = clock.date >= '2026-11-06';
  return (
    <div className="narrow s-pad col gap14">
      <Back href="/wards" label="All wards" />
      <div className="row gap6 wrap">
        <span className="chip blue">{w.name}</span>
        <span className="chip gray">{w.lgaName}</span>
        <span className="chip">{k.tag}</span>
      </div>
      <div>
        <h2 style={{ fontSize: 23 }}>{k.issue}</h2>
        <p className="small muted mt4">Chief Barr. Dumo Lulu Briggs (NDC) · Week {k.n}</p>
      </div>
      <div className="photo"><Pic src={POSTER[issueSlug] ?? '/img/lulu-briggs-3.png'} alt="" w={540} h={420} style={{ maxHeight: 190, objectFit: 'cover', objectPosition: '50% 20%' }} /></div>
      <div className="ph-ph" style={{ marginTop: -6 }}>20-second video for this week: coming</div>
      <div className="issue">
        <small>In {w.name}</small>
        {w.leadIssue}
      </div>

      <section id="facts">
        <div className="pt">The facts</div>
        {facts.length === 0 && <p className="small muted">Facts for this week are added when the week’s release is approved.</p>}
        {facts.map((f) => (
          <div className="pcard" key={f.id}>
            <div className="tt">{f.topic}</div>
            <p className="small mt4">{f.text}</p>
            <div className="tiny muted mt4">
              {f.src.map((s, i) => (
                <span key={s.label}>{i > 0 && ' · '}{s.url ? <a href={s.url} target="_blank" rel="noreferrer">{s.label}</a> : s.label}</span>
              ))}
            </div>
          </div>
        ))}
        <p className="tiny muted mt8">His position is a draft until he approves it. {k.need}.</p>
      </section>

      <div className="col gap8">
        <a href="#facts" className="btn sec block">Read the facts</a>
        <Link href={`/help-desk?ward=${w.slug}&topic=${encodeURIComponent(k.issue)}`} className="btn sec block">Ask Chief Barr. Dumo</Link>
        <button className="btn sec block" onClick={() => whatsapp(`${k.issue}: the facts for ${w.name}. ${k.tag} ${window.location.href}`)}>Share on WhatsApp</button>
        <button className="btn red block" onClick={() => openGive({ ward: w.slug, channel: 'ward-page' })}>Give</button>
        <Link href={`/join/${w.slug}`} className="btn block">Join the ground team</Link>
      </div>

      <div className="card panel">
        <div className="row"><b>Your ward coordinator</b><span className="sp" /><Sample /></div>
        <p className="small mt4">{named ? `A coordinator is named for ${w.name}: 0803 ••• ••${String(10 + (w.idx * 7) % 80)}.` : `A coordinator for ${w.name} is named by Friday 6 November.`}</p>
      </div>
      <p className="tiny muted" style={{ textAlign: 'center' }}>Reply STOP to any message to opt out.</p>
    </div>
  );
}
