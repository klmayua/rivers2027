'use client';

/** The Ogami conversation. Held in memory so the dock, the home panel and the Ask page share one thread. */
import { useSyncExternalStore } from 'react';
import { fallbackReply, ogamiConfig, ogamiGreeting, type Action } from '@/data/ogami';

export type ChatMode = 'ready' | 'live' | 'fallback';
export type Msg = { id: number; who: 'me' | 'ai' | 'sys'; text: string; action?: Action };
export type ChatState = { msgs: Msg[]; mode: ChatMode; sending: boolean; dockOpen: boolean; used: boolean };

const GREETING: Msg = { id: 0, who: 'ai', text: ogamiGreeting };
let state: ChatState = { msgs: [GREETING], mode: 'ready', sending: false, dockOpen: false, used: false };
const SERVER: ChatState = state;
const listeners = new Set<() => void>();
let seq = 1;
let sessionId: string | null = null;
let liveFailed = false;
const history: Array<{ role: 'user' | 'assistant'; content: string }> = [];

function set(patch: Partial<ChatState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

export function useChat(): ChatState {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    () => state,
    () => SERVER,
  );
}

export function openDock(): void {
  set({ dockOpen: true });
}
export function closeDock(): void {
  set({ dockOpen: false });
}

function push(m: Omit<Msg, 'id'>) {
  set({ msgs: [...state.msgs, { ...m, id: seq++ }] });
}

type OgamiReply = { reply?: string; session_id?: string; degraded?: boolean; disabled?: boolean; escalated?: boolean; cap_reached?: boolean };

export async function askOgami(text: string): Promise<void> {
  const msg = text.trim().slice(0, 900);
  if (!msg || state.sending) return;
  push({ who: 'me', text: msg });
  set({ sending: true, used: true });
  history.push({ role: 'user', content: msg });

  let replied = false;
  if (ogamiConfig.live && !liveFailed) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), ogamiConfig.timeoutMs);
      const res = await fetch(ogamiConfig.endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: msg, public_key: ogamiConfig.publicKey, session_id: sessionId ?? undefined, history: history.slice(-12) }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const data = (await res.json()) as OgamiReply;
      // A degraded engine, a disabled key or a cap hit are real answers from OGAMI, but none of them is the
      // assistant doing its job, so they fall through to the campaign's own published answers.
      if (res.ok && data && data.reply && !data.degraded && !data.disabled) {
        if (data.session_id) sessionId = data.session_id;
        push({ who: 'ai', text: data.reply });
        history.push({ role: 'assistant', content: data.reply });
        set({ mode: 'live' });
        if (data.escalated) push({ who: 'sys', text: 'Passed to the People’s Help Desk. A person on the team will reply.' });
        replied = true;
      } else {
        liveFailed = true;
      }
    } catch {
      liveFailed = true;
    }
  }

  if (!replied) {
    const r = fallbackReply(msg);
    push({ who: 'ai', text: r.reply, action: r.action });
    history.push({ role: 'assistant', content: r.reply });
    set({ mode: 'fallback' });
    if (r.escalate) push({ who: 'sys', text: 'You can send this to the People’s Help Desk. A person on the team replies within 5 working days.' });
  }
  set({ sending: false });
}

export function modeLabel(m: ChatMode): string {
  return m === 'live' ? 'Live · OgaChat' : m === 'fallback' ? 'Answering from the campaign’s published positions' : 'AI assistant · answers from published material';
}
