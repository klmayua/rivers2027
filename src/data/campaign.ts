/** Candidate facts and campaign statements. Unknown items remain pending instead of inheriting the reference campaign's claims. */
export const CANDIDATE = {
  name: 'Chief Barr. Dumo Lulu Briggs', short: 'Chief Barr. Dumo Lulu Briggs', first: 'Chief Barr. Dumo',
  party: 'NDC', partyLong: 'Nigeria Democratic Congress', office: 'Governor of Rivers State',
  constituency: 'Rivers State', state: 'Rivers State', tagline: 'Reset Rivers', line: '', unity: 'Rivers State',
  closing: 'Reset Rivers', age: 0, qualification: '', tag: '#ResetRivers',
} as const;
export const ELECTION = {
  date: '2027-03-06', label: 'Saturday 6 March 2027', campaignOpened: '2026-10-07',
  campaignCloses: '2027-03-04', candidatesOnBallot: 0, cap: 0, capStart: '2026-10-07',
} as const;
export const OFFICIAL = {
  registeredNE: 0, pusNE: 0, pusTarget: 0, validVotes2019: 0, pdp2019: 0, apc2019: 0,
  minor2019: 0, accredited2023NE: 0, registered2023NE: 0,
} as const;
export const SCENARIOS = {
  holds: { key: 'holds', label: 'Illustration (no forecast supplied)', apc: 0, pdp: 0, ndc: 0, other: 0 },
  contested: { key: 'contested', label: 'Illustration (no forecast supplied)', apc: 0, pdp: 0, ndc: 0, other: 0 },
  upset: { key: 'upset', label: 'Illustration (no forecast supplied)', apc: 0, pdp: 0, ndc: 0, other: 0 },
} as const;
export type ScenarioKey = keyof typeof SCENARIOS;
export const CONTRACT = [
  { n: 1, title: 'Candidate materials pending publication', body: 'No approved campaign contract has been supplied for this site.' },
  { n: 2, title: 'Campaign details pending confirmation', body: 'Party, ticket and policy statements should be checked against official records and candidate-approved material.' },
  { n: 3, title: 'Statewide data sourced', body: 'Rivers State LGAs, wards and polling-unit names on this site come from the supplied INEC-derived geography source.' },
] as const;
export const MANIFESTO = ['A formal manifesto has not been supplied for this site.'] as const;
export const VISION = ['Candidate-approved vision statement pending publication.'] as const;
export const QUOTES: Array<{ id: string; text: string; source: string; approved: boolean }> = [{ id: 'q1', text: 'Reset Rivers', source: 'Premium Times, 6 October 2026 · reported agenda title', approved: true }];
export const MONEY = { launch: 0, weekly: 0, weeks: 0, total: 0 } as const;
export const LAUNCH_LINES: Array<{ label: string; pct: number; body: string }> = [];
export const WEEKLY_LINES: Array<{ label: string; amount: number; body: string }> = [];
export const ASK_LADDER: Array<{ amount: number; name: string; adds: string }> = [];
export const CIRCLES: Array<{ n: number; name: string; who: string; how: string; first: string }> = [];
export const GROUND_RULES = [
  { n: 1, title: 'Source claims', body: 'Campaign claims should link to a source or be clearly attributed.' },
  { n: 2, title: 'Approve statements', body: 'Candidate statements and campaign commitments require approval before publication.' },
  { n: 3, title: 'Respect privacy', body: 'Collect only information required for a stated purpose, with consent.' },
] as const;
export const AGENT_RULES = [
  'Use only campaign material approved for publication.',
  'Do not photograph voter cards, voters at the ballot, or completed ballots.',
  'Keep reports factual, dated, and limited to the agent’s assigned location.',
] as const;
export const SCORECARD = [
  { area: 'Candidate materials', count: 'Approved bio, policy and campaign statements', target: 'Pending confirmation' },
  { area: 'Rivers geography', count: 'INEC-derived LGA, ward and polling-unit names', target: '23 LGAs · 319 wards' },
  { area: 'Voter register', count: 'Current registered-voter totals', target: 'Not included in the supplied source' },
] as const;
export const URLS = {
  inecTimetable: 'https://www.inecnigeria.org/wp-content/uploads/2027-GENERAL-ELECTION-TIMETABLE.pdf',
  candidateProfile: 'https://www.premiumtimesng.com/regional/south-south-regional/914827-2027-lulu-briggs-dismisses-rainbow-coalition-vows-to-transform-rivers-if-elected-governor.html',
} as const;
