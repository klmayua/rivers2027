'use client';

import { useMemo, useState } from 'react';
import { Card, Chip, Note, PageHead, Prov, Stat } from '@/components/ui';
import { GROUPS, SMS_LISTS, SMS_PRICING, SMS_TEMPLATES } from '@/data/content';
import { LGA_LIST, TOTAL_PUS, WARDS } from '@/data/geo';
import { weekOf, WEEK1_START } from '@/lib/clock';
import { addDays, dayLabel, naira, num } from '@/lib/format';
import { useClock, useMetrics, useWardMetrics } from '@/lib/hooks';
import { SMS_LIST } from '@/lib/model';
import { nowIso, setState, uid, useStore } from '@/lib/store';
import { WEEKS } from '@/data/weeks';

const GSM = '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà';
const EXT = '^{}\\[~]|€';

function smsInfo(text: string) {
  let units = 0;
  let unicode = false;
  const odd = new Set<string>();
  for (const ch of text) {
    if (GSM.includes(ch)) units += 1;
    else if (EXT.includes(ch)) units += 2;
    else {
      unicode = true;
      odd.add(ch);
    }
  }
  const len = unicode ? [...text].length : units;
  const single = unicode ? 70 : 160;
  const multi = unicode ? 67 : 153;
  const pages = len <= single ? 1 : Math.ceil(len / multi);
  return { len, pages, unicode, odd: [...odd], single };
}

const LANGS = ['English', 'Naija Pidgin', 'Igbo'] as const;

