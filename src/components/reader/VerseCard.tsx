import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bookmark, BookmarkCheck, NotebookPen, Copy, Check, Play, Pause, Info, Save } from 'lucide-react';
import type { Passage } from '../../types/scripture';
import { toggleBookmark, isBookmarked } from '../../lib/bookmarksStore';
import { getNote, setNote } from '../../lib/notesStore';

const SCRIPTURE_COLOR: Record<string, string> = {
  quran: 'var(--maar-quran)',
  bible: 'var(--maar-bible)',
  torah: 'var(--maar-torah)',
};

export function VerseCard({ passage }: { passage: Passage }) {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(() => isBookmarked(passage.scripture, passage.reference));
  const [copied, setCopied] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState(() => getNote(passage.scripture, passage.reference));
  const [playing, setPlaying] = useState(false);
  const [audio] = useState(() => (passage.audioUrl ? new Audio(passage.audioUrl) : null));
  const [showSource, setShowSource] = useState(false);

  function toggleSave() {
    const nowSaved = toggleBookmark({
      scripture: passage.scripture,
      reference: passage.reference,
      text: passage.text,
      originalText: passage.originalText,
    });
    setSaved(nowSaved);
  }

  // Auto-saves on every keystroke, straight to this device's storage —
  // same behavior as MAAR.Quran's reflection notes. No save button.
  function onNoteInput(value: string) {
    setNoteText(value);
    setNote({
      scripture: passage.scripture,
      reference: passage.reference,
      text: passage.text,
      originalText: passage.originalText,
      noteBody: value,
    });
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
        <button onClick={() => setNoteOpen((v) => !v)} className={`maar-focus flex items-center gap-1 rounded-full px-2.5 py-1 text-xs hover:bg-[var(--maar-line)] ${noteText.trim() ? 'font-medium' : ''}`}>
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
          <label className="text-xs text-[var(--maar-muted)] mb-1 block">{t('notes.title')}</label>
          <textarea
            value={noteText}
            onChange={(e) => onNoteInput(e.target.value)}
            placeholder={t('notes.placeholder') ?? ''}
            rows={3}
            autoFocus
            className="maar-card maar-focus w-full rounded-lg p-2 text-sm"
          />
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="flex items-center gap-1 text-[11px] text-[var(--maar-muted)]">
              <Save size={11} /> {noteText.trim() ? t('notes.saved') : t('notes.emptyHint')}
            </p>
          </div>
          <p className="mt-1 text-[11px] text-[var(--maar-muted)]">{t('notes.privacy')}</p>
        </div>
      )}
    </div>
  );
}
