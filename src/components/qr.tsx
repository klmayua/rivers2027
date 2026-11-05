'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

/** A real, scannable QR code (SVG) for a path on this site. */
export function QR({ path, size = 132, label }: { path: string; size?: number; label?: string }) {
  const [svg, setSvg] = useState('');
  const [full, setFull] = useState(path);
  useEffect(() => {
    let live = true;
    const url = (path.startsWith('http') ? '' : window.location.origin) + path;
    QRCode.toString(url, { type: 'svg', margin: 0, color: { dark: '#14211a', light: '#ffffff' }, errorCorrectionLevel: 'M' })
      .then((s) => {
        if (live) {
          setSvg(s);
          setFull(url);
        }
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [path]);
  return (
    <figure style={{ margin: 0, textAlign: 'center' }}>
      <div
        role="img"
        aria-label={label ?? `QR code for ${full}`}
        style={{ width: size, height: size, margin: '0 auto', padding: 8, background: '#fff', border: '1px solid var(--line)', borderRadius: 12 }}
        dangerouslySetInnerHTML={{ __html: svg.replace('<svg ', '<svg width="100%" height="100%" ') }}
      />
      {label !== '' && <figcaption className="tiny muted mt4" style={{ wordBreak: 'break-all' }}>{label ?? full.replace(/^https?:\/\//, '')}</figcaption>}
    </figure>
  );
}
