import { notFound } from 'next/navigation';
import { WARDS, WARD_BY_SLUG } from '@/data/geo';
import { WEEKS, WEEK_BY_SLUG } from '@/data/weeks';
import { WardIssue } from './view';

export function generateStaticParams() {
  return WARDS.flatMap((w) => WEEKS.map((k) => ({ ward: w.slug, issue: k.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ ward: string; issue: string }> }) {
  const { ward, issue } = await params;
  const w = WARD_BY_SLUG[ward];
  const k = WEEK_BY_SLUG[issue];
  if (!w || !k) return {};
  return { title: `${k.issue} · ${w.name}`, description: `Chief Barr. Dumo Lulu Briggs on ${k.issue}: the facts, his plan and your questions, for ${w.name}.` };
}

export default async function Page({ params }: { params: Promise<{ ward: string; issue: string }> }) {
  const { ward, issue } = await params;
  const w = WARD_BY_SLUG[ward];
  const k = WEEK_BY_SLUG[issue];
  if (!w || !k) notFound();
  return <WardIssue wardSlug={w.slug} issueSlug={k.slug} />;
}
