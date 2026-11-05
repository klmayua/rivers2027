import type { PersonaId } from '@/lib/personas';
export type TourStep = { href: string; persona: PersonaId; clock?: string; title: string; say: string };
export const TOUR: TourStep[] = [];
