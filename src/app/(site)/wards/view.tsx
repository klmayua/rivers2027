'use client';
import Link from 'next/link';
import { useState } from 'react';
import { LGA_LIST, WARDS } from '@/data/geo';
import { WEEKS } from '@/data/weeks';
import { useWeek } from '@/components/bits';
import { Prov } from '@/components/ui';

export function WardList() {
  const week = useWeek();
  const [q, setQ] = useState('');
  const list = WARDS.filter((ward) => (ward.name + ' ' + ward.lgaName).toLowerCase().includes(q.toLowerCase()));
  return <div className="col gap14">
    <div className="issue"><small>This week · Week {week.n}</small><b>{week.issue}</b></div>
    <input type="search" placeholder="Search LGA or ward" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search LGAs and wards" style={{ maxWidth: 420 }} />
    <div className="col gap14">{LGA_LIST.map((lga) => {
      const rows = list.filter((ward) => ward.lga === lga.key);
      if (!rows.length) return null;
      return <section key={lga.key}><div className="pt">{lga.name} · {lga.wards} wards <Prov k="inec" /></div>
        {rows.map((ward) => <Link key={ward.slug} href={'/w/' + ward.slug + '/' + week.slug} className="pcard" style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'inherit', textDecoration: 'none' }}>
          <div className="sp"><div className="tt">{ward.name}</div><div className="mm">{ward.pus} polling units · registered-voter total unavailable</div></div><span style={{ color: 'var(--faint)', fontSize: 20 }}>›</span>
        </Link>)}
      </section>;
    })}</div>
    <div className="note"><b>About these figures.</b> The supplied INEC-derived source contains Rivers State LGA, ward and polling-unit names. It does not include registered-voter counts.</div>
  </div>;
}

