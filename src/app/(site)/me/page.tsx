import { AuthGuard } from '@/components/auth-guard';
import { MyPage } from './view';

export const metadata = { title: 'My page', robots: { index: false, follow: false } };

export default function Me() {
  return (
    <AuthGuard>
      <MyPage />
    </AuthGuard>
  );
}
