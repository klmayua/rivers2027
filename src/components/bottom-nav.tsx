'use client';

import Link from 'next/link';
import { Icon } from './brand';
import type { PersonaId } from '@/lib/personas';

/**
 * One bottom bar for the private workspaces. The agents' phone app uses it as its only navigation; on a
 * phone the campaign desks use it too, with "Desks" opening the full list. Thumb-first: every target is
 * at least 46px tall and the bar clears the iPhone home indicator. (The public site has its own bar in
 * components/site/shell.tsx, with Support raised in the centre.)
 */
export type Tab =
  | { kind: 'link'; href: string; label: string; icon: string; exact?: boolean }
  | { kind: 'fab'; href: string; label: string; icon: string; tone: 'green' | 'red' }
  | { kind: 'action'; label: string; icon: string; onClick: () => void; tone?: 'green' | 'red' }
  | { kind: 'more'; label: string; icon: string; onClick: () => void; open?: boolean };

export function isTabActive(path: string, href: string, exact?: boolean): boolean {
  if (exact) return path === href;
  return path === href || path.startsWith(href + '/');
}

import { motion } from 'framer-motion';

export function BottomNav({ tabs, path, label = 'Main', className = '' }: { tabs: Tab[]; path: string; label?: string; className?: string }) {
  return (
    <nav className={`bnav ${className}`} aria-label={label} style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
      {tabs.map((t) => {
        if (t.kind === 'fab') {
          return (
            <motion.div key={t.href} whileTap={{ scale: 0.92 }} style={{ display: 'contents' }}>
              <Link href={t.href} className={`bnav-fab ${t.tone}`} aria-current={isTabActive(path, t.href) ? 'page' : undefined}>
                <i><Icon name={t.icon} size={24} /></i>
                {t.label}
              </Link>
            </motion.div>
          );
        }
        if (t.kind === 'action') {
          return (
            <motion.div key={t.label} whileTap={{ scale: 0.92 }} style={{ display: 'contents' }}>
              <button type="button" className={t.tone ? `bnav-fab ${t.tone}` : 'bnav-btn'} onClick={t.onClick} aria-haspopup={t.tone ? 'dialog' : undefined}>
                {t.tone ? <i><Icon name={t.icon} size={24} /></i> : <Icon name={t.icon} />}
                {t.label}
              </button>
            </motion.div>
          );
        }
        if (t.kind === 'more') {
          return (
            <motion.div key={t.label} whileTap={{ scale: 0.92 }} style={{ display: 'contents' }}>
              <button type="button" className="bnav-btn" onClick={t.onClick} aria-expanded={t.open} aria-current={t.open ? 'page' : undefined}>
                <Icon name={t.icon} />
                {t.label}
              </button>
            </motion.div>
          );
        }
        return (
          <motion.div key={t.href} whileTap={{ scale: 0.92 }} style={{ display: 'contents' }}>
            <Link href={t.href} aria-current={isTabActive(path, t.href, t.exact) ? 'page' : undefined}>
              <Icon name={t.icon} />
              {t.label}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}

type Row = { href: string; label: string; icon: string };

/**
 * The four desks each role reaches for most, plus "Desks". Keyed by role so a ward coordinator's thumb
 * lands on her ward, not on the candidate's cockpit. Every href here is a desk that role may open.
 */
const OPS_TABS: Partial<Record<PersonaId, Row[]>> = {
  principal: [
    { href: '/ops/principal', label: 'Today', icon: 'home' },
    { href: '/ops/approvals', label: 'Approve', icon: 'check' },
    { href: '/ops/scorecard', label: 'Score', icon: 'chart' },
    { href: '/ops/ledger', label: 'Money', icon: 'wallet' },
  ],
  manager: [
    { href: '/ops/command', label: 'Command', icon: 'grid' },
    { href: '/ops/plan', label: 'Plan', icon: 'calendar' },
    { href: '/ops/structure', label: 'Wards', icon: 'map' },
    { href: '/ops/election', label: 'Day', icon: 'flag' },
  ],
  comms: [
    { href: '/ops/press', label: 'Press', icon: 'news' },
    { href: '/ops/trend', label: 'Push', icon: 'zap' },
    { href: '/ops/sms', label: 'SMS', icon: 'send' },
    { href: '/ops/studio', label: 'Studio', icon: 'camera' },
  ],
  finance: [
    { href: '/ops/ledger', label: 'Ledger', icon: 'wallet' },
    { href: '/ops/giving', label: 'Giving', icon: 'heart' },
    { href: '/ops/counsel', label: 'Gates', icon: 'scale' },
    { href: '/ops/assumptions', label: 'Sources', icon: 'book' },
  ],
  lga_ne: [
    { href: '/ops/lga/abua-odual', label: 'My LGA', icon: 'map' },
    { href: '/ops/structure', label: 'Wards', icon: 'grid' },
    { href: '/ops/people', label: 'People', icon: 'users' },
    { href: '/ops/events', label: 'Events', icon: 'calendar' },
  ],
  lga_south: [
    { href: '/ops/lga/ahoada-east', label: 'My LGA', icon: 'map' },
    { href: '/ops/structure', label: 'Wards', icon: 'grid' },
    { href: '/ops/desk', label: 'Desk', icon: 'help' },
    { href: '/ops/events', label: 'Events', icon: 'calendar' },
  ],
  ward: [
    { href: '/ops/ward/abua-i-01', label: 'My ward', icon: 'pin' },
    { href: '/ops/people', label: 'People', icon: 'users' },
    { href: '/ops/desk', label: 'Desk', icon: 'help' },
    { href: '/ops/events', label: 'Events', icon: 'calendar' },
  ],
};

export function opsTabsFor(id: PersonaId, onMore: () => void, moreOpen: boolean): Tab[] {
  const rows = (OPS_TABS[id] ?? OPS_TABS.manager ?? []).map((r) => ({ kind: 'link' as const, href: r.href, label: r.label, icon: r.icon }));
  return [...rows, { kind: 'more', label: 'Desks', icon: 'grid', onClick: onMore, open: moreOpen }];
}
