'use client';

import { useMemo } from 'react';
import { Back, ShareBtn } from './bits';
import { QR } from './qr';
import { Bar, Sample } from './ui';
import { ASK_LADDER } from '@/data/campaign';
import { GROUPS, GROUP_BY_SLUG } from '@/data/content';
import { dayIdx } from '@/lib/clock';
import { naira, num } from '@/lib/format';
import { useClock } from '@/lib/hooks';
import { rngFor } from '@/lib/rng';
import { useStore } from '@/lib/store';
import { openGive } from '@/lib/ui-state';

export type GroupStat = { slug: string; name: string; members: number; gifts: number; amount: number; per100: number; goal: number };

const smooth = (x: number) => {
  const t = Math.max(0, Math.min(1, x));
  return t * t * (3 - 2 * t);
};

export function groupStats(date: string, extra: Record<string, { n: number; amt: number }> = {}): GroupStat[] {
  const pub = Math.max(0, dayIdx(date) - 3);
  return GROUPS.map((g) => {
    const rate = 0.1 + 0.28 * rngFor('grp:' + g.slug)();
    const base = Math.round(g.members * rate * smooth(pub / 80));
    const avg = 3200 + 6800 * rngFor('avg:' + g.slug)();
    const e = extra[g.slug] ?? { n: 0, amt: 0 };
    const gifts = base + e.n;
    const amount = Math.round(base * avg) + e.amt;
    return { slug: g.slug, name: g.name, members: g.members, gifts, amount, per100: (gifts / g.members) * 100, goal: Math.max(5, Math.round(g.members * 0.04)) };
  });
}

export function useGroupExtra(): Record<string, { n: number; amt: number }> {
  const gifts = useStore((s) => s.gifts);
  return useMemo(() => {
    const out: Record<string, { n: number; amt: number }> = {};
    for (const g of gifts) {
      if (!g.group) continue;
      const cur = (out[g.group] ??= { n: 0, amt: 0 });
      cur.n += 1;
      cur.amt += g.amount;
    }
    return out;
  }, [gifts]);
}

/** A champion group's page: the group’s own total and gift count, never a name or an individual amount. */
export function GroupView({ slug }: { slug: string }) {
  const g = GROUP_BY_SLUG[slug];
  const clock = useClock();
  const extra = useGroupExtra();
  const stat = groupStats(clock.date, extra).find((s) => s.slug === slug);
  if (!g || !stat) return null;
  const weekGifts = Math.min(stat.gifts, Math.max(1, Math.round(stat.goal * (0.55 + 0.5 * rngFor('wk:' + slug + clock.date)()))));
  return (
    <div className="narrow s-pad col gap14">
      <Back href="/" label="Home" />
      <div>
        <div className="row gap6 wrap"><span className="chip blue">Group page</span>{g.abroad && <span className="chip gray">Diaspora</span>}<Sample>Sample group</Sample></div>
        <h2 className="mt8" style={{ fontSize: 24 }}>{g.name}</h2>
        <p className="small muted mt4">{g.place} · is funding Chief Barr. Dumo Lulu Briggs’s campaign for Rivers State in small gifts.</p>
      </div>
      <div className="card tint">
        <div className="grid g2" style={{ gap: 10 }}>
          <div className="stat"><div className="l">Gifts so far</div><div className="v">{num(stat.gifts)}</div></div>
          <div className="stat"><div className="l">Group total</div><div className="v">{naira(stat.amount)}</div></div>
        </div>
        <div className="row small mt12"><span>This week’s goal: {weekGifts} of {stat.goal} gifts</span><span className="sp" /><b>{stat.per100.toFixed(1)} per 100 members</b></div>
        <div className="mt8"><Bar pct={(weekGifts / stat.goal) * 100} /></div>
        <p className="tiny muted mt8">Group pages show counts and totals, never a name or an individual amount. A small group can lead: the board counts gifts per 100 members.</p>
      </div>
      <button className="btn red block" onClick={() => openGive({ group: slug, channel: 'group-link' })}>Give through {g.name}</button>
      <div className="card">
        <h3>The ask ladder</h3>
        <div className="mt8">
          {ASK_LADDER.slice(0, 4).map((l) => (
            <div className="row small" key={l.amount} style={{ padding: '6px 0', borderBottom: '1px solid var(--line)' }}>
              <b style={{ width: 70 }}>{naira(l.amount)}</b><span className="muted">{l.adds}</span>
            </div>
          ))}
        </div>
      </div>
      <QR path={`/g/${slug}`} size={128} />
      <ShareBtn text={`${g.name} is funding Chief Barr. Dumo Lulu Briggs’s campaign for Rivers State in small gifts. Every gift gets a receipt. Give here:`} path={`/g/${slug}`} />
    </div>
  );
}
