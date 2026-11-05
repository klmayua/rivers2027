'use client';

/**
 * Front-end session. There is no server: signing in records the chosen role in this browser
 * (the same localStorage store as everything else) so the right workspace opens.
 * Every account shares one preview password.
 */
import { useSyncExternalStore } from 'react';
import { PASSWORD, PERSONAS, PERSONA_BY_ID, canAccess, type Persona, type PersonaId } from './personas';
import { setState, useStore } from './store';

export { PASSWORD };

export type Attempt = { ok: true; persona: Persona } | { ok: false; error: string };

export function attempt(usernameRaw: string, password: string): Attempt {
  const u = usernameRaw.trim().toLowerCase();
  if (!u) return { ok: false, error: 'Enter your username.' };
  const p = PERSONAS.find((x) => x.username.toLowerCase() === u || x.id === u);
  if (!p) return { ok: false, error: 'No account matches that username.' };
  if (password !== PASSWORD) return { ok: false, error: 'Incorrect password.' };
  return { ok: true, persona: p };
}

export function signIn(id: PersonaId): void {
  setState({ persona: id, signedIn: true });
}

export function signOut(): void {
  setState({ signedIn: false, persona: 'public', tour: { on: false, step: 0 } });
}

/** Where to go after signing in: the page they asked for if their role allows it, else the role's home. */
export function landing(id: PersonaId, next: string | null): string {
  if (next && next.startsWith('/') && !next.startsWith('//') && canAccess(id, next)) return next;
  return PERSONA_BY_ID[id].home;
}

const noopSub = () => () => {};
/** False on the server and during hydration, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSub, () => true, () => false);
}

export function useSession(): { signedIn: boolean; persona: Persona } {
  const signedIn = useStore((s) => s.signedIn);
  const id = useStore((s) => s.persona);
  return { signedIn, persona: PERSONA_BY_ID[id] };
}
