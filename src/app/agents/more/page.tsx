'use client';

import Link from 'next/link';
import { QR } from '@/components/qr';
import { Chip } from '@/components/ui';
import { AGENT_RULES } from '@/data/campaign';
import { WEEKS } from '@/data/weeks';
import { weekOf } from '@/lib/clock';
import { useClock } from '@/lib/hooks';
import { setState, useStore } from '@/lib/store';
import { PERSONA_BY_ID } from '@/lib/personas';
import { signOut } from '@/lib/auth';

export default function AgentsMore() {
  const clock = useClock();
  const offline = useStore((s) => s.offline);
  const personaId = useStore((s) => s.persona);
  const me = PERSONA_BY_ID[personaId];
  const cur = Math.max(1, Math.min(13, weekOf(clock.date)));
  return (
    <div className="col gap14">
      <h2 style={{ fontSize: 18 }}>More</h2>
      <div className="card tint">
        <h3>Invite a new agent</h3>
        <p className="small mt4">Anyone who opens this link or scans the code lands on your ward’s page and can ask to join. You approve them before they see the chat or the map.</p>
        <div className="mt12"><QR path="/join/abua-i-01" size={118} /></div>
      </div>
      <div className="card">
        <div className="row"><h3 className="sp">Work offline</h3>{offline ? <Chip tone="amber">Offline mode</Chip> : <Chip>Online</Chip>}</div>
        <p className="small muted mt4">The app opens with no signal. Reports are saved on the phone with their original time and sent when you are back online. Switch this on to see it.</p>
        <button className="btn sec sm mt8" onClick={() => setState({ offline: !offline })}>{offline ? 'Go back online' : 'Simulate no signal'}</button>
      </div>
      <div className="card">
        <h3>Install on your phone</h3>
        <ol className="small mt8" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 5 }}>
          <li>Open this link in Chrome or Safari.</li>
          <li>Choose “Add to home screen”.</li>
          <li>Open it from the icon: it works like an app, with no app store.</li>
        </ol>
      </div>
      <div className="card">
        <h3>Rules for agents</h3>
        <ul className="small mt8" style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
          {AGENT_RULES.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h3>Earlier briefings</h3>
        <div className="mt8">
          {WEEKS.slice(0, cur).reverse().map((w) => (
            <div className="row small" key={w.n} style={{ padding: '6px 0', borderBottom: '1px solid var(--line)' }}>
              <b style={{ width: 54 }}>Week {w.n}</b><span className="sp">{w.issue}</span><span className="chip gray">{w.tag}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card panel">
        <h3>Your account</h3>
        <p className="small mt4"><b>{me.name}</b> · {me.role}</p>
        <div className="row gap6 wrap mt8">
          <Link href="/signin" className="btn sec sm">Switch role</Link>
          <button className="btn ghost sm" onClick={() => signOut()}>Sign out</button>
        </div>
        <p className="tiny muted mt8">The ward map, approvals and report screens change with the role.</p>
      </div>
      <Link href="/" className="btn ghost block">Public site</Link>
    </div>
  );
}
