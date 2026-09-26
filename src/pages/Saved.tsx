import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { getBookmarks, removeBookmark } from '../lib/bookmarksStore';
import { useLocalStoreVersion } from '../hooks/useLocalStoreVersion';

export default function Saved() {
  const { t } = useTranslation();
  useLocalStoreVersion();
  const bookmarks = [...getBookmarks()].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('saved.title')}</h1>
      {bookmarks.length === 0 && <p className="text-sm text-[var(--maar-muted)]">{t('saved.empty')}</p>}
      <div className="space-y-3">
        {bookmarks.map((b) => (
          <div key={`${b.scripture}:${b.reference}`} className="maar-card p-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-[var(--maar-gold)]">{b.reference}</p>
              {b.originalText && <p dir="auto" className="font-scripture-ar text-lg text-end mt-1">{b.originalText}</p>}
              <p className="text-sm mt-1">{b.text}</p>
            </div>
            <button
              aria-label={t('notes.delete') ?? ''}
              onClick={() => removeBookmark(b.scripture, b.reference)}
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
