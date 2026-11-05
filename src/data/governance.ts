export const VER = [
  { n: 1, item: 'Candidate’s complete official identity, titles and biography', why: 'Use consistent and verified public information' },
  { n: 2, item: 'INEC final candidate list and NDC ticket details', why: 'Confirm ballot information against official records' },
  { n: 3, item: 'Candidate-approved manifesto and costed delivery plan', why: 'Avoid presenting reported remarks as a complete manifesto' },
  { n: 4, item: 'Current Rivers registered-voter totals by LGA and ward', why: 'Not included in the supplied geography source' },
  { n: 5, item: 'Campaign budget, spending cap and fundraising terms', why: 'No campaign budget or legal opinion was supplied' },
] as const;
export const RISKS = [
  { risk: 'Unverified candidate details', real: 'Only limited public-report and user-supplied information is available', does: 'Confirm from candidate documents and INEC records before publication', level: 'high' },
  { risk: 'Voter-register counts absent', real: 'The supplied INEC-derived file contains geography and polling-unit names, not voter counts', does: 'Do not infer electorate totals from polling units', level: 'high' },
  { risk: 'Demo operations figures', real: 'The inherited dashboard can generate illustrative activity counts', does: 'Keep sample figures clearly identified as demo data', level: 'med' },
] as const;
export type Gate = { id: string; title: string; owner: string; due: string; done: boolean; note: string; group?: string; clears?: string; item?: string; ver?: string };
export const GATES: Gate[] = [];
export const REGISTER = { real: ['Rivers LGA, ward and polling-unit names from NG2027 INEC-derived source', '2023 Rivers presidential result summary from supplied source'], plan: [] as string[], sample: ['Any generated campaign operations figures'], gaps: ['Current voter-register counts', 'Candidate-approved biography, manifesto and costings', 'Campaign budget and legal review'] } as const;
export const GO_LIVE = ['Confirm candidate public name and title', 'Confirm party and INEC candidate listing', 'Approve biography and campaign platform', 'Load current INEC voter-register figures when available', 'Replace demo assumptions and review privacy notices'].map((piece) => ({ piece, demo: 'Pending or illustrative in this preview', live: 'Confirm before public launch' }));
