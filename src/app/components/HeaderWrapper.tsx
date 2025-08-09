'use client';

import { usePathname } from 'next/navigation';
import GlobalHeader from './GlobalHeader';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const hideOn = ['/login', '/register', '/verify-email'];
  if (hideOn.includes(pathname)) return null;
  return <GlobalHeader />;
}


