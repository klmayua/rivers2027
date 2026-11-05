import { URLS } from './campaign';
export type Src = { label: string; url?: string };
export type Evidence = { id: string; topic: string; text: string; src: Src[]; status: Array<'opened'|'reported'|'verify'|'campaign'|'official'|'source-data'|'unavailable'>; verify?: string };
export const EVIDENCE: Evidence[] = [
  { id: 'R1', topic: '2027 governorship election date', text: 'INEC’s published timetable lists 6 March 2027 for governorship and State House of Assembly elections.', src: [{ label: 'INEC timetable', url: URLS.inecTimetable }], status: ['official'] },
  { id: 'R2', topic: 'Rivers State geography', text: 'The supplied INEC-derived source lists 23 LGAs, 319 wards and 6,866 polling units in Rivers State.', src: [{ label: 'NG2027 INEC-derived source' }], status: ['source-data'] },
  { id: 'R3', topic: 'Candidate and reported priorities', text: 'A 6 October 2026 public report identifies Dumo Lulu Briggs as the NDC governorship candidate and describes statements attributed to him.', src: [{ label: 'Premium Times report', url: URLS.candidateProfile }], status: ['reported'] },
  { id: 'R4', topic: 'Registered-voter totals', text: 'Current registered-voter counts by LGA, ward and polling unit are not included in the supplied geography source.', src: [{ label: 'NG2027 INEC-derived source' }], status: ['unavailable'] },
];
export const WHY_DIGITAL = [
  { n: 1, why: 'Provide sourced candidate information.', record: 'Only attributed public reporting and supplied campaign details are available.', does: 'Links reported claims and marks approvals pending.' },
  { n: 2, why: 'Make Rivers geography searchable.', record: 'The supplied source includes Rivers LGAs, wards and polling units.', does: 'Provides LGA and ward lookup.' },
  { n: 3, why: 'Separate demo activity from official data.', record: 'No current voter-register counts or campaign operations were supplied.', does: 'Marks generated operations data as illustrative.' },
] as const;

