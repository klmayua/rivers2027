import Link from 'next/link';
import { compact, num } from '@/lib/format';

/** SVG-only charts: no chart library, nothing to load, prints cleanly. */

export function Spark({ values, w = 120, h = 36, color = 'var(--green)', fill = true }: { values: number[]; w?: number; h?: number; color?: string; fill?: boolean }) {
  if (values.length < 2) return <svg width={w} height={h} aria-hidden="true" />;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const sx = (i: number) => (i / (values.length - 1)) * (w - 4) + 2;
  const sy = (v: number) => h - 3 - ((v - min) / (max - min || 1)) * (h - 8);
  const pts = values.map((v, i) => `${sx(i).toFixed(1)},${sy(v).toFixed(1)}`);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      {fill && <polygon points={`2,${h - 2} ${pts.join(' ')} ${w - 2},${h - 2}`} fill={color} opacity={0.1} />}
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={sx(values.length - 1)} cy={sy(values[values.length - 1])} r={3} fill={color} />
    </svg>
  );
}

export function Bars({ values, labels, w = 520, h = 160, color = 'var(--green)', hi, fmt = compact, target }: { values: number[]; labels?: string[]; w?: number; h?: number; color?: string; hi?: number; fmt?: (n: number) => string; target?: number }) {
  const max = Math.max(...values, target ?? 0, 1) * 1.1;
  const bw = w / Math.max(values.length, 1);
  const base = h - 22;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" role="img" aria-label="Bar chart" style={{ display: 'block' }}>
      {target !== undefined && (
        <g>
          <line x1={0} x2={w} y1={base - (target / max) * (base - 14)} y2={base - (target / max) * (base - 14)} stroke="var(--red)" strokeDasharray="4 4" strokeWidth={1.4} />
          <text x={w - 2} y={base - (target / max) * (base - 14) - 4} textAnchor="end" fontSize={10} fill="var(--red-text)" fontWeight={700}>
            goal {fmt(target)}
          </text>
        </g>
      )}
      {values.map((v, i) => {
        const bh = (v / max) * (base - 14);
        return (
          <g key={i}>
            <rect x={i * bw + bw * 0.16} y={base - bh} width={bw * 0.68} height={Math.max(bh, 0)} rx={3} fill={hi === i ? 'var(--red)' : color} opacity={hi === undefined || hi === i ? 1 : 0.8} />
            <text x={i * bw + bw / 2} y={base - bh - 4} textAnchor="middle" fontSize={10} fill="var(--muted)" fontWeight={600}>
              {fmt(v)}
            </text>
            {labels && (
              <text x={i * bw + bw / 2} y={h - 6} textAnchor="middle" fontSize={10} fill="var(--muted)">
                {labels[i]}
              </text>
            )}
          </g>
        );
      })}
      <line x1={0} x2={w} y1={base} y2={base} stroke="var(--line2)" />
    </svg>
  );
}

