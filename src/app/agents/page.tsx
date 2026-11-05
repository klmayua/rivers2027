'use client';

import Link from 'next/link';
import { whatsapp } from '@/components/bits';
import { Icon } from '@/components/brand';
import { Prov } from '@/components/ui';
import { CANDIDATE } from '@/data/campaign';
import { RELEASES, WEEKS } from '@/data/weeks';
import { dayIdx, isElectionDay, weekOf } from '@/lib/clock';
import { useClock } from '@/lib/hooks';
import { dayLabel } from '@/lib/format';

/** The morning briefing: the issue, three things to say, and the day's published articles with one-tap sharing. */
export default function Briefing() {
  const clock = useClock();
  const wk = Math.max(1, Math.min(13, weekOf(clock.date)));
  const w = WEEKS[wk - 1];
  const d = dayIdx(clock.date);
  const dow = d < 0 ? 0 : d % 7; // 0 = Monday
  const today = RELEASES.find((r) => r.date === clock.date);
  const week = RELEASES.filter((r) => r.week === wk);
  const election = isElectionDay(clock.date);

  if (election) {
    return (
      <div className="col gap14">
        <div className="issue"><small>Election Day</small><b>Polling units are open. Your job today is the result sheet.</b></div>
        <ol className="small" style={{ paddingLeft: 18, display: 'grid', gap: 6, margin: 0 }}>
          <li>Be at your unit when accreditation opens. Say who you are to the presiding officer.</li>
          <li>Report any incident with a photograph (never voters’ faces or voter cards).</li>
          <li>When counting ends, photograph the result sheet before anyone moves it, then send it in <b>Report</b>.</li>
          <li>Wait for your coordinator’s reply that it has arrived.</li>
        </ol>
        <Link href="/agents/report" className="btn block">Open the result sheet</Link>
      </div>
    );
  }

  return (
    <div className="col gap14">
      <div className="row"><h2 className="sp" style={{ fontSize: 18 }}>Briefing · {dayLabel(clock.date)}</h2><span className="chip">Week {wk}</span></div>
      <div className="issue">
        <small>The issue this week</small>
        <b>{w.issue}</b>
        <div className="small muted mt4">Tag {w.tag} · {CANDIDATE.tag}</div>
      </div>

      <div>
        <div className="pt">Three things to say</div>
        <ol className="small" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 7 }}>
          <li>{w.headlines[0]}.</li>
          <li>On the record: {w.record.replace(/\.$/, '')}.</li>
          <li>The ask: {w.headlines[3]}.</li>
        </ol>
        <p className="tiny muted mt8">Written by Farawa from the week’s issue and approved by the campaign. Anything about a rival goes to your coordinator first and is not posted.</p>
      </div>

      <div>
        <div className="pt">Today’s articles <Prov k="plan" /></div>
        {today ? (
          <article className="pcard">
            <div className="row"><span className="chip blue">{today.type}</span><span className="sp" /><span className="tiny muted">{today.paper}</span></div>
            <div className="tt mt8">{today.headline}</div>
            <div className="mm">Published {dayLabel(today.date)} · proof of publication attached</div>
            <div className="row gap8 mt8 wrap">
              <button className="btn sm" onClick={() => whatsapp(`${today.headline} ${w.tag} ${CANDIDATE.tag}`)}><Icon name="share" size={15} /> WhatsApp</button>
              <button className="btn sec sm" onClick={() => whatsapp(`${today.headline} ${w.tag}`)}>Facebook caption</button>
              <button className="btn sec sm" onClick={() => whatsapp(`${today.headline} ${w.tag} ${CANDIDATE.tag}`)}>X caption</button>
            </div>
            <p className="tiny muted mt8">One tap opens the share sheet with a ready caption. Share only from this screen.</p>
          </article>
        ) : (
          <div className="note">No release today. {dow === 6 ? 'Tonight at 8pm: Ask Chief Barr. Dumo Live. Send your questions through the app.' : 'Monday’s release carries the next fact.'}</div>
        )}
        {week.filter((r) => r.date < clock.date).slice(-3).reverse().map((r) => (
          <div className="pcard" key={r.id}>
            <div className="tiny muted">{dayLabel(r.date)} · {r.paper} · {r.type}</div>
            <div className="small b mt4">{r.headline}</div>
            <button className="btn sec sm mt8" onClick={() => whatsapp(`${r.headline} ${w.tag}`)}>Share</button>
          </div>
        ))}
      </div>
      <div className="card tint">
        <b>Thursday One Push</b>
        <p className="small mt4">Champions get the WhatsApp kit at 17:00. Ward SMS goes at 18:30 and the trend at 19:00. Post under {w.tag} and {CANDIDATE.tag}.</p>
      </div>
    </div>
  );
}
