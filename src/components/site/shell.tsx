'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Emblem, Icon, Portrait, Stripe } from '@/components/brand';
import { GiveModal } from '@/components/give';
import { OgamiDock } from '@/components/ogami-chat';
import { MORE_GROUPS, NAV_MAIN, FOOT_COLS } from '@/data/site';
import { CANDIDATE } from '@/data/campaign';
import { signOut, useSession } from '@/lib/auth';
import { setState, useStore } from '@/lib/store';
import { openGive } from '@/lib/ui-state';

function active(path: string, href: string): boolean {
  if (href === '/') return path === '/';
  return path === href || path.startsWith(href + '/');
}

/** Close a popup menu with Escape. */
function useEscape(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, close]);
}

function Account({ onNav }: { onNav?: () => void }) {
  const { signedIn, persona } = useSession();
  const [open, setOpen] = useState(false);
  useEscape(open, () => setOpen(false));
  if (!signedIn) {
    return (
      <Link className="btn ghost sm s-signin" href="/signin" onClick={onNav}>
        <Icon name="lock" size={15} /> Sign-In
      </Link>
    );
  }
  return (
    <div className="s-acct">
      <button className="btn ghost sm s-signin" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        <Icon name="lock" size={15} /> Sign-In
      </button>
      {open && (
        <>
          <button className="s-catch" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="s-pop" role="menu">
            <div className="s-pop-h"><b>{persona.name}</b><span>{persona.role}</span></div>
            <Link role="menuitem" href={persona.home} onClick={() => setOpen(false)}>Open my workspace</Link>
            <Link role="menuitem" href="/signin" onClick={() => setOpen(false)}>Switch role</Link>
            <button role="menuitem" onClick={() => { setOpen(false); signOut(); }}>Sign out</button>
          </div>
        </>
      )}
    </div>
  );
}

