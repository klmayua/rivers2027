'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, Chip, Note, PageHead } from '@/components/ui';
import { Pic } from '@/components/brand';
import { CANDIDATE, QUOTES } from '@/data/campaign';
import { WEEKS } from '@/data/weeks';
import { weekOf } from '@/lib/clock';
import { useClock } from '@/lib/hooks';
import { useStore } from '@/lib/store';

const FORMATS = {
  square: { label: 'Square · feed and WhatsApp', w: 1080, h: 1080 },
  story: { label: 'Story · Status and Reels', w: 1080, h: 1920 },
  wide: { label: 'Wide · X and Facebook', w: 1200, h: 675 },
} as const;
type FormatKey = keyof typeof FORMATS;

const GREEN = '#0a7a3d';
const RED = '#c8202f';
const BLUE = '#7fb8e0';
const INK = '#14211a';

function loadImg(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const i = new window.Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(t).width > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = t;
  }
  if (cur) lines.push(cur);
  return lines;
}

export default function Studio() {
  const clock = useClock();
  const quotesApproved = useStore((s) => s.quotesApproved);
  const wk = Math.max(1, Math.min(13, weekOf(clock.date)));
  const w = WEEKS[wk - 1];
  const usable = useMemo(() => QUOTES.filter((q) => q.approved || quotesApproved[q.id]), [quotesApproved]);
  const [qid, setQid] = useState<string>(QUOTES[0].id);
  const [fmt, setFmt] = useState<FormatKey>('square');
  const [tag, setTag] = useState(true);
  const ref = useRef<HTMLCanvasElement>(null);
  const q = usable.find((x) => x.id === qid) ?? usable[0];
  const F = FORMATS[fmt];

  useEffect(() => {
    let dead = false;
    const run = async () => {
      const c = ref.current;
      if (!c || !q) return;
      const [portrait, emblem] = await Promise.all([loadImg('/img/lulu-briggs-1.jpg'), loadImg('/img/ndc-badge.svg')]);
      if (document.fonts?.ready) await document.fonts.ready;
      if (dead) return;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      const family = getComputedStyle(document.body).fontFamily;
      const { w: W, h: H } = F;
      c.width = W;
      c.height = H;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, W, H);
      // brand stripe
      const sh = Math.round(H * 0.012);
      ctx.fillStyle = GREEN; ctx.fillRect(0, 0, W * 0.45, sh);
      ctx.fillStyle = BLUE; ctx.fillRect(W * 0.47, 0, W * 0.31, sh);
      ctx.fillStyle = RED; ctx.fillRect(W * 0.8, 0, W * 0.2, sh);

      const pad = Math.round(W * 0.075);
      const wide = fmt === 'wide';
      const story = fmt === 'story';
      // portrait
      const pw = wide ? Math.round(H * 0.5) : Math.round(W * (story ? 0.5 : 0.34));
      const ph = Math.round(pw * 1.2);
      const px = wide ? W - pad - pw : pad;
      const py = wide ? Math.round((H - ph) / 2) + 34 : H - pad - ph - (story ? 180 : 70);
      ctx.save();
      ctx.beginPath();
      const r = 22;
      ctx.moveTo(px + r, py); ctx.arcTo(px + pw, py, px + pw, py + ph, r); ctx.arcTo(px + pw, py + ph, px, py + ph, r); ctx.arcTo(px, py + ph, px, py, r); ctx.arcTo(px, py, px + pw, py, r); ctx.closePath();
      ctx.clip();
      const sr = portrait.width / portrait.height;
      const dr = pw / ph;
      let sw = portrait.width, shh = portrait.height, sx = 0, sy = 0;
      if (sr > dr) { sw = portrait.height * dr; sx = (portrait.width - sw) / 2; } else { shh = portrait.width / dr; sy = 0; }
      ctx.drawImage(portrait, sx, sy, sw, shh, px, py, pw, ph);
      ctx.restore();
      ctx.strokeStyle = GREEN; ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(px, py, pw, ph, r);
      ctx.stroke();

      // quote: shrink the type until it clears the portrait (or the name block on the wide card)
      const tw = wide ? W - pad * 2 - pw - 40 : W - pad * 2;
      const tx = pad;
      const limit = wide ? H - pad - 150 : py - 30;
      let fs = wide ? 40 : story ? 62 : 54;
      let lines: string[] = [];
      for (; fs >= 26; fs -= 2) {
        ctx.font = `700 ${fs}px ${family}`;
        lines = wrap(ctx, q.text, tw);
        if (sh + pad + fs * 2.4 + (lines.length - 1) * fs * 1.28 <= limit) break;
      }
      const lh = fs * 1.28;
      const top = sh + pad + fs * 2.4;
      ctx.fillStyle = GREEN;
      ctx.font = `800 ${fs * 2.2}px ${family}`;
      ctx.fillText('“', tx - 4, sh + pad + fs * 1.2);
      ctx.fillStyle = INK;
      ctx.font = `700 ${fs}px ${family}`;
      lines.forEach((l, i) => ctx.fillText(l, tx, top + i * lh));

      // name block
      const nx = wide ? tx : px + pw + 36;
      const ny = wide ? H - pad - 96 : py + ph - 120;
      ctx.fillStyle = INK;
      ctx.font = `800 ${wide ? 34 : 40}px ${family}`;
      ctx.fillText(CANDIDATE.short, nx, ny);
      ctx.fillStyle = '#5a6a61';
      ctx.font = `600 ${wide ? 22 : 26}px ${family}`;
      ctx.fillText('NDC · Governorship', nx, ny + (wide ? 34 : 40));
      ctx.fillText('Rivers State', nx, ny + (wide ? 62 : 72));
      if (tag) {
        ctx.fillStyle = GREEN;
        ctx.font = `800 ${wide ? 24 : 28}px ${family}`;
        ctx.fillText(`${CANDIDATE.tag}  ${w.tag}`, nx, ny + (wide ? 96 : 114));
      }
      // emblem, top right
      const es = wide ? 64 : 84;
      ctx.drawImage(emblem, W - pad - es, sh + Math.round(pad * 0.45), es, es);
      if (!q.approved && !quotesApproved[q.id]) {
        ctx.fillStyle = 'rgba(200,32,47,.9)'; ctx.font = `800 26px ${family}`; ctx.fillText('NOT APPROVED', pad, H - 24);
      }
    };
    run().catch(() => {});
    return () => {
      dead = true;
    };
  }, [q, F, fmt, tag, w.tag, quotesApproved]);

  const download = () => {
    const c = ref.current;
    if (!c) return;
    c.toBlob((b) => {
      if (!b) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = `rivers2027-quote-${fmt}-${q?.id}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }, 'image/png');
  };

  const aspect = F.w / F.h;

  return (
    <>
      <PageHead title="Studio" sub="Quote cards in the campaign’s one brand: his words, his portrait, the NDC emblem from his own material. Only approved quotes can be made into cards." prov={['candidate']} />
      <div className="grid g12">
        <div className="col gap14">
          <Card title="1 · Quote">
            {QUOTES.map((x) => {
              const ok = x.approved || quotesApproved[x.id];
              return (
                <label key={x.id} className="chk" style={{ padding: '7px 0', opacity: ok ? 1 : 0.55 }}>
                  <input type="radio" name="q" checked={q?.id === x.id} disabled={!ok} onChange={() => setQid(x.id)} />
                  <span><span className="small">“{x.text}”</span><br /><span className="tiny muted">{x.source}</span> {!ok && <Chip tone="amber">Needs approval</Chip>}</span>
                </label>
              );
            })}
          </Card>
          <Card title="2 · Format">
            <div className="seg" role="group" aria-label="Format">
              {(Object.keys(FORMATS) as FormatKey[]).map((k) => <button key={k} aria-pressed={fmt === k} onClick={() => setFmt(k)}>{k === 'square' ? 'Square' : k === 'story' ? 'Story' : 'Wide'}</button>)}
            </div>
            <p className="tiny muted mt8">{F.label} · {F.w}×{F.h}</p>
            <label className="chk mt12"><input type="checkbox" checked={tag} onChange={(e) => setTag(e.target.checked)} /> Add the week’s tag ({w.tag})</label>
            <button className="btn mt12 block" onClick={download} disabled={!q}>Download PNG</button>
          </Card>
          <Card title="Brand rules" tone="tint">
            <ul className="small" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 5 }}>
              <li>One spelling: <b>Lulu Briggs</b>. Older material with another spelling is retired once this kit is in use (E17).</li>
              <li>Clean white, NDC green, Rivers blue, red. One identity everywhere.</li>
              <li>The NDC emblem comes from his own poster. No national coat of arms and no government marks.</li>
              <li>Only quotes he has approved. A card never carries a claim about a rival.</li>
              <li>Paid placements carry “sponsored” or “paid for by”.</li>
            </ul>
          </Card>
        </div>
        <div className="col gap14">
          <Card title="Preview" right={<Chip tone="gray">{F.w} × {F.h}</Chip>}>
            <div style={{ display: 'grid', placeItems: 'center', background: 'var(--panel)', borderRadius: 12, padding: 14 }}>
              <canvas ref={ref} aria-label="Quote card preview" style={{ width: '100%', maxWidth: fmt === 'story' ? 340 : 620, aspectRatio: String(aspect), height: 'auto', border: '1px solid var(--line)', background: '#fff', borderRadius: 8 }} />
            </div>
          </Card>
          <Card title="Poster library" right={<span className="small muted">From his own material</span>}>
            <div className="grid g3 keep2">
              {[
                ['/img/lulu-briggs-1.jpg', 'Good governance'],
                ['/img/lulu-briggs-2.jpg', 'People’s mandate'],
                ['/img/lulu-briggs-3.png', 'NDC blue'],
              ].map(([src, name]) => (
                <figure key={src} style={{ margin: 0 }}>
                  <Pic src={src} alt={`Poster: ${name}`} w={270} h={380} style={{ width: '100%', height: 'auto', borderRadius: 10, border: '1px solid var(--line)' }} />
                  <figcaption className="tiny muted mt4">{name}</figcaption>
                </figure>
              ))}
            </div>
            <div className="mt12"><Note tone="warn">Posters in circulation carry inconsistent spellings. The designer rebuilds them from the corrected kit in Week 1; these are shown as references only.</Note></div>
          </Card>
        </div>
      </div>
    </>
  );
}
