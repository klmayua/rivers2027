'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { usePersona } from '@/lib/hooks';

export default function OpsIndex() {
  const router = useRouter();
  const p = usePersona();
  const home = p.home.startsWith('/ops') ? p.home : '/ops/command';
  useEffect(() => {
    router.replace(home);
  }, [router, home]);
  return <p className="muted">Opening your desk… <Link href={home}>Go now</Link></p>;
}
