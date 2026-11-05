import { notFound } from 'next/navigation';
import { GROUPS, GROUP_BY_SLUG } from '@/data/content';
import { GroupView } from '@/components/group-view';

export function generateStaticParams() {
  return GROUPS.map((g) => ({ group: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;
  const g = GROUP_BY_SLUG[group];
  return g ? { title: g.name } : {};
}

export default async function Page({ params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;
  if (!GROUP_BY_SLUG[group]) notFound();
  return <GroupView slug={group} />;
}
