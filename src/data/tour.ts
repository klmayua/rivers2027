import type { PersonaId } from '@/lib/personas';
import type { ClockKey } from '@/lib/clock';
export type TourStep = { href: string; persona: PersonaId; clock?: ClockKey; title: string; say: string };
export const TOUR: TourStep[] = [];
