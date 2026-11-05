'use client';

import { useState } from 'react';
import { whatsapp } from '@/components/bits';
import { Pic } from '@/components/brand';
import { NEWS } from '@/data/content';
import { dayLabel } from '@/lib/format';

export function NewsList() {
  const [open, setOpen] = useState<string | null>('palace');
  return (
    <div className="col gap14">
      {NEWS.map((n) => {
        const isOpen = open === n.id;
        return (
          <article className="pcard" key={n.id} style={{ margin: 0 }}>
            <button className="row top" style={{ border: 0, background: 'none', padding: 0, textAlign: 'left', width: '100%' }} onClick={() => setOpen(isOpen ? null : n.id)} aria-expanded={isOpen}>
              <div className="sp">
                <div className="tiny b" style={{ color: 'var(--red-text)', letterSpacing: '.07em', textTransform: 'uppercase' }}>{n.kicker}{n.date ? ` · ${dayLabel(n.date, true)}` : ''}</div>
                <div className="tt mt4" style={{ fontSize: 17 }}>{n.title}</div>
                <div className="mm">{n.source}</div>
              </div>
              <span aria-hidden="true" style={{ fontSize: 22, color: 'var(--faint)' }}>{isOpen ? '−' : '+'}</span>
            </button>
            <p className="small mt8">{n.summary}</p>
            {isOpen && (
              <div className="col gap8 mt8">
                {n.image && (
                  <figure className="photo" style={{ margin: 0 }}>
                    <Pic src={n.image} alt={n.imageCaption ?? n.title} w={706} h={742} />
                    <figcaption className="tiny muted" style={{ padding: '6px 10px' }}>{n.imageCaption}</figcaption>
                  </figure>
                )}
                {n.body.map((p, i) => (
                  <p key={i} className="small">{p}</p>
                ))}
                <button className="btn sec sm" style={{ alignSelf: 'flex-start' }} onClick={() => whatsapp(`${n.title}: ${n.summary}`)}>Share on WhatsApp</button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