export default function Sms() {
  const clock = useClock();
  const m = useMetrics();
  const rows = useWardMetrics();
  const sent = useStore((s) => s.sms);
  const wk = Math.max(1, Math.min(13, weekOf(clock.date)));
  const w = WEEKS[wk - 1];

  const [tpl, setTpl] = useState<string>(SMS_TEMPLATES[0].id);
  const [list, setList] = useState<string>('cleared');
  const [lang, setLang] = useState<(typeof LANGS)[number]>('English');
  const [picked, setPicked] = useState<string[]>(WARDS.map((x) => x.slug));
  const base = SMS_TEMPLATES.find((t) => t.id === tpl) ?? SMS_TEMPLATES[0];
  const [custom, setCustom] = useState<string | null>(null);
  const [flash, setFlash] = useState('');

  const sel = useMemo(() => new Set(picked), [picked]);
  const wardName = picked.length === 1 ? (WARDS.find((x) => x.slug === picked[0])?.name ?? 'your ward') : 'your ward';
  const link = `rivers2027.farawa.co/w/${picked[0] ?? 'abua-i-01'}/${w.slug}`;
  const filled = base.text.replace('{ward}', wardName).replace('{issue}', w.issue).replace('{link}', link).replace('{tag}', w.tag);
  const text = custom ?? filled;
  const info = smsInfo(text);

  const share = WARDS.filter((x) => sel.has(x.slug)).reduce((a, x) => a + x.pus, 0) / TOTAL_PUS;
  const recipients = useMemo(() => {
    const picks = rows.filter((r) => sel.has(r.ward.slug));
    if (list === 'cleared') return picks.reduce((a, r) => a + r.smsList, 0);
    if (list === 'optin') return Math.round(m.optIn * share);
    if (list === 'donors') return Math.round(m.giving.donors * share);
    if (list === 'diaspora') return GROUPS.filter((g) => g.abroad || g.slug === 'dia-abuja').reduce((a, g) => a + g.members, 0);
    return picks.reduce((a, r) => a + r.captains, 0);
  }, [rows, sel, list, m.optIn, m.giving.donors, share]);

  const perMsg = SMS_PRICING.perPage * (1 + SMS_PRICING.vat);
  const cost = Math.round(recipients * info.pages * perMsg);
  const last = sent[0];
  const paused = last ? last.recipients > 0 && (last.optOuts / last.recipients) * 100 >= 2 : false;

  const blockers: string[] = [];
  if (list === 'cleared' && !m.gate0) blockers.push('Gate 0 has not cleared: the INEC numbers cannot be used until counsel confirms how they were obtained.');
  if (!/stop/i.test(text)) blockers.push('Every message needs a one-reply opt-out (“Reply STOP to opt out”).');
  if (tpl === 'give' && list === 'cleared') blockers.push('Giving asks go only to opted-in supporters and donors.');
  if (recipients === 0) blockers.push('No recipients in this cut.');
  if (paused) blockers.push('Sends are paused: the last send passed 2% opt-outs. The communications lead and counsel review first.');
  const warns: string[] = [];
  if (info.unicode) warns.push(`Contains ${info.odd.join(' ')} so it sends as Unicode: 70 characters a page instead of 160.`);
  if (info.pages > 1) warns.push(`${info.pages} pages: the cost multiplies. Trim to one page if you can.`);
  if (lang !== 'English') warns.push(`${lang} text must be checked by a native-speaker reviewer for this ward before it goes.`);
  if (picked.length === 0) blockers.push('Pick at least one ward.');

  const history = Array.from({ length: m.pushes }, (_, k) => ({
    id: `h${k}`,
    when: addDays(WEEK1_START, 17 + 7 * k),
    what: `Ward One Push ${k + 1}`,
    n: SMS_LIST,
    delivered: Math.round(SMS_LIST * 0.964),
    clicks: Math.round(SMS_LIST * 0.964 * 0.078),
    signups: Math.round(SMS_LIST * 0.964 * 0.012),
    out: 0.6,
  })).reverse();

  const doSend = (kind: 'test' | 'push') => {
    const n = kind === 'test' ? Math.min(500, recipients) : recipients;
    const delivered = Math.round(n * 0.964);
    setState((s) => ({
      sms: [
        { id: uid('sms'), at: nowIso(), clock: clock.short, kind, audience: SMS_LISTS.find((l) => l.id === list)?.label ?? list, wards: picked, text, recipients: n, cost: Math.round(n * info.pages * perMsg), delivered, clicks: Math.round(delivered * 0.078), signups: Math.round(delivered * 0.012), optOuts: Math.round(n * 0.006) },
        ...s.sms,
      ],
    }));
    setFlash(kind === 'test' ? `Test send recorded for ${num(n)} numbers (simulated).` : `Send recorded for ${num(n)} numbers (simulated).`);
    setTimeout(() => setFlash(''), 4000);
  };

  const setAll = (slugs: string[]) => setPicked(slugs);
  const toggle = (slug: string) => setPicked((p) => (p.includes(slug) ? p.filter((x) => x !== slug) : [...p, slug]));
  const senderOk = clock.date >= '2026-11-02';

  return (
    <>
      <PageHead
        title="SMS composer"
        sub="Surgical, not blanket: one short message, one rich link, cut by ward, moment, list and language. Nothing leaves without passing the rules on the right."
        prov={['plan', 'sample']}
      />

      <div className="grid g21">
        <div className="col gap14">
          <Card title="1 · Moment and list">
            <div className="grid g2">
              <label className="fld">Moment
                <select value={tpl} onChange={(e) => { setTpl(e.target.value); setCustom(null); }}>
                  {SMS_TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.use}</option>)}
                </select>
              </label>
              <label className="fld">List
                <select value={list} onChange={(e) => setList(e.target.value)}>
                  {SMS_LISTS.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
                </select>
                <span className="h">{SMS_LISTS.find((l) => l.id === list)?.note}</span>
              </label>
              <label className="fld">Language
                <select value={lang} onChange={(e) => setLang(e.target.value as (typeof LANGS)[number])}>
                  {LANGS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </label>
              <label className="fld">Send time
                <select defaultValue="1830"><option value="1830">Thursday 6:30pm (One Push)</option><option value="now">Now (test only)</option></select>
              </label>
            </div>
          </Card>

          <Card title={`2 · Wards (${picked.length} of 319)`} right={
            <div className="row gap6 wrap">
              <button className="btn ghost sm" onClick={() => setAll(WARDS.map((x) => x.slug))}>All</button>
              {LGA_LIST.map((lga) => <button key={lga.key} className="btn ghost sm" onClick={() => setAll(WARDS.filter((ward) => ward.lga === lga.key).map((ward) => ward.slug))}>{lga.name}</button>)}
              <button className="btn ghost sm" onClick={() => setAll([])}>None</button>
            </div>
          }>
            <div className="grid g4 keep2" style={{ gap: 6 }}>
              {WARDS.map((x) => (
                <label key={x.slug} className="chk small" style={{ alignItems: 'center' }}>
                  <input type="checkbox" checked={sel.has(x.slug)} onChange={() => toggle(x.slug)} /> {x.name}
                </label>
              ))}
            </div>
          </Card>

          <Card title="3 · Message" right={<span className={`small b ${info.pages > 1 || info.unicode ? 'red' : 'green'}`}>{info.len} characters · {info.pages} {info.pages === 1 ? 'page' : 'pages'}</span>}>
            <textarea value={text} onChange={(e) => setCustom(e.target.value)} aria-label="Message text" rows={4} />
            <div className="row gap8 mt8 wrap">
              <button className="btn ghost sm" onClick={() => setCustom(null)}>Reset to template</button>
              <span className="tiny muted">{`{ward}`}, {`{issue}`}, {`{link}`} and {`{tag}`} are filled from the cut above. Plain characters only: ₦ and curly quotes force Unicode.</span>
            </div>
          </Card>
        </div>

        <div className="col gap14">
          <Card title="Preview">
            <div className="card panel" style={{ background: '#eef2f0' }}>
              <div className="tiny muted">From: {senderOk ? 'RESETRIVERS (proposed sender ID)' : 'Sender ID: registration pending'}</div>
              <div className="mt8" style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: '14px 14px 14px 4px', padding: '10px 12px', fontSize: 14, whiteSpace: 'pre-wrap' }}>{text}</div>
              {picked.length > 1 && <div className="tiny muted mt8">Each ward gets its own link to its own ward page. Shown here for {WARDS.find((x) => x.slug === picked[0])?.name}.</div>}
            </div>
          </Card>

          <Card title="Rules check" right={blockers.length ? <Chip tone="red">{blockers.length} blocking</Chip> : <Chip>Clear to send</Chip>}>
            {blockers.map((b) => <Note key={b} tone="red">{b}</Note>)}
            {warns.map((b) => <div className="mt8" key={b}><Note tone="warn">{b}</Note></div>)}
            {!blockers.length && !warns.length && <p className="small muted">Opt-out present, one page, plain characters, list allowed.</p>}
            <div className="grid g2 keep2 mt12">
              <Stat label="Recipients" value={num(recipients)} prov="sample" />
              <Stat label="Estimated cost" value={naira(cost)} sub={`₦${SMS_PRICING.perPage} a page + 7.5% VAT, indicative`} prov="sample" />
            </div>
            <div className="row gap8 mt12 wrap">
              <button className="btn sec" disabled={blockers.length > 0 || recipients === 0} onClick={() => doSend('test')}>Send test (500)</button>
              <button className="btn" disabled={blockers.length > 0} onClick={() => doSend('push')}>Send to {num(recipients)}</button>
            </div>
            {flash && <div className="note ok mt8" role="status">{flash}</div>}
            <p className="tiny muted mt8">Simulated: nothing is sent from this preview. In production the gateway returns real delivery receipts, and the system itself pauses at 2% opt-outs.</p>
          </Card>
        </div>
      </div>

      <Card title="Sends" className="mt16">
        <div className="tw">
          <table className="tbl">
            <thead><tr><th>When</th><th>What</th><th className="num">Recipients</th><th className="num">Delivered</th><th className="num">Clicks</th><th className="num">Sign-ups</th><th className="num">Opt-outs</th></tr></thead>
            <tbody>
              {sent.map((s) => (
                <tr key={s.id} className="hl">
                  <td className="small">{s.clock}</td>
                  <td className="small"><b>{s.kind === 'test' ? 'Test' : 'Push'}</b> · {s.audience} · {s.wards.length} wards<div className="tiny muted">{s.text.slice(0, 70)}…</div></td>
                  <td className="num">{num(s.recipients)}</td><td className="num">{num(s.delivered)}</td><td className="num">{num(s.clicks)}</td><td className="num">{num(s.signups)}</td><td className="num">{((s.optOuts / Math.max(1, s.recipients)) * 100).toFixed(1)}%</td>
                </tr>
              ))}
              {history.map((h) => (
                <tr key={h.id}>
                  <td className="small">{dayLabel(h.when)}</td>
                  <td className="small"><b>{h.what}</b> · all 319 wards <Prov k="sample" /></td>
                  <td className="num">{num(h.n)}</td><td className="num">{num(h.delivered)}</td><td className="num">{num(h.clicks)}</td><td className="num">{num(h.signups)}</td><td className="num">{h.out}%</td>
                </tr>
              ))}
              {!sent.length && !history.length && <tr><td colSpan={7} className="small muted">No sends yet. The first full ward push is Thursday 5 November, once Gate 0 clears.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
