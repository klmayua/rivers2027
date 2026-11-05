'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { Emblem, Icon, Portrait, Stripe } from '@/components/brand';
import { PASSWORD, attempt, landing, signIn, signOut, useHydrated, useSession } from '@/lib/auth';
import { GROUP_LABEL, PERSONAS, type Persona } from '@/lib/personas';
import { CANDIDATE } from '@/data/campaign';

const noop = () => () => {};
/** The ?next= target. Read with useSyncExternalStore so the page renders fully on the server (no Suspense bail-out). */
function useNext(): string | null {
  const q = useSyncExternalStore(noop, () => window.location.search, () => '');
  return new URLSearchParams(q).get('next');
}

export function SignInView() {
  const router = useRouter();
  const next = useNext();
  const hydrated = useHydrated();
  const { signedIn, persona: current } = useSession();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [picked, setPicked] = useState<Persona | null>(null);
  const [show, setShow] = useState(false);

  function pick(p: Persona) {
    setPicked(p);
    setUser(p.username);
    setPass(PASSWORD);
    setError('');
    document.getElementById('si-submit')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = attempt(user, pass);
    if (!r.ok) {
      setError(r.error + (r.error.startsWith('Incorrect') ? ' For this preview every account uses the password shown below the role cards.' : ''));
      return;
    }
    setError('');
    signIn(r.persona.id);
    router.push(landing(r.persona.id, next));
  }

  const groups = (['HQ', 'Ground', 'Community'] as const).map((g) => ({ g, rows: PERSONAS.filter((p) => p.group === g) }));

  return (
    <div className="si">
      <Stripe />
      <div className="si-top wrap">
        <Link href="/" className="si-back"><Icon name="back" size={16} /> Back to the site</Link>
        <Link href="/" className="si-brand"><Portrait size={34} /><b>{CANDIDATE.short}</b></Link>
      </div>
      <main className="si-main wrap">
        <section className="si-card" aria-labelledby="si-h">
          <div className="si-head">
            <Emblem size={46} />
            <div>
              <h1 id="si-h">Sign in</h1>
              <p>DLB2027 · the campaign platform for Chief Barr. Dumo Lulu Briggs</p>
            </div>
          </div>

          {hydrated && signedIn && (
            <div className="note ok mb12" role="status">
              You are signed in as <b>{current.name}</b> ({current.role}).
              <div className="row gap8 wrap mt8">
                <Link className="btn sm" href={landing(current.id, next)}>Continue to my workspace</Link>
                <button className="btn ghost sm" onClick={() => signOut()}>Sign out</button>
              </div>
            </div>
          )}

          {error && <div className="si-err" role="alert">{error}</div>}

          <form className="si-form" onSubmit={submit} autoComplete="off">
            <label className="fld">
              <span>Username</span>
              <input type="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="e.g. campaign.manager" autoCapitalize="none" autoCorrect="off" spellCheck={false} />
            </label>
            <label className="fld">
              <span>Password</span>
              <span className="si-pw">
                <input type={show ? 'text' : 'password'} value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" />
                <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'}><Icon name="eye" size={18} /></button>
              </span>
            </label>
            <button id="si-submit" className="btn red block lg" type="submit">Sign in</button>
          </form>

          <div className="si-how" aria-live="polite">
            {picked ? (
              <>
                <b>{picked.name} · {picked.role}</b> is filled in. Select <b>Sign in</b> to see what they see.
                <span className="d">{picked.blurb}</span>
              </>
            ) : (
              <>
                <b>See each role’s experience.</b> Choose any role card below: its username and password are filled in for you. Then select <b>Sign in</b> to open what that person sees.
              </>
            )}
          </div>

          {groups.map(({ g, rows }) => (
            <div key={g}>
              <div className="si-gl">{GROUP_LABEL[g]}</div>
              <div className="si-roles">
                {rows.map((p) => (
                  <motion.button
                    key={p.id}
                    type="button"
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    className={`si-role ${picked?.id === p.id ? 'picked' : ''}`}
                    onClick={() => pick(p)}
                    aria-pressed={picked?.id === p.id}
                  >
                    <span className="av">{p.initials}</span>
                    <span className="tx">
                      <span className="nm">{p.name}</span>
                      <span className="rl">{p.role}</span>
                      <span className="dv">{p.device}</span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}

          <p className="si-note">
            Preview accounts. Every account uses the password <span className="kbd">{PASSWORD}</span>. Roles show the platform as each person would use it; no personal data is held.
          </p>
        </section>

        <aside className="si-side" aria-label="About the platform">
          <div className="si-photo"><Portrait size={120} ring={false} /></div>
          <h2>{CANDIDATE.closing}</h2>
          <p>One platform for the whole campaign: the candidate’s cockpit, the campaign manager’s command room, the LGA and ward desks, the agents’ phone app and the supporter’s own page.</p>
          <ul>
            <li><Icon name="shield" size={18} /> Each role sees only its own desks.</li>
            <li><Icon name="chart" size={18} /> Every figure names its source.</li>
            <li><Icon name="lock" size={18} /> Sign out any time from the account menu.</li>
          </ul>
        </aside>
      </main>
      <footer className="si-foot wrap">Prepared by Farawa Media/PR Vil. Square (RC 1970176) · Not an official INEC or NDC site · <Link href="/privacy">Privacy</Link></footer>
    </div>
  );
}