function MoreMenu({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  useEscape(open, () => setOpen(false));
  const items = MORE_GROUPS.flatMap((g) => g.items);
  const any = items.some((i) => active(path, i.href) && !NAV_MAIN.some((n) => n.href === i.href));
  return (
    <div className="s-more">
      <button className={`s-link ${any ? 'on' : ''}`} onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        More <Icon name="down" size={14} />
      </button>
      {open && (
        <>
          <button className="s-catch" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="s-mega" role="menu">
            {MORE_GROUPS.map((g) => (
              <div key={g.title}>
                <div className="s-mega-t">{g.title}</div>
                {g.items.map((i) => (
                  <Link key={i.href} href={i.href} role="menuitem" onClick={() => setOpen(false)}>
                    <span className="ic"><Icon name={i.icon} size={18} /></span>
                    <span><b>{i.t}</b><small>{i.s}</small></span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MoreSheet({ onClose }: { onClose: () => void }) {
  const { signedIn, persona } = useSession();
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="s-sheetwrap">
      <button className="s-sheetscrim" aria-label="Close menu" onClick={onClose} />
      <div className="s-sheet" role="dialog" aria-modal="true" aria-label="More">
        <div className="s-grab" aria-hidden="true" />
        <div className="row" style={{ marginBottom: 6 }}>
          <h2 style={{ fontSize: 20 }}>More</h2>
          <span className="sp" />
          <button className="og-x" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {signedIn ? (
          <div className="s-who">
            <span className="av">{persona.initials}</span>
            <div className="sp"><b>{persona.name}</b><span className="small muted">{persona.role}</span></div>
            <Link className="btn sm" href={persona.home} onClick={onClose}>Open</Link>
          </div>
        ) : (
          <Link className="s-signrow" href="/signin" onClick={onClose}>
            <span className="ic"><Icon name="lock" size={20} /></span>
            <span><b>Sign in</b><small>Candidate, campaign team, coordinators, agents, champions and supporters</small></span>
            <span aria-hidden="true">›</span>
          </Link>
        )}
        {MORE_GROUPS.map((g) => (
          <div key={g.title}>
            <div className="s-sheet-t">{g.title}</div>
            <nav className="menu-list" aria-label={g.title}>
              {g.items.map((i) => (
                <Link key={i.href} href={i.href} onClick={onClose}>
                  <span className="ic"><Icon name={i.icon} /></span>
                  <div>{i.t}<span>{i.s}</span></div>
                </Link>
              ))}
            </nav>
          </div>
        ))}
        {signedIn && <button className="btn ghost block mt16" onClick={() => { onClose(); signOut(); }}>Sign out</button>}
        <p className="tiny muted mt16" style={{ textAlign: 'center' }}>
          <Link href="/privacy" onClick={onClose}>Privacy</Link> · {CANDIDATE.closing}
        </p>
      </div>
    </div>
  );
}

function Footer() {
  const showSources = useStore((s) => s.showSources);
  return (
    <footer className="s-foot">
      <Stripe />
      <div className="wrap s-foot-in">
        <div className="s-foot-brand">
          <div className="row gap8"><Emblem size={44} /><div><b>{CANDIDATE.short}</b><div className="small">NDC candidate · {CANDIDATE.constituency}</div></div></div>
          <p className="mt12">{CANDIDATE.closing}</p>
          <p className="small mt8">Election: Saturday 6 March 2027.</p>
          <button className="s-support-foot btn red mt16" onClick={() => openGive({ channel: 'site' })}>Support the campaign</button>
        </div>
        {FOOT_COLS.map((c) => (
          <div key={c.title}>
            <h4>{c.title}</h4>
            <ul>
              {c.links.map((l) => (
                <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="wrap s-foot-base">
        <p>
          © 2026 Chief Barr. Dumo Lulu Briggs for Rivers. Prepared by Farawa Media/PR Vil. Square (RC 1970176), 5 Admiralty Road, Lekki Phase 1, Lagos. Not an official INEC or NDC site. Campaign finance limits and applicable rules are pending legal review.
        </p>
        <p>
          Preview build: figures that are illustrative until live data replaces them are marked in the data-sources view.{' '}
          <button className="linkbtn" onClick={() => setState({ showSources: !showSources })} aria-pressed={showSources}>
            Data sources: {showSources ? 'on' : 'off'}
          </button>
          {' · '}<Link href="/privacy">Privacy</Link>{' · '}<Link href="/signin">Sign in</Link>
        </p>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [sheet, setSheet] = useState(false);

  // open the Give popup from a link like /?give=1
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    if (q.get('give')) {
      const t = setTimeout(() => openGive({ group: q.get('g'), ward: q.get('w'), channel: q.get('c') ?? 'site' }), 250);
      return () => clearTimeout(t);
    }
  }, [path]);

  return (
    <div className="site">
      <a className="skip" href="#main">Skip to content</a>
      <header className="s-head">
        <Stripe />
        <div className="s-bar wrap">
          <Link href="/" className="s-brand" aria-label="Chief Barr. Dumo Lulu Briggs: home">
            <Portrait size={40} />
            <span className="s-brandtx"><b>Chief Barr. Dumo Lulu Briggs</b><small>NDC · Rivers State</small></span>
          </Link>
          <nav className="s-nav" aria-label="Main">
            {NAV_MAIN.map((n) => (
              <Link key={n.href} href={n.href} className={`s-link ${active(path, n.href) ? 'on' : ''}`} aria-current={active(path, n.href) ? 'page' : undefined}>{n.label}</Link>
            ))}
            <MoreMenu path={path} />
          </nav>
          <span className="sp s-spacer" />
          <div className="s-cta">
            <Account />
            <button className="btn red s-support" onClick={() => openGive({ channel: 'site' })} aria-haspopup="dialog">
              <Icon name="heart" size={16} /> Support
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="s-main">{children}</main>
      <Footer />

      <nav className="s-bottom" aria-label="Main">
        <motion.div whileTap={{ scale: 0.92 }} style={{ display: 'contents' }}>
          <Link href="/" aria-current={path === '/' ? 'page' : undefined}><Icon name="home" />Home</Link>
        </motion.div>
        <motion.div whileTap={{ scale: 0.92 }} style={{ display: 'contents' }}>
          <Link href="/agenda" aria-current={active(path, '/agenda') ? 'page' : undefined}><Icon name="report" />Agenda</Link>
        </motion.div>
        <motion.div whileTap={{ scale: 0.92 }} style={{ display: 'contents' }}>
          <button className="s-fab" onClick={() => openGive({ channel: 'site' })} aria-haspopup="dialog">
            <i><Icon name="heart" size={24} /></i>
            Support
          </button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.92 }} style={{ display: 'contents' }}>
          <Link href="/ask" aria-current={path === '/ask' ? 'page' : undefined}><Icon name="chat" />Ask</Link>
        </motion.div>
        <motion.div whileTap={{ scale: 0.92 }} style={{ display: 'contents' }}>
          <button className="s-morebtn" onClick={() => setSheet(true)} aria-haspopup="dialog" aria-expanded={sheet}><Icon name="grid" />More</button>
        </motion.div>
      </nav>
      <AnimatePresence>
        {sheet && <MoreSheet onClose={() => setSheet(false)} />}
      </AnimatePresence>

      <OgamiDock />
      <GiveModal />
    </div>
  );
}
