import type { Metadata } from 'next';
import { AuthGuard } from '@/components/auth-guard';
import { OpsShell } from '@/components/ops-shell';

export const metadata: Metadata = { title: 'Campaign HQ', robots: { index: false, follow: false } };

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <OpsShell>{children}</OpsShell>
    </AuthGuard>
  );
}
