'use client';

import { useState } from 'react';
import { Card, Chip, PageHead, Stat } from '@/components/ui';
import { Bars } from '@/components/charts';
import { GROUND_RULES } from '@/data/campaign';
import { ONE_PUSH, WEEKS } from '@/data/weeks';
import { weekOf, thursdayOf } from '@/lib/clock';
import { dayLabel, num } from '@/lib/format';
import { useClock, useMetrics } from '@/lib/hooks';

export default function Trend() {
  const clock = useClock();
  const m = useMetrics();
  const wk = Math.max(1, Math.min(13, weekOf(clock.date)));
  const w = WEEKS[wk - 1];
  const [copied, setCopied] = useState('');
  const link = `rivers2027.farawa.co/w/abua-i-01/${w.slug}`;
  const kit = [
    { id: 'post', label: 'Post for the candidate’s accounts', text: `${w.headlines[3]}\n\nThe facts, his plan, your questions: ${link}\n\n${w.tag} #ResetRivers` },
    { id: 'creator', label: 'Brief for paid creators (disclosure line is required)', text: `Paid partnership with the Chief Barr. Dumo Lulu Briggs campaign. Post in your own words on: ${w.issue}. Use ${w.tag} #ResetRivers. Start your post with “Paid partnership”. Link: ${link}. Do not copy-paste; no fake accounts or bought engagement.` },
    { id: 'wa', label: 'WhatsApp kit for champions', text: `${w.issue}. Two lines: ${w.headlines[0]}. Read it and share it with your group: ${link}` },
  ];
  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(''), 1800);
    } catch {
      setCopied('');
    }
  };

  return (
    <>
      <PageHead
        title="Thursday One Push"
        sub={<>Press, SMS, WhatsApp and the trend land in the same hour. This week: <b>{w.issue}</b> under <b>{w.tag}</b> on {dayLabel(thursdayOf(wk))}.</>}
        prov={['plan', 'sample']}
      />

      <div className="grid g4 keep2">
        <Card><Stat label="Last trend reach" value={m.trendReach ? num(m.trendReach) : '–'} prov="sample" /></Card>
        <Card><Stat label="Peak position in Nigeria" value={m.trendPeak ? `#${m.trendPeak}` : '–'} prov="sample" /></Card>
        <Card><Stat label="Pushes sent" value={m.pushes} unit="of 11" prov="sample" /></Card>
        <Card><Stat label="Tag" value={w.tag} /></Card>
      </div>

      <div className="grid g21 mt16">
        <Card title="Reach by Thursday" right={<Chip>Sample</Chip>}>
          {m.trendHistory.length ? <Bars values={m.trendHistory} labels={m.trendHistory.map((_, i) => `W${i + 3}`)} h={170} /> : <p className="small muted">The first trend runs on Thursday 22 October.</p>}
          <p className="tiny muted mt8">Reach is illustrative. Real reach comes from the platforms’ own analytics and is added every Friday.</p>
        </Card>
        <Card title="Run sheet">
          <div className="tl">
            {ONE_PUSH.map((s) => (
              <div key={s.t}><b className="small">{s.t}</b> <b className="small">{s.head}</b><div className="tiny muted">{s.body}</div></div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="This week’s kit" className="mt16">
        <div className="grid g3">
          {kit.map((k) => (
            <div className="card panel" key={k.id}>
              <div className="small b">{k.label}</div>
              <p className="small mt8" style={{ whiteSpace: 'pre-wrap' }}>{k.text}</p>
              <button className="btn sec sm mt12" onClick={() => copy(k.id, k.text)}>{copied === k.id ? 'Copied' : 'Copy'}</button>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid g2 mt16">
        <Card title="Ground rules for the trend">
          {GROUND_RULES.slice(0, 3).map((r) => (
            <div className="li" key={r.n} style={{ padding: '8px 0' }}><div className="k">{r.n}</div><div className="small"><b>{r.title}.</b> {r.body}</div></div>
          ))}
        </Card>
        <Card title="Paid creators">
          <p className="small">Four creators are engaged each Thursday, each posting in their own words with a visible “Paid partnership” line. Their fee is recorded on the Cap ledger.</p>
          <p className="small mt8">Creator names are not part of this preview. They are added by the communications lead once contracts are signed, and are never shown to the public as endorsements without that disclosure.</p>
          <p className="tiny muted mt8">Boosts are paid, labelled and targeted by ward. No bought engagement, no fake accounts.</p>
        </Card>
      </div>
    </>
  );
}
