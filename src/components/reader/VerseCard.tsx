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

export function VerseCard({ passage, verseLabel }: { passage: Passage; verseLabel?: string | number }) {
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
    <div className="group py-5 border-t first:border-t-0" style={{ borderColor: 'var(--maar-line-soft)' }}>
      <div className="flex items-start gap-4">
        <span
          className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-medium"
          style={{ border: `1px solid ${color}`, color }}
        >
          {verseLabel ?? passage.verseStart}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-xs font-medium" style={{ color }}>{passage.reference}</span>
            <span className="text-[11px] text-[var(--maar-muted)]">{passage.translation}</span>
          </div>

          {passage.originalText && (
            <p dir="auto" className="font-scripture-ar text-xl sm:text-2xl leading-loose mt-3 mb-2 text-end">
              {passage.originalText}
            </p>
          )}
          <p className="text-[15px] sm:text-base leading-relaxed mt-1">{passage.text}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-[var(--maar-muted)] opacity-80 group-hover:opacity-100 transition-opacity">
            {passage.audioUrl ? (
              <button onClick={toggleAudio} className="maar-focus flex items-center gap-1 text-xs hover:text-[var(--maar-ink)]">
                {playing ? <Pause size={13} /> : <Play size={13} />} {playing ? t('reader.pause') : t('reader.playAudio')}
              </button>
            ) : null}
            <button onClick={toggleSave} className="maar-focus flex items-center gap-1 text-xs hover:text-[var(--maar-ink)]">
              {saved ? <BookmarkCheck size={13} style={{ color: 'var(--maar-gold)' }} /> : <Bookmark size={13} />} {saved ? t('reader.bookmarked') : t('reader.bookmark')}
            </button>
            <button onClick={() => setNoteOpen((v) => !v)} className="maar-focus flex items-center gap-1 text-xs hover:text-[var(--maar-ink)]">
              <NotebookPen size={13} style={noteText.trim() ? { color: 'var(--maar-gold)' } : undefined} /> {t('reader.addNote')}
            </button>
            <button onClick={copyText} className="maar-focus flex items-center gap-1 text-xs hover:text-[var(--maar-ink)]">
              {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? t('reader.copied') : t('reader.copy')}
            </button>
            <button onClick={() => setShowSource((v) => !v)} className="maar-focus flex items-center gap-1 text-xs hover:text-[var(--maar-ink)]">
              <Info size={13} /> {t('reader.source')}
            </button>
          </div>

          {showSource && (
            <p className="mt-2 text-[11px] text-[var(--maar-muted)]">
              {passage.source}{passage.license ? ` — ${passage.license}` : ''}
            </p>
          )}

          {noteOpen && (
            <div className="mt-3 rounded-[var(--maar-radius-sm)] border p-3" style={{ borderColor: 'var(--maar-line)' }}>
              <textarea
                value={noteText}
                onChange={(e) => onNoteInput(e.target.value)}
                placeholder={t('notes.placeholder') ?? ''}
                rows={3}
                autoFocus
                className="maar-focus w-full bg-transparent text-sm outline-none resize-none"
              />
              <div className="mt-2 flex items-center justify-between gap-2 pt-2 border-t" style={{ borderColor: 'var(--maar-line-soft)' }}>
                <p className="flex items-center gap-1 text-[11px] text-[var(--maar-muted)]">
                  <Save size={11} /> {noteText.trim() ? t('notes.saved') : t('notes.emptyHint')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