export function Donut({ parts, size = 130, center, sub, legend = false }: { parts: Array<{ v: number; color: string; label: string }>; size?: number; center?: string; sub?: string; legend?: boolean }) {
  const total = parts.reduce((a, p) => a + p.v, 0) || 1;
  const r = size / 2 - 12;
  const c = 2 * Math.PI * r;
  const lens = parts.map((p) => (p.v / total) * c);
  const starts = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));
  const svg = (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Share chart" style={{ flex: 'none' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--panel2)" strokeWidth={14} />
      {parts.map((p, i) => (
        <circle key={p.label} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={p.color} strokeWidth={14} strokeDasharray={`${lens[i]} ${c - lens[i]}`} strokeDashoffset={-starts[i]} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      ))}
      {center && (
        <text x={size / 2} y={size / 2 + (sub ? 0 : 6)} textAnchor="middle" fontSize={20} fontWeight={700} fill="var(--ink)">
          {center}
        </text>
      )}
      {sub && (
        <text x={size / 2} y={size / 2 + 16} textAnchor="middle" fontSize={10.5} fill="var(--muted)">
          {sub}
        </text>
      )}
    </svg>
  );
  if (!legend) return svg;
  return (
    <div className="row gap14 wrap">
      {svg}
      <div className="col" style={{ gap: 5 }}>
        {parts.map((p) => (
          <div key={p.label} className="row gap6 tiny">
            <i style={{ width: 10, height: 10, borderRadius: 3, background: p.color, display: 'inline-block' }} />
            <span>{p.label}</span>
            <b>{((p.v / total) * 100).toFixed(0)}%</b>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StackBar({ parts, h = 14 }: { parts: Array<{ v: number; color: string; label: string }>; h?: number }) {
  const total = parts.reduce((a, p) => a + p.v, 0) || 1;
  return (
    <div style={{ display: 'flex', height: h, borderRadius: 99, overflow: 'hidden', background: 'var(--panel2)' }} role="img" aria-label={parts.map((p) => `${p.label} ${p.v}`).join(', ')}>
      {parts.map((p) => (
        <div key={p.label} title={`${p.label}: ${num(p.v)}`} style={{ width: `${(p.v / total) * 100}%`, background: p.color }} />
      ))}
    </div>
  );
}

// ------------------------------------------------------------------------------------------ TREEMAP (squarified)
type Item = { label: string; value: number; color: string; href?: string; sub?: string; text?: string };
type Rect = Item & { x: number; y: number; w: number; h: number };

function squarify(items: Item[], x: number, y: number, w: number, h: number): Rect[] {
  const total = items.reduce((a, i) => a + i.value, 0) || 1;
  const scaled = items.map((i) => ({ ...i, area: (i.value * w * h) / total }));
  const out: Rect[] = [];
  const worst = (row: typeof scaled, side: number) => {
    const s = row.reduce((a, r) => a + r.area, 0);
    return Math.max(...row.map((r) => Math.max((side * side * r.area) / (s * s), (s * s) / (side * side * r.area))));
  };
  let rest = scaled.slice();
  let row: typeof scaled = [];
  let [cx, cy, cw, ch] = [x, y, w, h];
  const flush = () => {
    const s = row.reduce((a, r) => a + r.area, 0);
    if (cw >= ch) {
      const col = s / ch;
      let yy = cy;
      for (const r of row) {
        const hh = r.area / col;
        out.push({ ...r, x: cx, y: yy, w: col, h: hh });
        yy += hh;
      }
      cx += col;
      cw -= col;
    } else {
      const rh = s / cw;
      let xx = cx;
      for (const r of row) {
        const ww = r.area / rh;
        out.push({ ...r, x: xx, y: cy, w: ww, h: rh });
        xx += ww;
      }
      cy += rh;
      ch -= rh;
    }
    row = [];
  };
  while (rest.length) {
    const side = Math.min(cw, ch);
    const cand = rest[0];
    if (!row.length || worst([...row, cand], side) <= worst(row, side)) {
      row.push(cand);
      rest = rest.slice(1);
    } else flush();
  }
  if (row.length) flush();
  return out;
}

function wrap(label: string, max: number): string[] {
  const toks = label.split(/(?<=[ -])/);
  const lines: string[] = [];
  let cur = '';
  for (const t of toks) {
    if ((cur + t).trim().length <= max || !cur) cur += t;
    else {
      lines.push(cur.trim());
      cur = t;
    }
  }
  if (cur) lines.push(cur.trim());
  return lines;
}

export function Treemap({ items, w = 760, h = 300, minLabel = 46 }: { items: Item[]; w?: number; h?: number; minLabel?: number }) {
  const rects = squarify(items.slice().sort((a, b) => b.value - a.value), 0, 0, w, h);
  return (
    <div className="tm-wrap">
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Ward map, schematic">
        {rects.map((r) => {
          const fs = Math.min(r.w, r.h) > 86 ? 13 : Math.min(r.w, r.h) > 64 ? 11.5 : 10;
          const maxc = Math.max(4, Math.floor((r.w - 8) / (fs * 0.56)));
          const lines = r.w > minLabel && r.h > 30 ? wrap(r.label, maxc) : [];
          const lh = fs * 1.15;
          const ty = r.y + r.h / 2 - ((lines.length - 1) * lh) / 2 - (r.sub ? 5 : 0) + fs * 0.35;
          const body = (
            <g>
              <rect x={r.x + 1} y={r.y + 1} width={Math.max(r.w - 2, 0)} height={Math.max(r.h - 2, 0)} rx={5} fill={r.color} />
              {lines.map((ln, i) => (
                <text key={i} x={r.x + r.w / 2} y={ty + i * lh} textAnchor="middle" fontSize={fs} fontWeight={700} fill={r.text ?? '#fff'}>
                  {ln}
                </text>
              ))}
              {r.sub && lines.length > 0 && (
                <text x={r.x + r.w / 2} y={ty + lines.length * lh + 1} textAnchor="middle" fontSize={fs - 1.5} fill={r.text ?? '#fff'} opacity={0.88}>
                  {r.sub}
                </text>
              )}
              <title>{`${r.label}${r.sub ? ' · ' + r.sub : ''}`}</title>
            </g>
          );
          return r.href ? (
            <Link key={r.label} href={r.href}>
              {body}
            </Link>
          ) : (
            <g key={r.label}>{body}</g>
          );
        })}
      </svg>
    </div>
  );
}

/** Green ramp for coverage and readiness (0..100). */
export function ramp(pct: number): string {
  if (pct >= 85) return '#075c2e';
  if (pct >= 70) return '#0a7a3d';
  if (pct >= 55) return '#3f9a63';
  if (pct >= 40) return '#7fb28f';
  if (pct >= 25) return '#c9a24a';
  return '#c8202f';
}
