/** Roles and what each one sees. Role names only: no invented people. */
import { WARD_BY_SLUG } from '@/data/geo';

export type PersonaId =
  | 'principal'
  | 'manager'
  | 'comms'
  | 'finance'
  | 'lga_ne'
  | 'lga_south'
  | 'ward'
  | 'pu'
  | 'champion'
  | 'public';

export type Persona = {
  id: PersonaId;
  /** Full title shown in menus. */
  label: string;
  short: string;
  group: 'HQ' | 'Ground' | 'Community';
  home: string;
  /** What this person experiences after signing in. */
  blurb: string;
  scope?: string;
  /** Sign-in card: the account name and its role line. */
  name: string;
  role: string;
  initials: string;
  username: string;
  device: 'Desktop' | 'Phone' | 'Desktop and phone';
};

export const PASSWORD = 'rivers2027';

export const PERSONAS: Persona[] = [
  { id: 'principal', label: 'The candidate', short: 'Candidate', group: 'HQ', home: '/ops/principal', name: 'Chief Barr. Dumo Lulu Briggs', role: 'Candidate', initials: 'DL', username: 'd.lulubriggs', device: 'Desktop and phone', blurb: 'Your cockpit: today, approvals, the ground, giving and the path to the seat.' },
  { id: 'manager', label: 'Campaign manager', short: 'Manager', group: 'HQ', home: '/ops/command', name: 'Campaign Manager', role: 'Command room', initials: 'CM', username: 'campaign.manager', device: 'Desktop and phone', blurb: 'The command room: plan, gates, structure, desks, risks and the Friday scorecard.' },
  { id: 'comms', label: 'Communications lead', short: 'Comms', group: 'HQ', home: '/ops/press', name: 'Communications Lead', role: 'Press, SMS and the trend', initials: 'CL', username: 'comms.lead', device: 'Desktop and phone', blurb: 'Releases, the Thursday One Push, SMS, creators, events and the quote-card studio.' },
  { id: 'finance', label: 'Finance officer and counsel', short: 'Finance', group: 'HQ', home: '/ops/ledger', name: 'Finance Officer and Counsel', role: 'Cap ledger and gates', initials: 'FC', username: 'finance', device: 'Desktop and phone', blurb: 'The cap ledger, gifts, gates and the register of open legal questions.' },
  { id: 'lga_ne', label: 'LGA coordinator · Abua-Odual', short: 'LGA · Abua-Odual', group: 'Ground', home: '/ops/lga/abua-odual', name: 'LGA Coordinator', role: 'Abua-Odual', initials: 'AO', username: 'lga.abua-odual', device: 'Desktop and phone', blurb: '13 wards and INEC-listed polling units: coverage, readiness and local events.', scope: 'abua-odual' },
  { id: 'lga_south', label: 'LGA coordinator · Ahoada East', short: 'LGA · Ahoada East', group: 'Ground', home: '/ops/lga/ahoada-east', name: 'LGA Coordinator', role: 'Ahoada East', initials: 'AE', username: 'lga.ahoada-east', device: 'Desktop and phone', blurb: '13 wards and INEC-listed polling units: coverage, readiness and local events.', scope: 'ahoada-east' },
  { id: 'ward', label: 'Ward coordinator · Abua I', short: 'Ward · Abua I', group: 'Ground', home: '/ops/ward/abua-i-01', name: 'Ward Coordinator', role: 'Abua I', initials: 'WC', username: 'ward.abua-i', device: 'Desktop and phone', blurb: 'One ward: its polling units, captains, sign-ups, issues and chat.', scope: 'abua-i-01' },
  { id: 'pu', label: 'Polling-unit agent · Abua I, PU 001', short: 'PU agent', group: 'Ground', home: '/agents', name: 'Polling-Unit Agent', role: 'Abua I, PU 001', initials: 'PA', username: 'agent.abua-i-001', device: 'Phone', blurb: 'The agents’ app on a phone: briefing, report, chat, and polling-unit information.', scope: 'abua-i-01-001' },
  { id: 'champion', label: 'Champion · Rivers community', short: 'Champion', group: 'Community', home: '/champion', name: 'Champion', role: 'Rivers community', initials: 'CH', username: 'champion', device: 'Phone', blurb: 'Campaign information and approved community materials.', scope: 'rivers-community' },
  { id: 'public', label: 'Supporter', short: 'Supporter', group: 'Community', home: '/me', name: 'Supporter', role: 'Rivers voter, supporter or diaspora', initials: 'SP', username: 'supporter', device: 'Phone', blurb: 'Your own page: what you have given, asked and joined, and how to bring a friend.' },
];

export const PERSONA_BY_ID: Record<PersonaId, Persona> = Object.fromEntries(PERSONAS.map((p) => [p.id, p])) as Record<PersonaId, Persona>;

export const GROUP_LABEL: Record<Persona['group'], string> = {
  HQ: 'Campaign HQ',
  Ground: 'Ground team',
  Community: 'Community and supporters',
};

export type NavItem = { href: string; label: string; group: string; roles: PersonaId[] };

const ALL_HQ: PersonaId[] = ['principal', 'manager', 'comms', 'finance'];
const GROUND: PersonaId[] = ['lga_ne', 'lga_south', 'ward'];

