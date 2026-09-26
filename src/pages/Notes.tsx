import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { Trash2 } from 'lucide-react';

export default function Notes() {
  const { t } = useTranslation();
  const notes = useLiveQuery(() => db.notes.orderBy('updatedAt').reverse().toArray(), []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('notes.title')}</h1>
      <p className="text-xs text-[var(--maar-muted)]">{t('notes.privacy')}</p>
      {notes?.length === 0 && <p className="text-sm text-[var(--maar-muted)]">{t('notes.empty')}</p>}
      <div className="space-y-3">
        {notes?.map((n) => (
          <div key={n.id} className="maar-card p-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-[var(--maar-gold)]">{n.reference}</p>
              <p className="text-sm text-[var(--maar-muted)] italic mt-1">"{n.text}"</p>
              <p className="text-sm mt-2 whitespace-pre-wrap">{n.noteBody}</p>
            </div>
            <button
              aria-label={t('notes.delete') ?? ''}
              onClick={() => db.notes.delete(n.id)}
              className="maar-focus shrink-0 rounded-full p-2 text-[var(--maar-muted)] hover:bg-[var(--maar-line)]"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
