import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { getAllNotes, deleteNote } from '../lib/notesStore';
import { useLocalStoreVersion } from '../hooks/useLocalStoreVersion';

export default function Notes() {
  const { t } = useTranslation();
  useLocalStoreVersion();
  const notes = Object.values(getAllNotes()).sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-display text-3xl">{t('notes.title')}</h1>
      <p className="text-xs text-[var(--maar-muted)]">{t('notes.privacy')}</p>
      {notes.length === 0 && <p className="text-sm text-[var(--maar-muted)]">{t('notes.empty')}</p>}
      <div>
        {notes.map((n) => (
          <div key={`${n.scripture}:${n.reference}`} className="py-4 border-t first:border-t-0 flex items-start justify-between gap-3" style={{ borderColor: 'var(--maar-line-soft)' }}>
            <div>
              <p className="text-xs font-medium text-[var(--maar-gold)]">{n.reference}</p>
              <p className="text-sm text-[var(--maar-muted)] italic mt-1">"{n.text}"</p>
              <p className="text-sm mt-2 whitespace-pre-wrap">{n.noteBody}</p>
            </div>
            <button
              aria-label={t('notes.delete') ?? ''}
              onClick={() => deleteNote(n.scripture, n.reference)}
              className="maar-focus shrink-0 rounded-full p-2 text-[var(--maar-muted)] hover:text-[var(--maar-ink)]"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
