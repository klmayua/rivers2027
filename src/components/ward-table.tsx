'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Bar, Chip } from './ui';
import { num } from '@/lib/format';
import type { WardMetrics } from '@/lib/model';

type SortKey = 'name' | 'readiness' | 'coverage' | 'signups';

export function WardTable({ rows, showLga = true }: { rows: WardMetrics[]; showLga?: boolean }) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<SortKey>('name');
  const list = useMemo(() => {
    const f = rows.filter((r) => r.ward.name.toLowerCase().includes(q.trim().toLowerCase()));
    const s = [...f];
    if (sort === 'name') s.sort((a, b) => a.ward.name.localeCompare(b.ward.name));
    if (sort === 'readiness') s.sort((a, b) => a.readiness - b.readiness);
    if (sort === 'coverage') s.sort((a, b) => a.coveragePct - b.coveragePct);
    if (sort === 'signups') s.sort((a, b) => b.signups - a.signups);
    return s;
  }, [rows, q, sort]);

  return (
    <>
      <div className="row gap8 wrap mb12">
        <input type="search" placeholder="Find a ward" aria-label="Find a ward" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 240 }} />
        <label className="row gap6 small">Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} style={{ width: 'auto' }} aria-label="Sort wards">
            <option value="name">Name</option>
            <option value="readiness">Least ready first</option>
            <option value="coverage">Lowest coverage first</option>
            <option value="signups">Most sign-ups first</option>
          </select>
        </label>
        <span className="sp" />
        <span className="small muted">{list.length} of {rows.length} wards</span>
      </div>
      <div className="tw">
        <table className="tbl">
          <thead>
            <tr>
              <th>Ward</th>
              {showLga && <th>LGA</th>}
              <th className="num">Units</th>
              <th className="num">Registered voters</th>
              <th>Coordinator</th>
              <th style={{ minWidth: 150 }}>Captains</th>
              <th className="num">Sign-ups</th>
              <th>Readiness</th>
              <th>Flag</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.ward.slug}>
                <td><Link href={`/ops/ward/${r.ward.slug}`} className="b">{r.ward.name}</Link></td>
                {showLga && <td className="small">{r.ward.senatorialDistrict}</td>}
                <td className="num">{r.ward.pus}</td>
                <td className="num">{r.ward.registered ? num(r.ward.registered) : '—'}</td>
                <td className="small">{r.coordinatorNamed ? 'Named' : <span className="muted">Not yet</span>}</td>
                <td>
                  <div className="row gap6"><div className="sp"><Bar pct={r.coveragePct} /></div><span className="tiny b">{r.captains}/{r.ward.pus}</span></div>
                </td>
                <td className="num">{num(r.signups)}</td>
                <td><Chip tone={r.readiness >= 70 ? undefined : r.readiness >= 40 ? 'amber' : 'red'}>{r.readiness}%</Chip></td>
                <td className="small">{r.flag ? <span className="red b">{r.flag}</span> : <span className="muted">–</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
