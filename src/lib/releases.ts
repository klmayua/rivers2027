import { daysBetween } from './format';
import type { Release } from '@/data/weeks';

export type RelStatus = 'published' | 'approved' | 'held' | 'awaiting' | 'drafting';

export function releaseStatus(r: Release, date: string, approvals: Record<string, 'approved' | 'held'>): RelStatus {
  if (r.date <= date) return approvals[r.id] === 'held' ? 'held' : 'published';
  const a = approvals[r.id];
  if (a === 'approved') return 'approved';
  if (a === 'held') return 'held';
  return daysBetween(date, r.date) <= 9 ? 'awaiting' : 'drafting';
}

export const REL_LABEL: Record<RelStatus, string> = {
  published: 'Published',
  approved: 'Approved, scheduled',
  held: 'On hold',
  awaiting: 'Awaiting his approval',
  drafting: 'Drafting',
};
