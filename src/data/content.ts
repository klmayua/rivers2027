import { CANDIDATE } from './campaign';
export type NewsItem = { id: string; title: string; kicker: string; source: string; summary: string; body: string[]; image?: string; imageCaption?: string; date: string };
export const NEWS: NewsItem[] = [{
  id: 'reset-rivers-interview', title: 'Dumo Lulu Briggs sets out reported “Reset Rivers” priorities', kicker: 'Interview',
  source: 'Premium Times, 6 October 2026', date: '2026-10-06',
  summary: 'A public report identifies Dumo Lulu Briggs as the NDC governorship candidate and outlines statements attributed to him on jobs, small-business support and public finance transparency.',
  body: ['The report describes his “Reset Rivers” agenda and records statements on skills development, entrepreneurship, private-sector growth, support for bankable small businesses, public financial disclosure and community input into budgeting.'],
}];
export type Project = { id: string; title: string; lga?: string; status: string; tone?: string; source?: string; description?: string; cost?: number; owner?: string; kind?: string; where?: string; summary?: string; contractor?: string; promised?: string; next?: string; photo?: string; evidence?: string; src?: string };
export const PROJECTS: Project[] = [];
export type EventItem = { id: string; title: string; date: string; where: string; lga?: string; kind: 'live' | 'town' | 'diaspora' | 'debate' | 'academy' | 'milestone' | 'closing' | 'rally' | 'online' | 'other'; status?: string; time?: string; note?: string; tentative?: boolean };
export const EVENTS: EventItem[] = [];
export const EVENT_KIND: Record<EventItem['kind'], string> = { live: 'Live', town: 'Town hall', diaspora: 'Diaspora', debate: 'Debate', academy: 'Academy', milestone: 'Milestone', closing: 'Campaign close', rally: 'Rally', online: 'Online', other: 'Event' };
export type Stakeholder = { name: string; role: string; area: string; seen: string; suggest: string };
export const STAKEHOLDERS: Stakeholder[] = [];
export type Group = { slug: string; name: string; description?: string; members: number; ward?: string; lga?: string; abroad?: boolean; place?: string; circle?: string; gifts?: number };
export const GROUPS: Group[] = [];
export const GROUP_BY_SLUG: Record<string, Group> = {};
export const SMS_TEMPLATES: Array<{ id: string; name: string; use: string; text: string }> = [{ id: 'pending', name: 'Pending', use: 'Template pending approval', text: 'Campaign message pending approval. Reply STOP to opt out.' }];
export const SMS_LISTS: Array<{ id: string; name: string; label: string; count: number; note: string }> = [{ id: 'cleared', name: 'No list', label: 'No verified opt-in list', count: 0, note: 'No recipient list supplied.' }];
export const SMS_PRICING = { perPage: 0, vat: 0 } as const;
