'use client';

import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { Icon } from '@/components/brand';
import { groupStats, useGroupExtra } from '@/components/group-view';
import { QR } from '@/components/qr';
import { whatsapp } from '@/components/bits';
import { Bar, Prov, Sample } from '@/components/ui';
import { ONE_PUSH } from '@/data/weeks';
import { GROUP_BY_SLUG } from '@/data/content';
import { naira, num } from '@/lib/format';
import { useClock } from '@/lib/hooks';
import { rngFor } from '@/lib/rng';
import { openGive } from '@/lib/ui-state';
import { useWeek } from '@/components/bits';

const SLUG = 'rivers-community';

export default function ChampionPage() {
  return (
    <AuthGuard>
      <div className="narrow s-pad"><Champion /></div>
    </AuthGuard>
  );
}

function Champion() {
  const clock = useClock();
  const week = useWeek();
  const extra = useGroupExtra();
  const all = groupStats(clock.date, extra);
  const me = all.find((s) => s.slug === SLUG)!;
  const g = GROUP_BY_SLUG[SLUG];
  const board = all.slice().sort((a, b) => b.per100 - a.per100);
  const rank = board.findIndex((s) => s.slug === SLUG) + 1;
  const weekGifts = Math.min(me.gifts, Math.max(1, Math.round(me.goal * (0.55 + 0.5 * rngFor('wk:' + SLUG + clock.date)()))));
  const msg = `Chief Barr. Dumo Lulu Briggs is asking Rivers to fund his campaign in small gifts. Our ${g.name} are aiming for ${me.goal} gifts this week. Every gift gets a receipt. Give here:`;
  return (
    <div className="col gap14">
      <div>
        <div className="row gap6"><span className="chip blue">Champion</span><Sample>Sample group</Sample></div>
        <h2 className="mt8" style={{ fontSize: 23 }}>{g.name}</h2>
        <p className="small muted mt4">You share one link. Your group sees its own running total. Nobody sees a name or an individual amount.</p>
      </div>

      <div className="card tint">
        <div className="grid g2" style={{ gap: 10 }}>
          <div className="stat"><div className="l">Gifts so far</div><div className="v">{num(me.gifts)}</div></div>
          <div className="stat"><div className="l">Group total</div><div className="v">{naira(me.amount)}</div></div>
        </div>
        <div className="row small mt12"><span>This week: {weekGifts} of {me.goal} gifts</span><span className="sp" /><b>#{rank} of {board.length} on the board</b></div>
        <div className="mt8"><Bar pct={(weekGifts / me.goal) * 100} /></div>
      </div>

      <div className="card">
        <div className="row"><h3 className="sp">Your link and QR code</h3><Prov k="plan" /></div>
        <div className="row mt12" style={{ alignItems: 'center', gap: 14 }}>
          <QR path={`/g/${SLUG}`} size={112} label="" />
          <div className="col gap8 sp">
            <div className="kbd" style={{ wordBreak: 'break-all' }}>/g/{SLUG}</div>
            <Link href={`/g/${SLUG}`} className="btn sec sm">Open group page</Link>
            <button className="btn sm red" onClick={() => openGive({ group: SLUG, channel: 'group-link' })}>Try a gift</button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Thursday’s WhatsApp kit <span className="chip gray" style={{ marginLeft: 6 }}>{week.tag}</span></h3>
        <p className="small muted mt4">Sent to champions at 17:00 so your group sees it before the 18:30 ward SMS and the 19:00 trend.</p>
        <div className="issue mt8" style={{ whiteSpace: 'pre-wrap' }}>
          <small>Message</small>
          {msg} [your group link]
        </div>
        <div className="row gap8 mt8 wrap">
          <button className="btn sm" onClick={() => whatsapp(`${msg} ${window.location.origin}/g/${SLUG}`)}><Icon name="share" size={15} /> Forward on WhatsApp</button>
        </div>
      </div>

      <div className="card">
        <h3>The board <span className="tiny muted">gifts per 100 members</span></h3>
        <div className="mt8">
          {board.slice(0, 8).map((s, i) => (
            <div key={s.slug} className="row small" style={{ padding: '7px 0', borderBottom: '1px solid var(--line)', background: s.slug === SLUG ? 'var(--green-tint)' : undefined }}>
              <b style={{ width: 22 }}>{i + 1}</b>
              <span className="sp">{s.name}</span>
              <b>{s.per100.toFixed(1)}</b>
            </div>
          ))}
        </div>
        <p className="tiny muted mt8">Counting per 100 members means a small group can lead. Group names on the board are samples.</p>
      </div>

      <div className="card panel">
        <h3>Thursday, hour by hour</h3>
        <div className="mt8">
          {ONE_PUSH.map((s) => (
            <div className="li" key={s.t} style={{ padding: '8px 0' }}>
              <div className="tm">{s.t}</div>
              <div><b className="small">{s.head}</b><div className="tiny muted">{s.body}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="note warn"><b>Rules for champions.</b> You never handle cash: money moves from the donor through Paystack to the campaign account. Never from the pulpit or at a service. No gift is tied to a contract, appointment or favour.</div>
    </div>
  );
}
