import { addDays } from '@/lib/format';
import { WEEK1_START } from '@/lib/clock';
export type Week = { n: number; start: string; end: string; slug: string; issue: string; record: string; tag: string; need: string; headlines: [string, string, string, string, string] };
export const WEEKS: Week[] = Array.from({ length: 13 }, (_, index) => {
  const n = index + 1;
  return { n, start: addDays(WEEK1_START, index * 7), end: addDays(WEEK1_START, index * 7 + 4), slug: 'week-' + n,
    issue: 'Candidate-approved campaign material pending', record: 'No action plan or campaign calendar was provided for this site.',
    tag: '#ResetRivers', need: 'Campaign team approval required',
    headlines: ['Campaign update pending approval', 'Rivers State facts with sources', 'Candidate statement pending approval', 'Community event details pending', 'Campaign progress update pending'] };
});
export const WEEK_BY_SLUG: Record<string, Week> = Object.fromEntries(WEEKS.map((week) => [week.slug, week]));
export const PAPERS: Array<{ day: string; paper: string; type: string; body: string }> = [];
export const ONE_PUSH: Array<{ t: string; head: string; body: string }> = [];
export const WEEK_RHYTHM: Array<{ day: string; what: string }> = [];
export type Release = { id: string; week: number; date: string; headline: string; channel: string; status: string; hasDraft: boolean; paper?: string; type?: string };
export const RELEASES: Release[] = [];
export const DRAFTS: Record<string, { dateline: string; paras: string[]; proposedQuote?: string }> = {};
