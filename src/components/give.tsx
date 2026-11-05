'use client';

import { useEffect, useRef, useState } from 'react';
import { ASK_LADDER } from '@/data/campaign';
import { GROUP_BY_SLUG } from '@/data/content';
import { WARD_BY_SLUG } from '@/data/geo';
import { initials, naira } from '@/lib/format';
import { hash } from '@/lib/rng';
import { nowIso, setState, uid, type Gift } from '@/lib/store';
import { closeGive, useGiveUi } from '@/lib/ui-state';
import { Icon } from './brand';
import { QR } from './qr';

type Step = 'choose' | 'pay' | 'busy' | 'done';

function tierOf(amount: number): string {
  let t = 'Well-wisher';
  for (const l of ASK_LADDER) if (amount >= l.amount) t = l.name;
  return t;
}

function shareWhatsApp(text: string) {
  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank', 'noopener');
}

/** The Give popup: opens centred over any page. Preview checkout: no card is charged. */
export function GiveModal() {
  const ui = useGiveUi();
  const [step, setStep] = useState<Step>('choose');
  const [abroad, setAbroad] = useState(false);
  const [amount, setAmount] = useState(5000);
  const [custom, setCustom] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cit, setCit] = useState(false);
  const [method, setMethod] = useState<'card' | 'transfer' | 'ussd'>('card');
  const [gift, setGift] = useState<Gift | null>(null);
  const box = useRef<HTMLDivElement>(null);

  // reset each time it opens
  const wasOpen = useRef(false);
  useEffect(() => {
    if (ui.open && !wasOpen.current) {
      const t = setTimeout(() => {
        setStep('choose');
        setCustom('');
        setGift(null);
        box.current?.focus();
      }, 0);
      wasOpen.current = true;
      return () => clearTimeout(t);
    }
    if (!ui.open) wasOpen.current = false;
  }, [ui.open]);

  useEffect(() => {
    if (!ui.open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && closeGive();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [ui.open]);

  // Hold the page still behind the popup, so a thumb scrolling the dialog on a phone cannot drag the page underneath.
  useEffect(() => {
    if (!ui.open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [ui.open]);

  if (!ui.open) return null;

  const amt = custom ? Math.max(0, Math.round(Number(custom))) : amount;
  const valid = amt >= 1000 && cit && name.trim().length > 1 && /.+@.+\..+/.test(email);
  const group = ui.group ? GROUP_BY_SLUG[ui.group] : null;
  const ward = ui.ward ? WARD_BY_SLUG[ui.ward] : null;

  function pay() {
    setStep('busy');
    setTimeout(() => {
      const ref = 'RIV-' + (hash(name + amt + Date.now()) % 900000 + 100000);
      const g: Gift = {
        id: uid('gift'),
        ref,
        amount: amt,
        tier: tierOf(amt),
        group: ui.group,
        ward: ui.ward,
        channel: ui.channel,
        abroad,
        initials: initials(name),
        at: nowIso(),
        code: ref.slice(4).toLowerCase(),
      };
      setState((s) => ({ gifts: [...s.gifts, g] }));
      setGift(g);
      setStep('done');
    }, 1300);
  }

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && closeGive()}>
      <div className="dlg" role="dialog" aria-modal="true" aria-labelledby="give-t" ref={box} tabIndex={-1} style={{ position: 'relative' }}>
        <button className="x" onClick={closeGive} aria-label="Close">
          ×
        </button>

        {step === 'choose' && (
          <div className="col gap8">
            <div>
              <h3 id="give-t">Support the campaign</h3>
              <p className="small muted mt4">Small gifts from many people. Every gift is receipted and entered in the campaign’s spending ledger.</p>
            </div>
            {(group || ward) && <span className="chip blue">Counted for {group ? group.name : ward?.name}</span>}
            <div className="seg" role="group" aria-label="Where are you giving from" style={{ alignSelf: 'flex-start' }}>
              <button aria-pressed={!abroad} onClick={() => setAbroad(false)}>In Nigeria</button>
              <button aria-pressed={abroad} onClick={() => setAbroad(true)}>From abroad</button>
            </div>
            <div className="ladder">
              {ASK_LADDER.map((l) => (
                <button key={l.amount} aria-pressed={!custom && amount === l.amount} onClick={() => { setAmount(l.amount); setCustom(''); }}>
                  {l.amount >= 100000 ? '₦100k+' : naira(l.amount)}
                  <small>{l.name}</small>
                </button>
              ))}
            </div>
            <label className="fld">
              <span>Another amount (₦, from 1,000)</span>
              <input type="number" inputMode="numeric" min={1000} value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="e.g. 15000" />
            </label>
            {!custom && <p className="small muted">{ASK_LADDER.find((l) => l.amount === amount)?.adds}</p>}
            <label className="fld"><span>Your name</span><input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} /></label>
            <label className="fld"><span>Email for your receipt</span><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label className="chk">
              <input type="checkbox" checked={cit} onChange={(e) => setCit(e.target.checked)} />
              <span>I confirm that I am a Nigerian citizen and that I am giving from my own funds.</span>
            </label>
            <button className="btn block red" disabled={!valid} onClick={() => setStep('pay')}>
              Continue to Paystack · {naira(amt)}
            </button>
            <p className="tiny muted">
              {abroad ? 'International cards are accepted and charged in naira; your bank converts. ' : 'Card, bank transfer and USSD. '}
              Gifts are paid into a dedicated campaign account in Nigeria. <b>Preview checkout: no card is charged.</b> Live gifts open once Paystack confirms the campaign account and counsel clears the citizenship rule.
            </p>
          </div>
        )}

        {step === 'pay' && (
          <div className="col gap8">
            <div className="row">
              <button className="btn ghost sm" onClick={() => setStep('choose')}>← Back</button>
              <span className="sp" />
              <span className="tiny muted">Powered by Paystack · preview</span>
            </div>
            <h3 id="give-t">Pay {naira(amt)}</h3>
            <p className="small muted">to DLB2027 campaign account (naira) · {email}</p>
            <div className="seg" role="group" aria-label="Payment method" style={{ alignSelf: 'flex-start' }}>
              {abroad ? (
                <button aria-pressed>International card</button>
              ) : (
                (['card', 'transfer', 'ussd'] as const).map((m) => (
                  <button key={m} aria-pressed={method === m} onClick={() => setMethod(m)}>
                    {m === 'card' ? 'Card' : m === 'transfer' ? 'Transfer' : 'USSD'}
                  </button>
                ))
              )}
            </div>
            {(abroad || method === 'card') && (
              <div className="col gap8">
                <label className="fld"><span>Card number</span><input type="text" readOnly value="•••• •••• •••• 4081" /></label>
                <div className="grid g2" style={{ gap: 8 }}>
                  <label className="fld"><span>Expiry</span><input type="text" readOnly value="12 / 29" /></label>
                  <label className="fld"><span>CVV</span><input type="text" readOnly value="•••" /></label>
                </div>
              </div>
            )}
            {!abroad && method === 'transfer' && <div className="note">Transfer {naira(amt)} to the account shown at checkout. In the live app this is a one-time Paystack account number that expires.</div>}
            {!abroad && method === 'ussd' && <div className="note">Dial the USSD code for your bank shown at checkout. In the live app you pick your bank and Paystack gives the code.</div>}
            <button className="btn block red" onClick={pay}>Pay {naira(amt)}</button>
            <p className="tiny muted">Preview checkout: no card is read and no money moves.</p>
          </div>
        )}

        {step === 'busy' && (
          <div className="col" style={{ alignItems: 'center', padding: '34px 0' }} aria-live="polite">
            <div style={{ width: 38, height: 38, borderRadius: '50%', border: '4px solid var(--line)', borderTopColor: 'var(--green)', animation: 'spin 0.8s linear infinite' }} />
            <p className="b">Confirming with Paystack…</p>
            <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
          </div>
        )}

        {step === 'done' && gift && (
          <div className="col gap8">
            <div className="row">
              <span className="chip solid" style={{ width: 26, height: 26, padding: 0, justifyContent: 'center' }}><Icon name="check" size={14} /></span>
              <h3 id="give-t">Thank you, {name.split(' ')[0]}</h3>
            </div>
            <div className="card panel" style={{ padding: 12 }}>
              <div className="row small"><span className="muted">Receipt</span><span className="sp" /><b>{gift.ref}</b></div>
              <div className="row small"><span className="muted">Amount</span><span className="sp" /><b>{naira(gift.amount)}</b></div>
              <div className="row small"><span className="muted">Level</span><span className="sp" /><b>{gift.tier}</b></div>
              <div className="row small"><span className="muted">Entered in the cap ledger</span><span className="sp" /><b>Yes</b></div>
            </div>
            <p className="small">A receipt is on its way to {email}. Pass your own link on: every gift through it is counted for you, never shown by name.</p>
            <QR path={`/s/${gift.code}`} size={112} />
            <button className="btn block" onClick={() => shareWhatsApp(`I gave to Chief Barr. Dumo Lulu Briggs’s campaign for Rivers State. Give here: ${window.location.origin}/s/${gift.code}`)}>
              Share on WhatsApp
            </button>
            <button className="btn block sec" onClick={closeGive}>Done</button>
            <p className="tiny muted">Preview receipt: no money moved.</p>
          </div>
        )}
      </div>
    </div>
  );
}
