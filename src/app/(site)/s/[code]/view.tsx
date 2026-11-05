'use client';

import Link from 'next/link';
import { Back } from '@/components/bits';
import { Pic } from '@/components/brand';
import { CANDIDATE, CONTRACT } from '@/data/campaign';
import { openGive } from '@/lib/ui-state';

/** A supporter's personal link: a friend asked you to back Rivers. Gifts through it are counted for them, never by name. */
export function Personal({ code }: { code: string }) {
  return (
    <div className="narrow s-pad col gap14">
      <Back href="/" label="Home" />
      <div className="heroc">
        <div>
          <h2>A friend asked you to back Rivers.</h2>
          <p>Chief Barr. Dumo Lulu Briggs is asking Rivers to fund his campaign in small gifts. Every gift gets a receipt.</p>
          <button className="btn red sm" onClick={() => openGive({ channel: 'personal-link' })}>Give</button>
        </div>
        <Pic src="/img/lulu-briggs-1.jpg" alt={CANDIDATE.short} w={224} h={276} />
      </div>
      <p className="tiny muted">Link code <span className="kbd">{code}</span>. Gifts through this link are counted for the person who shared it, never shown by name.</p>
      <div>
        <div className="pt">The Rivers Contract</div>
        {CONTRACT.map((c) => (
          <div className="promise" key={c.n}><div className="k">{c.n}</div><div><b>{c.title}</b><span>{c.body}</span></div></div>
        ))}
      </div>
      <Link href="/" className="btn sec block">See the campaign site</Link>
    </div>
  );
}
