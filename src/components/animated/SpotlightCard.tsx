import { useRef, useState, type ReactNode } from 'react';

// reactbits.dev-style "SpotlightCard": a soft radial highlight that follows
// the pointer. Pure CSS custom properties + mouse tracking, no dependency.
export function SpotlightCard({
  children,
  accent = '183, 138, 61',
  className = '',
}: {
  children: ReactNode;
  accent?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setPos({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }}
      className={`maar-surface relative overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-0.5 ${className}`}
      style={{
        backgroundImage: `radial-gradient(400px circle at ${pos.x}% ${pos.y}%, rgba(${accent}, 0.10), transparent 60%)`,
      }}
    >
      {children}
    </div>
  );
}
