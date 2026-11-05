import type { Metadata } from 'next';
import { AuthGuard } from '@/components/auth-guard';
import { PhoneFrame } from '@/components/phone';

export const metadata: Metadata = {
  title: 'Agents’ app',
  manifest: '/manifest-agents.webmanifest',
  robots: { index: false, follow: false },
};

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <PhoneFrame>{children}</PhoneFrame>
    </AuthGuard>
  );
}
