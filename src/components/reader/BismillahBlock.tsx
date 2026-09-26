import { BISMILLAH_AR, BISMILLAH_EN } from '../../lib/bismillah';

// Shown as its own header above a Surah's verses — separated from ayah 1
// rather than left duplicated inside it — styled after MAAR.Quran's
// shimmering-gold Bismillah treatment, applied to this app's own palette.
export function BismillahBlock() {
  return (
    <div className="text-center py-6 mb-2 border-b" style={{ borderColor: 'var(--maar-line)' }}>
      <p className="font-scripture-ar maar-gold-shimmer text-3xl sm:text-4xl leading-[1.8] mb-2">
        {BISMILLAH_AR}
      </p>
      <p className="text-[13px] italic text-[var(--maar-muted)]">{BISMILLAH_EN}</p>
    </div>
  );
}
