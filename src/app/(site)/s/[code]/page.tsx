import { Personal } from './view';

// Share codes are made in the visitor's browser, so any code must open. One is prerendered; the rest render on first visit.
export function generateStaticParams() {
  return [{ code: 'demo-code' }];
}

export const metadata = { title: 'A friend asked you to back Rivers' };

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <Personal code={code} />;
}