export const OPS_NAV: NavItem[] = [
  { href: '/ops/principal', label: 'Cockpit', group: 'Candidate', roles: ['principal', 'manager'] },
  { href: '/ops/approvals', label: 'Approvals', group: 'Candidate', roles: ['principal', 'manager', 'comms'] },
  { href: '/ops/command', label: 'Command room', group: 'Campaign', roles: ['manager', 'principal'] },
  { href: '/ops/plan', label: '13-week plan', group: 'Campaign', roles: ['manager', 'principal', 'comms'] },
  { href: '/ops/scorecard', label: 'Friday scorecard', group: 'Campaign', roles: ['manager', 'principal', 'comms', 'finance'] },
  { href: '/ops/press', label: 'Press releases', group: 'Message', roles: ['comms', 'manager', 'principal'] },
  { href: '/ops/trend', label: 'Thursday One Push', group: 'Message', roles: ['comms', 'manager'] },
  { href: '/ops/sms', label: 'SMS composer', group: 'Message', roles: ['comms', 'manager'] },
  { href: '/ops/studio', label: 'Studio', group: 'Message', roles: ['comms', 'manager'] },
  { href: '/ops/events', label: 'Events', group: 'Message', roles: [...ALL_HQ, ...GROUND] },
  { href: '/ops/giving', label: 'Trend & Give', group: 'Money', roles: ['finance', 'manager', 'principal', 'comms'] },
  { href: '/ops/ledger', label: 'Cap ledger', group: 'Money', roles: ['finance', 'manager', 'principal'] },
  { href: '/ops/counsel', label: 'Gates and counsel', group: 'Money', roles: ['finance', 'manager'] },
  { href: '/ops/structure', label: 'Structure', group: 'Ground', roles: ['manager', 'principal', 'comms', ...GROUND] },
  { href: '/ops/lga/abua-odual', label: 'Abua-Odual', group: 'Ground', roles: ['manager', 'principal', 'lga_ne'] },
  { href: '/ops/lga/ahoada-east', label: 'Ahoada East', group: 'Ground', roles: ['manager', 'principal', 'lga_south'] },
  { href: '/ops/ward/abua-i-01', label: 'My ward', group: 'Ground', roles: ['ward'] },
  { href: '/ops/people', label: 'People', group: 'Ground', roles: ['manager', 'comms', 'lga_ne', 'lga_south', 'ward'] },
  { href: '/ops/desk', label: 'Help Desk', group: 'Ground', roles: ['manager', 'comms', 'principal', ...GROUND] },
  { href: '/ops/academy', label: 'Youth Academy', group: 'Ground', roles: ['manager', 'comms'] },
  { href: '/ops/election', label: 'Election Day room', group: 'Election', roles: ['manager', 'principal', ...GROUND] },
  { href: '/ops/evidence', label: 'Evidence', group: 'Reference', roles: [...ALL_HQ] },
  { href: '/ops/assumptions', label: 'Real, plan, sample', group: 'Reference', roles: [...ALL_HQ] },
  { href: '/ops/demo', label: 'Preview settings', group: 'Reference', roles: ['manager', 'principal', 'finance', 'comms'] },
];

export function navFor(id: PersonaId): NavItem[] {
  return OPS_NAV.filter((n) => n.roles.includes(id));
}

const OPS_ROLES: PersonaId[] = [...ALL_HQ, ...GROUND];

/** Whether a signed-in role may open a path. Everything outside the workspaces is public. */
export function canAccess(id: PersonaId, path: string): boolean {
  if (path === '/ops' || path === '/ops/') return OPS_ROLES.includes(id);
  if (path.startsWith('/ops/')) {
    if (!OPS_ROLES.includes(id)) return false;
    if (path.startsWith('/ops/ward/') || path.startsWith('/ops/pu/')) {
      const rest = path.split('/')[3] ?? '';
      const wardSlug = path.startsWith('/ops/pu/') ? rest.slice(0, Math.max(0, rest.lastIndexOf('-'))) : rest;
      if (id === 'ward') return wardSlug === 'abua-i-01';
      if (id === 'lga_ne' || id === 'lga_south') {
        const w = WARD_BY_SLUG[wardSlug];
        return !w || w.lga === PERSONA_BY_ID[id].scope;
      }
      return id === 'principal' || id === 'manager';
    }
    const hit = OPS_NAV.filter((n) => path === n.href || path.startsWith(n.href + '/')).sort((a, b) => b.href.length - a.href.length)[0];
    return hit ? hit.roles.includes(id) : true;
  }
  if (path === '/agents' || path.startsWith('/agents/')) return (['pu', 'ward', 'lga_ne', 'lga_south', 'manager'] as PersonaId[]).includes(id);
  if (path === '/champion' || path.startsWith('/champion/')) return (['champion', 'manager', 'comms'] as PersonaId[]).includes(id);
  return true;
}

/** Paths that need a signed-in session. */
export function needsSession(path: string): boolean {
  return path === '/me' || path.startsWith('/me/') || path === '/champion' || path.startsWith('/champion/') || path === '/agents' || path.startsWith('/agents/') || path === '/ops' || path.startsWith('/ops/');
}
