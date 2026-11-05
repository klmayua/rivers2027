import { notFound } from 'next/navigation';
import { PuView } from '@/components/pu-view';
import { PUS, PU_BY_SLUG } from '@/data/geo';

export const dynamicParams = false;

export function generateStaticParams() {
  return PUS.map((p) => ({ pu: p.slug }));
}

export default async function PuPage({ params }: { params: Promise<{ pu: string }> }) {
  const { pu } = await params;
  const p = PU_BY_SLUG[pu];
  if (!p) notFound();
  return <PuView pu={p} />;
}
