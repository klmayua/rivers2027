'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { SUGGESTIONS } from '@/data/ogami';
import { askOgami, closeDock, modeLabel, openDock, useChat } from '@/lib/chat-state';
import { Icon } from './brand';

/** The conversation itself: header with mode, log, suggestion chips and the input. */
export function OgamiPanel({ suggestions = SUGGESTIONS, height, onClose, title = 'Ogami' }: { suggestions?: readonly string[]; height?: number | string; onClose?: () => void; title?: string }) {
  const chat = useChat();
  const [text, setText] = useState('');
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat.msgs.length, chat.sending]);

  function send(e?: React.FormEvent) {
    e?.preventDefault();
    const t = text;
    setText('');
    void askOgami(t);
  }

  return (
    <div className="og" style={height ? { height } : undefined}>
      <div className="og-head">
        <span className={`og-av ${chat.mode}`} aria-hidden="true"><Icon name="chat" size={18} /></span>
        <div className="sp" style={{ minWidth: 0 }}>
          <div className="og-nm">{title} <span className="og-tag">AI assistant</span></div>
          <div className="og-st"><i className={`og-dot ${chat.mode}`} />{modeLabel(chat.mode)}</div>
        </div>
        {onClose && <button className="og-x" onClick={onClose} aria-label="Close chat">✕</button>}
      </div>
      <div className="og-log" ref={logRef} role="log" aria-live="polite" aria-label="Conversation with Ogami">
        {chat.msgs.map((m) => (
          <div key={m.id} className={`og-row ${m.who}`}>
            <div className={`og-b ${m.who}`}>
              {m.who === 'ai' && <div className="og-who">Ogami</div>}
              {m.text.split('\n\n').map((p, i) => (
                <p key={i} style={i ? { marginTop: 8 } : undefined}>{p}</p>
              ))}
              {m.action && <Link className="btn sec sm mt8" href={m.action.href} onClick={() => closeDock()}>{m.action.label} →</Link>}
            </div>
          </div>
        ))}
        {chat.sending && (
          <div className="og-row ai"><div className="og-b ai typing" aria-label="Ogami is typing"><span /><span /><span /></div></div>
        )}
      </div>
      {!chat.used && (
        <div className="og-chips">
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => void askOgami(s)}>{s}</button>
          ))}
        </div>
      )}
      <form className="og-in" onSubmit={send} autoComplete="off">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about the Contract, roads, events, your ward…" aria-label="Your message" maxLength={900} />
        <button className="btn red" type="submit" disabled={chat.sending || !text.trim()} aria-label="Send"><Icon name="send" size={18} /></button>
      </form>
      <p className="og-fine">Ogami is an AI assistant for the campaign, not Chief Barr. Dumo. It answers from published material and sends the rest to the Help Desk. Do not share card numbers or private details.</p>
    </div>
  );
}

/** Desktop launcher: a round button bottom-right that opens the panel. Hidden on phones, where Ask is in the bottom bar. */
export function OgamiDock() {
  const chat = useChat();
  const path = usePathname();
  if (path === '/ask' || path.startsWith('/signin')) return null;
  return (
    <div className="og-dock">
      {chat.dockOpen && (
        <div className="og-pop" role="dialog" aria-label="Chat with Ogami">
          <OgamiPanel onClose={closeDock} height="100%" />
        </div>
      )}
      {!chat.dockOpen && (
        <button className="og-fab" onClick={openDock} aria-label="Ask Ogami: chat with the campaign">
          <Icon name="chat" size={22} />
          <span>Ask Ogami</span>
        </button>
      )}
    </div>
  );
}
