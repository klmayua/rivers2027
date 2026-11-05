'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Chip, Sample } from '@/components/ui';
import { WARDS, WARD_BY_SLUG, pusOf } from '@/data/geo';
import { isElectionDay } from '@/lib/clock';
import { dayLabel, num } from '@/lib/format';
import { useClock, usePersona } from '@/lib/hooks';
import { nowIso, setState, uid, useStore } from '@/lib/store';

const PARTIES = [
  ['apc', 'APC'],
  ['pdp', 'NDC candidate'],
  ['ndc', 'Other parties'],
  ['other', 'Additional candidates'],
] as const;

/** Ground report with a photograph. On Election Day the same screen sends the polling-unit result sheet. */
export default function Report() {
  const clock = useClock();
  const persona = usePersona();
  const offline = useStore((s) => s.offline);
  const reports = useStore((s) => s.reports);
  const sheets = useStore((s) => s.sheets);
  const locked = persona.id === 'pu' || persona.id === 'ward';
  const [wardSlug, setWardSlug] = useState('abua-i-01');
  const ward = WARD_BY_SLUG[locked ? 'abua-i-01' : wardSlug];
  const pus = useMemo(() => pusOf(ward), [ward]);
  const [puN, setPuN] = useState(4);
  const pu = pus.find((p) => p.n === puN) ?? pus[0];
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<string>('');
  const [place, setPlace] = useState(true);
  const [sent, setSent] = useState<string | null>(null);
  const election = isElectionDay(clock.date);

  const [reg, setReg] = useState('');
  const [acc, setAcc] = useState('');
  const [v, setV] = useState({ apc: '', pdp: '', ndc: '', other: '' });
  const [rej, setRej] = useState('');
  const [sheetPhoto, setSheetPhoto] = useState('');

  const mineReports = reports.filter((r) => r.pu === pu.id);
  const sheet = sheets.find((s) => s.pu === pu.id);
  const n = (x: string) => Math.max(0, Math.round(Number(x) || 0));
  const valid = n(v.apc) + n(v.pdp) + n(v.ndc) + n(v.other);
  const sheetOk = acc !== '' && n(acc) === valid + n(rej) && sheetPhoto !== '';

  function sendReport(e: React.FormEvent) {
    e.preventDefault();
    const r = { id: uid('rp'), pu: pu.id, ward: ward.slug, note: note.trim(), at: nowIso(), by: persona.short, photo: Boolean(photo), queued: offline };
    setState((s) => ({ reports: [r, ...s.reports] }));
    setSent(offline ? 'No signal: your report is saved on this phone and will send when you are back online.' : 'Sent. Your coordinator can see it now.');
    setNote('');
    setPhoto('');
  }

  function sendSheet(e: React.FormEvent) {
    e.preventDefault();
    setState((s) => ({
      sheets: [
        ...s.sheets.filter((x) => x.pu !== pu.id),
        { id: uid('sh'), pu: pu.id, ward: ward.slug, registered: n(reg), accredited: n(acc), apc: n(v.apc), pdp: n(v.pdp), ndc: n(v.ndc), other: n(v.other), rejected: n(rej), at: nowIso(), photo: true, by: persona.short },
      ],
    }));
    setSent('Result sheet sent with its photograph. It is now in the Election Day room as evidence.');
  }

  return (
    <div className="col gap14">
      <div className="row"><h2 className="sp" style={{ fontSize: 18 }}>{election ? 'Result sheet' : 'Ground report'}</h2>{offline && <Chip tone="amber">Offline</Chip>}<Sample /></div>
      {!locked && (
        <label className="fld"><span>Ward</span><select value={wardSlug} onChange={(e) => { setWardSlug(e.target.value); setPuN(1); }}>{WARDS.map((w) => (<option key={w.slug} value={w.slug}>{w.name}</option>))}</select></label>
      )}
      <label className="fld"><span>Polling unit</span>
        <select value={pu.n} onChange={(e) => setPuN(Number(e.target.value))}>{pus.map((p) => (<option key={p.id} value={p.n}>PU {String(p.n).padStart(3, '0')} · {p.name}</option>))}</select>
      </label>
      {sent && <div className="note ok" role="status">{sent}</div>}

      {!election && (
        <form className="col gap8" onSubmit={sendReport}>
          <label className="fld"><span>What is happening</span><textarea required value={note} onChange={(e) => setNote(e.target.value)} placeholder="Short and factual: what, where, how many people." /></label>
          <label className="fld"><span>Photograph</span>
            <input type="file" accept="image/*" capture="environment" onChange={(e) => setPhoto(e.target.files?.[0]?.name ?? '')} />
            <span className="h">{photo ? `Attached: ${photo}` : 'Never include voters’ faces, voter cards or how anyone voted.'}</span>
          </label>
          <label className="chk"><input type="checkbox" checked={place} onChange={(e) => setPlace(e.target.checked)} /><span>Add the time and my location to this report (with my consent).</span></label>
          <button className="btn block" disabled={note.trim().length < 6}>{offline ? 'Save to send later' : 'Send report'}</button>
        </form>
      )}

      {election && (
        <form className="col gap8" onSubmit={sendSheet}>
          {sheet && <div className="note ok"><b>Sheet received</b> at {new Date(sheet.at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}. Sending again replaces it.</div>}
          <div className="grid g2" style={{ gap: 8 }}>
            <label className="fld"><span>Registered</span><input type="number" inputMode="numeric" value={reg} onChange={(e) => setReg(e.target.value)} /></label>
            <label className="fld"><span>Accredited</span><input type="number" inputMode="numeric" required value={acc} onChange={(e) => setAcc(e.target.value)} /></label>
          </div>
          <div className="grid g2" style={{ gap: 8 }}>
            {PARTIES.map(([k, l]) => (
              <label className="fld" key={k}><span>{l}</span><input type="number" inputMode="numeric" required value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} /></label>
            ))}
          </div>
          <label className="fld"><span>Rejected ballots</span><input type="number" inputMode="numeric" value={rej} onChange={(e) => setRej(e.target.value)} /></label>
          <div className={`note ${sheetOk ? 'ok' : 'warn'}`}>
            Valid votes {num(valid)} + rejected {num(n(rej))} = <b>{num(valid + n(rej))}</b>
            {acc !== '' && n(acc) !== valid + n(rej) ? <> · accredited is {num(n(acc))}: <b>check the sheet</b> (this is the mismatch queried in 2023)</> : acc !== '' ? ' · matches accredited' : ''}
          </div>
          <label className="fld"><span>Photograph of the signed result sheet</span>
            <input type="file" accept="image/*" capture="environment" onChange={(e) => setSheetPhoto(e.target.files?.[0]?.name ?? '')} />
            <span className="h">Photograph the sheet before anyone moves it.</span>
          </label>
          <button className="btn red block" disabled={!sheetOk}>Send result sheet</button>
        </form>
      )}

      {mineReports.length > 0 && (
        <div>
          <div className="pt">Your reports for this unit</div>
          {mineReports.map((r) => (
            <div className="pcard" key={r.id}>
              <div className="row"><span className="tt sp">{dayLabel(r.at.slice(0, 10))}</span>{r.queued ? <Chip tone="amber">Waiting for signal</Chip> : <Chip>Sent</Chip>}</div>
              <p className="small mt4">{r.note}</p>
              {r.photo && <div className="tiny muted mt4">Photograph attached</div>}
            </div>
          ))}
          {reports.some((r) => r.queued) && !offline && (
            <button className="btn sec sm" onClick={() => setState((s) => ({ reports: s.reports.map((r) => ({ ...r, queued: false })) }))}>Send saved reports now</button>
          )}
        </div>
      )}
      <p className="tiny muted">Reports go to your coordinator and the campaign’s own store. <Link href="/agents/more">Rules for agents</Link></p>
    </div>
  );
}
