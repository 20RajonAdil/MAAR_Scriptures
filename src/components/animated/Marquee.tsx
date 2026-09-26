import type { ReactNode } from 'react';

// reactbits.dev-style infinite marquee, CSS-driven (no JS animation loop).
export function Marquee({ children, speed = 30 }: { children: ReactNode; speed?: number }) {
  return (
    <div className="overflow-hidden">
      <div
        className="flex w-max gap-8 animate-[maar-marquee_linear_infinite]"
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex gap-8">{children}</div>
        <div className="flex gap-8" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
