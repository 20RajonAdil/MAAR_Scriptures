import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bookmark, BookmarkCheck, NotebookPen, Copy, Check, Play, Pause, Info } from 'lucide-react';
import type { Passage } from '../../types/scripture';
import { db, newId } from '../../lib/db';

const SCRIPTURE_COLOR: Record<string, string> = {
  quran: 'var(--maar-quran)',
  bible: 'var(--maar-bible)',
  torah: 'var(--maar-torah)',
};

export function VerseCard({ passage }: { passage: Passage }) {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [playing, setPlaying] = useState(false);
  const [audio] = useState(() => (passage.audioUrl ? new Audio(passage.audioUrl) : null));
  const [showSource, setShowSource] = useState(false);

  async function toggleSave() {
    if (saved) return;
    await db.bookmarks.add({
      id: newId(),
      scripture: passage.scripture,
      reference: passage.reference,
      text: passage.text,
      originalText: passage.originalText,
      createdAt: Date.now(),
    });
    setSaved(true);
  }

  async function saveNote() {
    if (!noteText.trim()) return;
    const now = Date.now();
    await db.notes.add({
      id: newId(),
      scripture: passage.scripture,
      reference: passage.reference,
      text: passage.text,
      originalText: passage.originalText,
      noteBody: noteText.trim(),
      createdAt: now,
      updatedAt: now,
    });
    setNoteText('');
    setNoteOpen(false);
  }

  function copyText() {
    navigator.clipboard.writeText(`"${passage.text}" — ${passage.reference} (${passage.translation})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function toggleAudio() {
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
      audio.onended = () => setPlaying(false);
    }
  }

  const color = SCRIPTURE_COLOR[passage.scripture];

  return (
    <div className="maar-card p-4 sm:p-5" style={{ borderInlineStartWidth: 4, borderInlineStartColor: color }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium tracking-wide" style={{ color }}>{passage.reference}</span>
        <span className="text-[11px] text-[var(--maar-muted)]">{passage.translation}</span>
      </div>

      {passage.originalText && (
        <p dir="auto" className="font-scripture-ar text-xl sm:text-2xl leading-loose mb-3 text-end">
          {passage.originalText}
        </p>
      )}
      <p className="text-[15px] sm:text-base leading-relaxed">{passage.text}</p>

      <div className="mt-3 flex flex-wrap items-center gap-1 text-[var(--maar-muted)]">
        {passage.audioUrl ? (
          <button onClick={toggleAudio} className="maar-focus flex items-center gap-1 rounded-full px-2.5 py-1 text-xs hover:bg-[var(--maar-line)]">
            {playing ? <Pause size={13} /> : <Play size={13} />} {playing ? t('reader.pause') : t('reader.playAudio')}
          </button>
        ) : null}
        <button onClick={toggleSave} className="maar-focus flex items-center gap-1 rounded-full px-2.5 py-1 text-xs hover:bg-[var(--maar-line)]">
          {saved ? <BookmarkCheck size={13} /> : <Bookmark size={13} />} {saved ? t('reader.bookmarked') : t('reader.bookmark')}
        </button>
        <button onClick={() => setNoteOpen((v) => !v)} className="maar-focus flex items-center gap-1 rounded-full px-2.5 py-1 text-xs hover:bg-[var(--maar-line)]">
          <NotebookPen size={13} /> {t('reader.addNote')}
        </button>
        <button onClick={copyText} className="maar-focus flex items-center gap-1 rounded-full px-2.5 py-1 text-xs hover:bg-[var(--maar-line)]">
          {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? t('reader.copied') : t('reader.copy')}
        </button>
        <button onClick={() => setShowSource((v) => !v)} className="maar-focus flex items-center gap-1 rounded-full px-2.5 py-1 text-xs hover:bg-[var(--maar-line)]">
          <Info size={13} /> {t('reader.source')}
        </button>
      </div>

      {showSource && (
        <p className="mt-2 text-[11px] text-[var(--maar-muted)] border-t pt-2" style={{ borderColor: 'var(--maar-line)' }}>
          {t('reader.source')}: {passage.source}{passage.license ? ` — ${passage.license}` : ''}
        </p>
      )}

      {noteOpen && (
        <div className="mt-3 border-t pt-3" style={{ borderColor: 'var(--maar-line)' }}>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder={t('notes.placeholder') ?? ''}
            rows={3}
            className="maar-card maar-focus w-full rounded-lg p-2 text-sm"
          />
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-[11px] text-[var(--maar-muted)]">{t('notes.privacy')}</p>
            <button onClick={saveNote} className="maar-focus rounded-full px-3 py-1.5 text-xs text-white shrink-0" style={{ background: 'var(--maar-ink)' }}>
              {t('notes.save')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
