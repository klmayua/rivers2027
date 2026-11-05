import type { Metadata } from 'next';
import { SiteShell } from '@/components/site/shell';

export const metadata: Metadata = {
  manifest: '/manifest-rivers.webmanifest',
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
