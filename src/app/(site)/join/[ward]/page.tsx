import { notFound } from 'next/navigation';
import { Back } from '@/components/bits';
import { JoinForm } from '@/components/join';
import { WARDS, WARD_BY_SLUG } from '@/data/geo';

export function generateStaticParams() {
  return WARDS.map((w) => ({ ward: w.slug }));
}

export default async function JoinWard({ params }: { params: Promise<{ ward: string }> }) {
  const { ward } = await params;
  const w = WARD_BY_SLUG[ward];
  if (!w) notFound();
  return (
    <div className="narrow s-pad col gap14">
      <Back href="/" label="Home" />
      <div>
        <div className="chip blue">{w.name} · {w.lgaName}</div>
        <h2 className="mt8">Join the ground team in {w.name}</h2>
        <p className="small muted mt4">Your ward coordinator will welcome you. Supporter, champion or polling-unit helper: pick what suits you.</p>
      </div>
      <JoinForm ward={w.slug} via="ward-link" />
    </div>
  );
}
