'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Emblem } from './brand';
import { BottomNav, opsTabsFor } from './bottom-nav';
import { signOut } from '@/lib/auth';
import { useClock, usePersona } from '@/lib/hooks';
import { OPS_NAV, canAccess, navFor } from '@/lib/personas';
import { setState, useStore } from '@/lib/store';

const GROUP_ORDER = ['Candidate', 'Campaign', 'Message', 'Money', 'Ground', 'Election', 'Reference'];

export function OpsShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const persona = usePersona();
  const clock = useClock();
  const showSources = useStore((s) => s.showSources);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const items = navFor(persona.id);
  const groups = GROUP_ORDER.map((g) => ({ g, rows: items.filter((i) => i.group === g) })).filter((x) => x.rows.length);
  const agents = canAccess(persona.id, '/agents');
  const champion = canAccess(persona.id, '/champion');

  // Close the desk sheet on Escape. Choosing a desk closes it already.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="ops">
      {open && <div className="side-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
      <aside className={`side ${open ? 'open' : ''}`} aria-label="Desks">
        <div className="brand">
          <Emblem size={38} />
          <div><b>DLB2027</b><span>Campaign HQ</span></div>
          <span className="sp" />
          <button className="side-x" onClick={() => setOpen(false)} aria-label="Close the desk list">✕</button>
        </div>
        <nav>
          {groups.map(({ g, rows }) => (
            <div key={g}>
              <div className="grp">{g}</div>
              {rows.map((i) => (
                <Link key={i.href} href={i.href} aria-current={path === i.href || path.startsWith(i.href + '/') ? 'page' : undefined} onClick={() => setOpen(false)}>
                  {i.label}
                </Link>
              ))}
            </div>
          ))}
          <div className="grp">Apps</div>
          <Link href="/" onClick={() => setOpen(false)}>Public site</Link>
          {agents && <Link href="/agents" onClick={() => setOpen(false)}>Agents’ app</Link>}
          {champion && <Link href="/champion" onClick={() => setOpen(false)}>Champion page</Link>}
        </nav>
      </aside>
      <div className="omain">
        <div className="otop">
          <div className="who">
            <b>{persona.name}</b>
            <span className="muted hide-sm">· {persona.role}</span>
          </div>
          <span className="small muted hide-sm">As of <b style={{ color: 'var(--ink)' }}>{clock.short}</b></span>
          <div className="s-acct">
            <button className="s-acctbtn" onClick={() => setMenu((m) => !m)} aria-haspopup="menu" aria-expanded={menu}>
              <span className="av">{persona.initials}</span>
              <span className="s-acctname hide-sm">Account</span>
            </button>
            {menu && (
              <>
                <button className="s-catch" aria-label="Close menu" onClick={() => setMenu(false)} />
                <div className="s-pop right" role="menu">
                  <div className="s-pop-h"><b>{persona.name}</b><span>{persona.role}</span></div>
                  <Link role="menuitem" href="/" onClick={() => setMenu(false)}>Public site</Link>
                  <Link role="menuitem" href="/signin" onClick={() => setMenu(false)}>Switch role</Link>
                  <button role="menuitem" onClick={() => { setState({ showSources: !showSources }); setMenu(false); }}>Data sources: {showSources ? 'on' : 'off'}</button>
                  <button role="menuitem" onClick={() => { setMenu(false); signOut(); }}>Sign out</button>
                </div>
              </>
            )}
          </div>
        </div>
        <main className="page">{children}</main>
        <BottomNav className="bnav-ops" label="Desks" path={path} tabs={opsTabsFor(persona.id, () => setOpen((o) => !o), open)} />
      </div>
    </div>
  );
}

export { OPS_NAV };
