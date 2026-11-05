import type { ReactNode } from 'react';

export type ProvKey = 'inec' | 'reported' | 'plan' | 'derived' | 'sample' | 'candidate';

const PROV_LABEL: Record<ProvKey, string> = {
  inec: 'INEC',
  reported: 'Reported',
  plan: 'Plan',
  derived: 'Derived',
  sample: 'Sample',
  candidate: 'Candidate',
};
const PROV_HELP: Record<ProvKey, string> = {
  inec: 'From INEC data or an INEC-derived open dataset',
  reported: 'Reported by a named source (see Evidence)',
  plan: 'A target or term in the DLB2027 plan',
  derived: 'Calculated from sourced figures',
  sample: 'Illustrative figure: not a forecast, and not yet live data',
  candidate: 'The candidate’s own words or record',
};

export function Prov({ k }: { k: ProvKey }) {
  return (
    <span className={`prov p-${k}`} title={PROV_HELP[k]}>
      {PROV_LABEL[k]}
    </span>
  );
}

export function Sample({ children = 'Sample' }: { children?: ReactNode }) {
  return <span className="sample" title="Illustrative figure, not yet live data">{children}</span>;
}

export function Chip({ tone, children, title }: { tone?: 'red' | 'blue' | 'amber' | 'gray' | 'solid' | 'solidred'; children: ReactNode; title?: string }) {
  const cls = tone === 'solid' ? 'chip solid' : tone === 'solidred' ? 'chip solid red' : tone ? `chip ${tone}` : 'chip';
  return (
    <span className={cls} title={title}>
      {children}
    </span>
  );
}

export function Card({ title, right, children, tone, className = '' }: { title?: ReactNode; right?: ReactNode; children: ReactNode; tone?: 'tint' | 'panel' | 'red'; className?: string }) {
  return (
    <section className={`card ${tone ?? ''} ${className}`}>
      {(title || right) && (
        <div className="ch">
          {title && <h3>{title}</h3>}
          {right}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({ label, value, unit, sub, prov }: { label: ReactNode; value: ReactNode; unit?: ReactNode; sub?: ReactNode; prov?: ProvKey }) {
  return (
    <div className="stat">
      <div className="l">
        {label}
        {prov && <Prov k={prov} />}
      </div>
      <div className="v">
        {value}
        {unit && <small> {unit}</small>}
      </div>
      {sub && <div className="d">{sub}</div>}
    </div>
  );
}

export function Bar({ pct, tone }: { pct: number; tone?: 'red' | 'blue' | 'amber' }) {
  return (
    <div className={`bar ${tone ?? ''}`} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  );
}

export function PageHead({ title, sub, actions, prov }: { title: ReactNode; sub?: ReactNode; actions?: ReactNode; prov?: ProvKey[] }) {
  return (
    <header className="ph">
      <div className="tt">
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
        {prov && (
          <div className="row gap6 mt8 wrap">
            {prov.map((p) => (
              <Prov key={p} k={p} />
            ))}
          </div>
        )}
      </div>
      {actions && <div className="row wrap">{actions}</div>}
    </header>
  );
}

export function Note({ tone, children }: { tone?: 'warn' | 'red' | 'ok'; children: ReactNode }) {
  return <div className={`note ${tone ?? ''}`}>{children}</div>;
}

export function Legend() {
  const ks: ProvKey[] = ['inec', 'reported', 'plan', 'derived', 'sample'];
  return (
    <div className="row gap8 wrap small muted">
      {ks.map((k) => (
        <span key={k} className="row gap4">
          <Prov k={k} /> {PROV_HELP[k]}
        </span>
      ))}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="note" style={{ textAlign: 'center' }}>{children}</div>;
}
