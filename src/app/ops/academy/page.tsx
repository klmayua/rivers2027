'use client';

import Link from 'next/link';
import { Bar, Card, Chip, Note, PageHead, Prov, Stat } from '@/components/ui';
import { QR } from '@/components/qr';
import { dayLabel, num } from '@/lib/format';
import { useMetrics, useWardMetrics } from '@/lib/hooks';
import { useStore } from '@/lib/store';

export default function Academy() {
  const m = useMetrics();
  const rows = useWardMetrics();
  const regs = useStore((s) => s.academy);
  const top = [...rows].sort((a, b) => b.academy - a.academy).slice(0, 10);
  const max = top[0]?.academy || 1;

  return (
    <>
      <PageHead
        title="Youth Digital Academy"
        sub="Free digital skills training for every young person in Rivers, whatever their party, church or village, run with NSP Africa. Registration opens with the site on 21 October."
        actions={<Link href="/academy" className="btn sec">Open the public page</Link>}
        prov={['sample']}
      />
      <div className="grid g4 keep2">
        <Card><Stat label="Registered" value={num(m.academy + regs.length)} prov="sample" /></Card>
        <Card><Stat label="Completed" value={num(m.academyDone)} prov="sample" /></Card>
        <Card><Stat label="Registered from this browser" value={regs.length} sub="Via the public site" /></Card>
        <Card><Stat label="Completion so far" value={m.academy ? `${Math.round((m.academyDone / m.academy) * 100)}%` : '–'} prov="sample" /></Card>
      </div>

      <div className="grid g21 mt16">
        <Card title="Registrations by ward" right={<Prov k="sample" />}>
          {top.map((r) => (
            <div key={r.ward.slug} style={{ padding: '5px 0' }}>
              <div className="row small"><span className="sp">{r.ward.name}</span><b>{num(r.academy)}</b></div>
              <Bar pct={(r.academy / max) * 100} />
            </div>
          ))}
          <p className="tiny muted mt8">No approved youth programme data has been supplied.</p>
        </Card>
        <div className="col gap14">
          <Card title="Registration link">
            <div style={{ display: 'grid', placeItems: 'center' }}><QR path="/academy" size={130} label="QR code for Academy registration" /></div>
            <p className="tiny muted mt8" style={{ textAlign: 'center' }}>Put this on posters and in the youth-forum groups.</p>
          </Card>
          <Note tone="warn">NSP Africa’s course list, terms, cohort size, dates and registration link are still to be confirmed (open item 22). Until then the app takes interest registrations only.</Note>
        </div>
      </div>

      <Card title="Registered from this browser" className="mt16">
        {regs.length === 0 && <p className="small muted">Register in the public app under Academy and it appears here.</p>}
        {regs.map((a) => (
          <div className="li" key={a.id}><div className="av">{a.initials}</div><div className="sp small"><b>{a.initials}</b> · {a.course}<div className="tiny muted">{a.ward}</div></div><Chip>Registered</Chip><span className="tiny muted">{dayLabel(a.at.slice(0, 10))}</span></div>
        ))}
      </Card>
    </>
  );
}
