/** Navigation for the public site. */
export type Link = { href: string; label: string };
export type MoreItem = { href: string; icon: string; t: string; s: string };

export const NAV_MAIN: Link[] = [
  { href: '/agenda', label: 'Agenda' },
  { href: '/contract', label: 'The Contract' },
  { href: '/wards', label: 'Your ward' },
  { href: '/events', label: 'Events' },
  { href: '/get-involved', label: 'Get involved' },
];

export const MORE_GROUPS: Array<{ title: string; items: MoreItem[] }> = [
  {
    title: 'Take part',
    items: [
      { href: '/get-involved', icon: 'users', t: 'Get involved', s: 'Supporter, champion or polling-unit agent' },
      { href: '/wards', icon: 'pin', t: 'Find your ward', s: 'Your ward’s page for the week’s issue' },
      { href: '/events', icon: 'calendar', t: 'Live and town halls', s: 'Sundays 8pm, and one near you' },
      { href: '/academy', icon: 'book', t: 'Youth Digital Academy', s: 'Free digital and AI skills, with NSP Africa' },
      { href: '/help-desk', icon: 'help', t: 'People’s Help Desk', s: 'Ask a question. Answered in 5 working days' },
    ],
  },
  {
    title: 'Know the candidate',
    items: [
      { href: '/about', icon: 'flag', t: 'Meet Chief Barr. Dumo', s: 'Service, record and vision' },
      { href: '/contract', icon: 'scroll', t: 'The Rivers Contract', s: 'Three promises, kept in public' },
      { href: '/report-card', icon: 'report', t: 'Report Card', s: 'Every vote and question, within 48 hours' },
      { href: '/projects', icon: 'building', t: 'Project Register', s: 'Every federal project, with a date and a photograph' },
      { href: '/news', icon: 'news', t: 'News and statements', s: 'Visits, speeches and press releases' },
      { href: '/voter-help', icon: 'check', t: 'Voter Help', s: 'Check your card, find your polling unit' },
    ],
  },
];

export const FOOT_COLS: Array<{ title: string; links: Link[] }> = [
  {
    title: 'The campaign',
    links: [
      { href: '/about', label: 'Meet Chief Barr. Dumo' },
      { href: '/agenda', label: 'The Rivers Agenda' },
      { href: '/contract', label: 'The Rivers Contract' },
      { href: '/report-card', label: 'Report Card' },
      { href: '/projects', label: 'Project Register' },
      { href: '/news', label: 'News and statements' },
    ],
  },
  {
    title: 'Take part',
    links: [
      { href: '/get-involved', label: 'Get involved' },
      { href: '/wards', label: 'Find your ward' },
      { href: '/events', label: 'Live and town halls' },
      { href: '/academy', label: 'Youth Digital Academy' },
      { href: '/help-desk', label: 'People’s Help Desk' },
      { href: '/voter-help', label: 'Voter Help' },
    ],
  },
  {
    title: 'The 2027 issues',
    links: [
      { href: '/agenda/roads', label: 'Roads' },
      { href: '/agenda/youth-ai', label: 'Youth, jobs and AI' },
      { href: '/agenda/health', label: 'Healthcare' },
      { href: '/agenda/reset-rivers', label: 'Reported priorities' },
      { href: '/agenda/your-vote', label: 'Your vote' },
      { href: '/agenda/money', label: 'Campaign money' },
    ],
  },
];
