import { notFound } from 'next/navigation';
import { WardView } from '@/components/ward-view';
import { WARDS, WARD_BY_SLUG } from '@/data/geo';

export const dynamicParams = false;

export function generateStaticParams() {
  return WARDS.map((w) => ({ ward: w.slug }));
}

export default async function WardPage({ params }: { params: Promise<{ ward: string }> }) {
  const { ward } = await params;
  const w = WARD_BY_SLUG[ward];
  if (!w) notFound();
  return <WardView ward={w} />;
}
