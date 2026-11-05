'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useHydrated, useSession } from '@/lib/auth';
import { canAccess } from '@/lib/personas';
import { getState } from '@/lib/store';
import { Emblem } from './brand';

/** Wraps the private workspaces. Not signed in: go to the sign-in page. Signed in but out of role: say so and offer the role's own home. */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const { signedIn, persona } = useSession();

  useEffect(() => {
    if (!hydrated) return;
    if (!getState().signedIn) router.replace(`/signin?next=${encodeURIComponent(path)}`);
  }, [hydrated, signedIn, path, router]);

  if (!hydrated || !signedIn) {
    return (
      <div className="gatewait" role="status" aria-live="polite">
        <Emblem size={44} />
        <p>{hydrated ? 'Taking you to sign in…' : 'Opening your workspace…'}</p>
        {hydrated && <Link className="btn sec sm" href={`/signin?next=${encodeURIComponent(path)}`}>Sign in</Link>}
      </div>
    );
  }

  if (!canAccess(persona.id, path)) {
    return (
      <div className="gatewait" role="alert">
        <Emblem size={44} />
        <h2>This part is not in your role</h2>
        <p>You are signed in as <b>{persona.label}</b>. This desk belongs to another role.</p>
        <div className="row gap8 wrap" style={{ justifyContent: 'center' }}>
          <Link className="btn" href={persona.home}>Go to my workspace</Link>
          <Link className="btn sec" href="/signin">Sign in as someone else</Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
