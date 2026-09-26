import type { ReactNode } from 'react';

// reactbits.dev-style animated gradient text headline.
export function AnimatedGradientText({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`bg-[length:200%_auto] bg-clip-text text-transparent animate-[maar-gradient_6s_ease_infinite] ${className}`}
      style={{
        backgroundImage:
          'linear-gradient(90deg, var(--maar-quran), var(--maar-gold), var(--maar-bible), var(--maar-torah), var(--maar-quran))',
      }}
    >
      {children}
    </span>
  );
}
