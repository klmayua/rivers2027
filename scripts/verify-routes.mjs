#!/usr/bin/env node
/**
 * Route check for IKA2027. No test framework, no browser: it enumerates every route Next prerendered
 * (from .next/prerender-manifest.json), fetches each one from a running server and checks the status.
 * It also spot-checks a few pages for expected text, the manifests, the service worker and the images.
 *
 *   npm run build && npm run verify              starts `next start` on a spare port, checks, stops it
 *   BASE_URL=https://ika2027.farawa.co npm run verify     checks a deployed site (no local server)
 *
 * Exit code 0 = all good, 1 = at least one failure.
 */
import { spawn } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const remote = process.env.BASE_URL;
const port = process.env.PORT || '3199';
const base = (remote || `http://localhost:${port}`).replace(/\/$/, '');

let server = null;
let stopping = false;
async function start() {
  if (remote) return;
  if (!existsSync('.next/BUILD_ID')) {
    console.error('No production build found. Run `npm run build` first.');
    process.exit(1);
  }
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', port], { stdio: ['ignore', 'pipe', 'pipe'] });
  server.on('exit', (c) => {
    if (c && !stopping) console.error('next start exited with code', c);
  });
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(base + '/');
      if (r.ok) return;
    } catch {
      /* not up yet */
    }
    await sleep(500);
  }
  console.error('Server did not start in 30 seconds.');
  stop();
  process.exit(1);
}
function stop() {
  stopping = true;
  if (server) server.kill();
}

const failures = [];
let checked = 0;

async function get(path) {
  const res = await fetch(base + path, { redirect: 'manual' });
  return res;
}

async function checkRoute(path) {
  try {
    const res = await get(path);
    checked++;
    if (res.status !== 200) failures.push(`${res.status} ${path}`);
  } catch (e) {
    failures.push(`ERR ${path} ${e.message}`);
  }
}

async function expectText(path, text) {
  try {
    const res = await get(path);
    const body = await res.text();
    checked++;
    if (res.status !== 200) failures.push(`${res.status} ${path}`);
    else if (!body.includes(text)) failures.push(`MISSING "${text}" in ${path}`);
  } catch (e) {
    failures.push(`ERR ${path} ${e.message}`);
  }
}

async function expectStatus(path, status, type) {
  try {
    const res = await get(path);
    checked++;
    if (res.status !== status) failures.push(`${res.status} (wanted ${status}) ${path}`);
    else if (type && !(res.headers.get('content-type') || '').includes(type)) failures.push(`TYPE ${res.headers.get('content-type')} (wanted ${type}) ${path}`);
  } catch (e) {
    failures.push(`ERR ${path} ${e.message}`);
  }
}

async function expectRedirect(path, to) {
  try {
    const res = await get(path);
    checked++;
    const loc = res.headers.get('location') || '';
    if (![301, 307, 308].includes(res.status)) failures.push(`${res.status} (wanted a redirect) ${path}`);
    else if (!loc.endsWith(to) && loc !== to) failures.push(`REDIRECT ${path} -> ${loc} (wanted ${to})`);
  } catch (e) {
    failures.push(`ERR ${path} ${e.message}`);
  }
}

async function pool(items, n, fn) {
  const q = [...items];
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (q.length) await fn(q.shift());
    }),
  );
}

await start();
try {
  // 1. Every prerendered route
  let routes = [];
  if (existsSync('.next/prerender-manifest.json')) {
    const m = JSON.parse(readFileSync('.next/prerender-manifest.json', 'utf8'));
    routes = Object.keys(m.routes).filter((r) => !r.startsWith('/_'));
  }
  const core = ['/', '/signin', '/agenda', '/voter-help', '/me', '/agents', '/champion', '/ops/principal', '/ops/election', '/s/demo-code'];
  routes = [...new Set([...core, ...routes])];
  console.log(`Checking ${routes.length} routes on ${base} ...`);
  await pool(routes, 16, checkRoute);

  // 2. Spot checks on content (public pages render their text on the server; the private
  //    workspaces render the sign-in guard on the server and their content after sign-in in the browser)
  await expectText('/', 'Ika First. Ika Together. Ika Forward.');
  await expectText('/', 'Support the campaign');
  await expectText('/', 'Ask Ogami');
  await expectText('/signin', 'Sign in');
  await expectText('/signin', 'campaign platform for Barr. George Ogbormeh');
  await expectText('/agenda', 'The Ika Agenda');
  await expectText('/agenda/roads', 'The facts');
  await expectText('/agenda/your-vote', 'The facts');
  await expectText('/contract', 'The Ika Contract');
  await expectText('/voter-help', '16 January 2027');
  await expectText('/w/abavo-1/roads', 'Abavo');
  await expectText('/help-desk', 'Help Desk');
  for (const p of ['/ops/principal', '/ops/command', '/ops/sms', '/ops/election', '/ops/ledger', '/ops/pu/abavo-1-004', '/ops/ward/owa-3', '/agents', '/champion', '/me']) {
    await expectText(p, 'Opening your workspace');
  }

  // 3. Static assets and PWA files
  await expectStatus('/manifest-ika.webmanifest', 200, 'json');
  await expectStatus('/manifest-agents.webmanifest', 200, 'json');
  await expectStatus('/sw.js', 200, 'javascript');
  await expectStatus('/favicon.png', 200, 'image');
  await expectStatus('/og.jpg', 200, 'image');
  await expectStatus('/img/george-portrait.jpg', 200, 'image');
  await expectStatus('/img/pdp-emblem.png', 200, 'image');
  await expectStatus('/icons/icon-192.png', 200, 'image');

  // 4. Old /ika links keep working (permanent redirects)
  await expectRedirect('/ika', '/');
  await expectRedirect('/ika/manifesto', '/agenda');
  await expectRedirect('/ika/desk', '/help-desk');
  await expectRedirect('/ika/contract', '/contract');

  // 5. Things that must not exist
  await expectStatus('/ops/pu/not-a-unit', 404);
  await expectStatus('/ops/ward/not-a-ward', 404);
} finally {
  stop();
}

if (failures.length) {
  console.error(`\n${failures.length} problem(s) in ${checked} checks:`);
  for (const f of failures.slice(0, 40)) console.error('  ' + f);
  process.exit(1);
}
console.log(`OK: ${checked} checks passed.`);
