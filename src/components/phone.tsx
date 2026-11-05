'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Pic } from './brand';
import { BottomNav, type Tab } from './bottom-nav';
import { QR } from './qr';
import { signOut } from '@/lib/auth';
import { PERSONA_BY_ID } from '@/lib/personas';
import { useStore } from '@/lib/store';

/** The agents' app: filing a report is the raised green button. */
const AGENT_NAV: Tab[] = [
  { kind: 'link', href: '/agents', label: 'Briefing', icon: 'news', exact: true },
  { kind: 'link', href: '/agents/map', label: 'Map', icon: 'map' },
  { kind: 'fab', href: '/agents/report', label: 'Report', icon: 'camera', tone: 'green' },
  { kind: 'link', href: '/agents/chat', label: 'Chat', icon: 'chat' },
  { kind: 'link', href: '/agents/more', label: 'More', icon: 'grid' },
];

/** The agents' phone app. On a laptop it sits in a phone-shaped frame with a short caption beside it. */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const persona = useStore((s) => s.persona);
  const p = PERSONA_BY_ID[persona];
  const sub = p.group === 'Ground' ? `${p.name} · ${p.role}` : 'Coordinators and polling-unit agents';

  return (
    <div className="stage">
      <aside className="cap">
        <div className="chip blue">Agents’ app</div>
        <h2 className="mt12" style={{ fontSize: 24, letterSpacing: '-0.02em' }}>The ground team in one place.</h2>
        <p className="muted mt8">Open a link, add it to the home screen, and it works with no signal. A coordinator approves every agent before they see the chat or the map.</p>
        <div className="mt16"><QR path="/agents" size={120} /></div>
        <p className="tiny muted mt8">Scan to open on your phone.</p>
        <div className="mt16 row gap8 wrap">
          <Link className="btn sec sm" href="/">Public site</Link>
          <Link className="btn sec sm" href="/signin">Switch role</Link>
          <button className="btn ghost sm" onClick={() => signOut()}>Sign out</button>
        </div>
      </aside>
      <div className="phone">
        <div className="stripe" />
        <div className="pbar">
          <Pic src="/img/lulu-briggs-1.jpg" alt="Chief Barr. Dumo Lulu Briggs" w={76} h={76} priority />
          <div className="sp" style={{ minWidth: 0 }}>
            <div className="t">DLB2027 Agents</div>
            <div className="s">{sub}</div>
          </div>
          <Pic src="/img/ndc-badge.svg" alt="NDC" w={72} h={72} style={{ width: 34, height: 34 }} />
        </div>
        <div className="pscroll" id="pscroll">{children}</div>
        <BottomNav tabs={AGENT_NAV} path={path} />
      </div>
    </div>
  );
}
