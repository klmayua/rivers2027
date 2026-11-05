'use client';

import Link from 'next/link';
import { QR } from '@/components/qr';
import { ShareBtn } from '@/components/bits';
import { PageHero, Section } from '@/components/site/ui';
import { GiveButton } from '@/components/site/islands';
import { WARD_BY_SLUG } from '@/data/geo';
import { dayLabel, naira } from '@/lib/format';
import { useSession } from '@/lib/auth';
import { useStore } from '@/lib/store';

export function MyPage() {
  const { persona } = useSession();
  const gifts = useStore((s) => s.gifts);
  const tickets = useStore((s) => s.tickets);
  const signups = useStore((s) => s.signups);
  const academy = useStore((s) => s.academy);
  const code = gifts[0]?.code ?? 'rivers';
  const total = gifts.reduce((a, g) => a + g.amount, 0);
  return (
    <>
      <PageHero eyebrow="My page" title={`Welcome, ${persona.id === 'public' ? 'friend of Rivers' : persona.name}.`} lead="What you have given, asked and joined, and how to bring a friend." />
      <Section>
        <div className="s-grid2">
          <div className="card">
            <h3>Your gifts</h3>
            {gifts.length === 0 ? <p className="small muted mt8">You have not given yet. Small gifts from many people are how Rivers funds this campaign.</p> : (
              <>
                <div className="stat mt8"><div className="v">{naira(total)}</div><div className="d">{gifts.length} gift{gifts.length > 1 ? 's' : ''}, each receipted and entered in the ledger</div></div>
                {gifts.slice().reverse().slice(0, 5).map((g) => (
                  <div key={g.id} className="row small" style={{ padding: '7px 0', borderTop: '1px solid var(--line)' }}><b>{g.ref}</b><span className="sp" /><span>{naira(g.amount)} · {dayLabel(g.at.slice(0, 10))}</span></div>
                ))}
              </>
            )}
            <div className="mt12"><GiveButton className="btn red">Give</GiveButton></div>
          </div>
          <div className="card">
            <h3>Your link</h3>
            <p className="small muted mt4">Pass it on. Gifts through your link are counted for you, never shown by name.</p>
            <div className="row mt12" style={{ gap: 16, alignItems: 'center' }}>
              <QR path={`/s/${code}`} size={110} />
              <div className="col gap8 sp"><div className="kbd" style={{ wordBreak: 'break-all' }}>/s/{code}</div><ShareBtn text="Join me in backing Chief Barr. Dumo Lulu Briggs for Rivers State:" path={`/s/${code}`} /></div>
            </div>
          </div>
          <div className="card">
            <h3>Your questions</h3>
            {tickets.length === 0 ? <p className="small muted mt8">No questions yet. The Help Desk answers every one within 5 working days.</p> : tickets.slice(0, 4).map((t) => (
              <div key={t.id} className="small" style={{ padding: '7px 0', borderTop: '1px solid var(--line)' }}><b>{t.ref}</b> · {t.topic}{t.ward ? ` · ${WARD_BY_SLUG[t.ward]?.name ?? ''}` : ''}<div className="muted">{t.message.slice(0, 90)}</div></div>
            ))}
            <div className="mt12"><Link href="/help-desk" className="btn sec">Ask a question</Link></div>
          </div>
          <div className="card">
            <h3>What you have joined</h3>
            <ul className="small mt8" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
              <li>{signups.length ? `${signups.length} team sign-up${signups.length > 1 ? 's' : ''} from this browser` : 'Not on the ground team yet'}</li>
              <li>{academy.length ? `${academy.length} Academy registration${academy.length > 1 ? 's' : ''}` : 'Not registered for the Youth Academy'}</li>
            </ul>
            <div className="row gap8 wrap mt12"><Link href="/get-involved" className="btn sec sm">Join the team</Link><Link href="/academy" className="btn sec sm">Academy</Link></div>
          </div>
        </div>
      </Section>
    </>
  );
}
