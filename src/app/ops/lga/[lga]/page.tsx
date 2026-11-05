import { notFound } from 'next/navigation';
import { LgaView } from '@/components/lga-view';
import { LGA_LIST } from '@/data/geo';
import { LGA_LIST } from '@/data/geo';
import { LGA_LIST } from '@/data/geo';
import { LGA_LIST } from '@/data/geo';
import { LGA_LIST } from '@/data/geo';
import { LGA_LIST } from '@/data/geo';

export const dynamicParams = false;

export function generateStaticParams() {
  return LGA_LIST.map((lga) => ({ lga: lga.key }));
}

export default async function LgaPage({ params }: { params: Promise<{ lga: string }> }) {
  const { lga } = await params;
  if (!LGA_LIST.some((item) => item.key === lga)) notFound();
  return <LgaView lga={lga} />;
}
