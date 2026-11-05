'use client';

import Link from 'next/link';
import { LGA_LIST, WARDS, type Ward } from '@/data/geo';
import { WEEKS, type Week } from '@/data/weeks';
import { weekOf } from '@/lib/clock';
import { useClock } from '@/lib/hooks';
import { Icon } from './brand';

export function Back({ href = '/', label = 'Back' }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="row gap4 small b" style={{ marginBottom: 10, display: 'inline-flex' }}>
      <Icon name="back" size={16} /> {label}
    </Link>
  );
}

export function whatsapp(text: string) {
  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener');
}

export function ShareBtn({ text, label = 'Share on WhatsApp', path }: { text: string; label?: string; path?: string }) {
  return (
    <button
      className="btn sec block"
      onClick={() => {
        const link = path ? window.location.origin + path : '';
        whatsapp(link ? `${text} ${link}` : text);
      }}
    >
      <Icon name="share" size={16} /> {label}
    </button>
  );
}

export function WardSelect({ value, onChange, id, label = 'Your ward' }: { value: string; onChange: (v: string) => void; id?: string; label?: string }) {
  return <label className="fld" htmlFor={id}><span>{label}</span><select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
    <option value="">Choose your ward</option>
    {LGA_LIST.map((lga) => <optgroup key={lga.key} label={lga.name}>{WARDS.filter((ward) => ward.lga === lga.key).map((ward) => <option key={ward.slug} value={ward.slug}>{ward.name}</option>)}</optgroup>)}
  </select></label>;
}

/** The campaign week the demo clock is in (Week 1 before launch). */
export function useWeek(): Week {
  const c = useClock();
  const w = Math.max(1, Math.min(13, weekOf(c.date)));
  return WEEKS[w - 1];
}
