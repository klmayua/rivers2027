import { SignInView } from './view';

export const metadata = { title: 'Sign in', description: 'Sign in to the DLB2027 campaign platform.', robots: { index: false, follow: false } };

export default function SignIn() {
  return <SignInView />;
}
