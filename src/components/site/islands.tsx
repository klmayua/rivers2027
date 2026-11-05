'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { OgamiPanel } from '@/components/ogami-chat';
import { Icon } from '@/components/brand';
import { Bar, Sample } from '@/components/ui';
import { WardSelect, useWeek } from '@/components/bits';
import { CANDIDATE, ELECTION } from '@/data/campaign';
import { EVENTS, EVENT_KIND } from '@/data/content';
import { WEEKLY_GOAL, COORDINATORS_TARGET } from '@/lib/model';
import { daysToElection } from '@/lib/clock';
import { dayLabel, naira, num } from '@/lib/format';
import { useClock, useMetrics } from '@/lib/hooks';
import { useStore } from '@/lib/store';
import { openGive } from '@/lib/ui-state';

export function GiveButton({ children, className = 'btn red', group, ward, channel = 'site' }: { children: React.ReactNode; className?: string; group?: string; ward?: string; channel?: string }) {
  return (
    <button className={className} onClick={() => openGive({ group: group ?? null, ward: ward ?? null, channel })} aria-haspopup="dialog">
      {children}
    </button>
  );
}

export function Countdown() {
  const clock = useClock();
  const days = daysToElection(clock.date);
  return (
    <div className="s-count">
      <div className="d">{days > 0 ? days : days === 0 ? 'Today' : '0'}</div>
      <div>
        <b>{days > 0 ? 'days to the election' : days === 0 ? 'Election Day' : 'The poll has closed'}</b>
        <span>{ELECTION.label}</span>
      </div>
    </div>
  );
}

export function ThisWeek() {
  const week = useWeek();
  return (
    <div className="s-week">
      <div className="wrap s-week-in">
        <span className="badge-live">THIS WEEK</span>
        <p className="sp"><b>{week.issue}</b> <span className="muted">· join in with</span> <b className="green">{week.tag}</b> <span className="muted">and {CANDIDATE.tag}</span></p>
        <Link href="/wards" className="s-week-go">Read the facts for your ward <Icon name="arrow" size={15} /></Link>
      </div>
    </div>
  );
}

export function Momentum() {
  const m = useMetrics();
  const mineS = useStore((s) => s.signups.length);
  const mineA = useStore((s) => s.academy.length);
  const items = [
    { v: num(m.signups + mineS), l: 'Rivers supporters have joined' },
    { v: `${m.coordinators} of ${COORDINATORS_TARGET}`, l: 'wards with a named coordinator' },
    { v: num(m.academy + mineA), l: 'young people in the Digital Academy' },
    { v: String(m.townHalls), l: 'town halls held so far' },
  ];
  return (
    <div className="s-momentum">
      {items.map((i) => (
        <div key={i.l}><b>{i.v}</b><span>{i.l}</span></div>
      ))}
      <p className="tiny faint" style={{ gridColumn: '1 / -1' }}><Sample>Sample</Sample></p>
    </div>
  );
}

export function GivingBand() {
  const m = useMetrics();
  const mine = useStore((s) => s.gifts.length);
  const pct = Math.min(100, (m.giving.thisWeek / WEEKLY_GOAL) * 100);
  return (
    <div className="s-give">
      <div>
        <div className="eyebrow light">People-powered</div>
        <h2 className="s-h2">Rivers is funding this campaign in small gifts.</h2>
        <p className="lead">Campaign giving terms, receipts and applicable legal limits are pending confirmation. This preview contains illustrative sample data only.</p>
        <div className="row gap8 wrap mt16">
          <GiveButton className="btn red lg">Support the campaign</GiveButton>
          <Link href="/agenda/money" className="btn ghost-light lg">How the money is handled</Link>
        </div>
      </div>
      <div className="s-giveCard">
        <div className="row"><b>This week</b><span className="sp" /><Sample>Sample</Sample></div>
        <div className="big">{m.giving.thisWeek > 0 ? `${Math.round(pct)}%` : '—'}</div>
        <div className="small">of this week’s {naira(WEEKLY_GOAL)} goal</div>
        <Bar pct={pct} />
        <div className="row small mt12"><span>{m.giving.count + mine > 0 ? `${num(m.giving.count + mine)} gifts so far` : 'Gifts open on launch day'}</span><span className="sp" /><span className="muted">average {m.giving.count ? naira(Math.round(m.giving.avg)) : '—'}</span></div>
      </div>
    </div>
  );
}

export function WardFinder({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const week = useWeek();
  const [ward, setWard] = useState('');
  return (
    <form
      className={`s-ward ${compact ? 'compact' : ''}`}
      onSubmit={(e) => {
        e.preventDefault();
        if (ward) router.push(`/w/${ward}/${week.slug}`);
      }}
    >
      <WardSelect value={ward} onChange={setWard} id="home-ward" label="Choose your ward" />
      <button className="btn" disabled={!ward}>Access Portal <Icon name="arrow" size={16} /></button>
    </form>
  );
}

export function UpcomingEvents({ limit = 4 }: { limit?: number }) {
  const clock = useClock();
  const rows = EVENTS.filter((e) => e.date >= clock.date && (e.kind === 'live' || e.kind === 'town' || e.kind === 'diaspora' || e.kind === 'debate')).slice(0, limit);
  return (
    <div className="s-events">
      {rows.map((e) => {
        const [, mo, da] = e.date.split('-');
        return (
          <Link key={e.id} href="/events" className="s-ev">
            <div className="dt"><b>{Number(da)}</b><span>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(mo) - 1]}</span></div>
            <div className="sp">
              <span className="chip blue">{EVENT_KIND[e.kind]}</span>
              <div className="t">{e.title}</div>
              <div className="small muted">{dayLabel(e.date, true)}{e.time ? ` · ${e.time}` : ''} · {e.where}</div>
            </div>
          </Link>
        );
      })}
      {rows.length === 0 && <p className="muted">No more events after {dayLabel(clock.date)}.</p>}
    </div>
  );
}

export function HomeChat() {
  return <OgamiPanel height={520} />;
}
