import type { ReactNode } from 'react';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';
import { OfflineBanner } from './OfflineBanner';
import { useDirection } from '../../hooks/useDirection';
import { useTheme } from '../../hooks/useTheme';

export function Layout({ children }: { children: ReactNode }) {
  useDirection();
  useTheme();
  return (
    <div className="min-h-screen flex flex-col">
      <OfflineBanner />
      <TopNav />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 pb-24 md:pb-10">{children}</main>
      <BottomNav />
    </div>
  );
}
