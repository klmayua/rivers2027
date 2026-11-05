import { URLS } from './campaign';
export type Action = { label: string; href: string };
export type Fact = { text: string; src: string; url?: string };
export type Pillar = { slug: string; n: number; title: string; line: string; points: number[]; icon: string };
export type Issue = {
  slug: string; title: string; kicker: string; hook: string; facts: Fact[];
  stands: { head: string; body: string; points?: number[] }; missing?: string;
  next: Action[]; askTopic: string; weekSlug?: string; icon: string;
};
export const PILLARS: Pillar[] = [
  { slug: 'economy', n: 1, title: 'Economic growth', line: 'A published report attributes an economic expansion and private-sector growth agenda to Dumo Lulu Briggs.', points: [1], icon: 'building' },
  { slug: 'skills', n: 2, title: 'Skills and human opportunity', line: 'A public report records his stated focus on skills and tools for a competitive economy.', points: [1], icon: 'book' },
  { slug: 'business', n: 3, title: 'Small-business finance', line: 'A reported proposal would support bankable small and medium-sized businesses through financial institutions.', points: [1], icon: 'wallet' },
  { slug: 'transparency', n: 4, title: 'Public finance transparency', line: 'A public report records a commitment to publish state revenue and allocations and involve communities in budgeting.', points: [1], icon: 'eye' },
];
export const ISSUES: Issue[] = [{
  slug: 'reset-rivers', title: 'Reset Rivers: reported priorities', kicker: 'Candidate statements',
  hook: 'A public report on 6 October 2026 described Dumo Lulu Briggs’s “Reset Rivers” agenda and recorded several policy statements.',
  facts: [
    { text: 'The report identifies Dumo Lulu Briggs as the NDC governorship candidate in Rivers State and describes the “Reset Rivers” agenda.', src: 'Premium Times, 6 October 2026', url: URLS.candidateProfile },
    { text: 'The report attributes a focus on skills development, entrepreneurship, private-sector growth and support for bankable small businesses to the candidate.', src: 'Premium Times, 6 October 2026', url: URLS.candidateProfile },
    { text: 'The report also records statements on public disclosure of state revenue and allocations and community input into budgeting.', src: 'Premium Times, 6 October 2026', url: URLS.candidateProfile },
  ],
  stands: { head: 'What has been reported', body: 'These are statements reported in a public interview. The campaign has not supplied an approved manifesto or detailed delivery plan for this site.' },
  missing: 'Detailed, candidate-approved policy documents, costings and implementation timelines have not been provided.',
  next: [{ label: 'See the source report', href: URLS.candidateProfile }, { label: 'Find your ward', href: '/wards' }],
  askTopic: 'Reset Rivers', weekSlug: 'week-1', icon: 'flag',
}];
export const ISSUE_BY_SLUG: Record<string, Issue> = Object.fromEntries(ISSUES.map((issue) => [issue.slug, issue]));
export const KEY_FACTS = {
  nationalRegistered: { value: 'Not supplied', label: 'current registered-voter total', src: 'Not present in the supplied source data' },
  turnout2023: { value: '16.71%', label: 'turnout in Rivers State in the 2023 presidential election', src: 'NG2027 2023 presidential results dataset' },
  neAccredited: { value: 'Not supplied', label: 'ward-level accreditation totals', src: 'Not present in the supplied source data' },
  neUnits: { value: '6,866', label: 'polling units in Rivers State', src: 'NG2027 INEC-derived geography source' },
  neRegistered: { value: 'Not supplied', label: 'registered voters in Rivers State', src: 'Not present in the supplied source data' },
  candidates: { value: 'Not published here', label: 'candidates on INEC’s final list', src: URLS.inecTimetable },
  cap: { value: 'Pending legal review', label: 'candidate spending limit', src: 'Campaign counsel to confirm current law' },
  wards: { value: '319', label: 'wards across 23 local government areas', src: 'NG2027 INEC-derived geography source' },
  riversLgas: { value: '23', label: 'local government areas in Rivers State', src: 'NG2027 INEC-derived geography source' },
  riversWards: { value: '319', label: 'wards in Rivers State', src: 'NG2027 INEC-derived geography source' },
  riversPus: { value: '6,866', label: 'polling units in Rivers State', src: 'NG2027 INEC-derived geography source' },
  riversTurnout: { value: '16.71%', label: 'turnout in the 2023 presidential election in Rivers', src: 'NG2027 2023 presidential results dataset' },
  validVotes2023: { value: '523,651', label: 'valid votes recorded in Rivers in the 2023 presidential election', src: 'NG2027 2023 presidential results dataset' },
  election: { value: '6 March 2027', label: 'Rivers governorship election date', src: URLS.inecTimetable },
} as const;
