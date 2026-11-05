import { CANDIDATE } from './campaign';
export const ogamiConfig = { endpoint: 'https://ogamy.co/api/ogachat', slug: '', publicKey: '', widget: 'https://ogamy.co/widget.js', live: false, timeoutMs: 20_000 } as const;
export const ogamiGreeting = 'Good day. I am Ogami, an AI assistant for the campaign. I can point you to published information and Rivers State ward data, but I do not speak for ' + CANDIDATE.short + '. Candidate biography and approved campaign materials are still being prepared.';
export const SUGGESTIONS = ['When is the Rivers governorship election?', 'How do I find my ward?', 'Which campaign positions have been published?'] as const;
export type Action = { label: string; href: string };
export type Rule = { match: RegExp | null; reply: string; action?: Action; escalate?: boolean };
export const fallback: Rule[] = [
 { match: /election|polling day|date/i, reply: 'INEC’s published 2027 timetable lists the governorship election for Saturday 6 March 2027.', action: { label: 'Open INEC timetable', href: 'https://www.inecnigeria.org/wp-content/uploads/2027-GENERAL-ELECTION-TIMETABLE.pdf' } },
 { match: /ward|lga|polling unit/i, reply: 'The site uses Rivers State LGA, ward and polling-unit names from the supplied INEC-derived source. Current registered-voter totals are not included.' , action: { label: 'Find your ward', href: '/wards' } },
 { match: /agenda|manifesto|policy|promise/i, reply: 'A public report describes some statements made by the candidate, but a complete, approved manifesto has not been supplied for this site.', action: { label: 'View reported statements', href: '/agenda' } },
 { match: null, reply: 'I do not have verified campaign information for that question yet. Please check the published sources or contact the campaign team.', action: { label: 'Contact the campaign', href: '/help-desk' } },
];
export function fallbackReply(message: string): Rule { return fallback.find((rule) => rule.match === null || rule.match.test(message))!; }
