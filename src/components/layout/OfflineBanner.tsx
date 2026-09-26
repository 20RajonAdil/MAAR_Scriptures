import { useTranslation } from 'react-i18next';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  const online = useOnlineStatus();
  const { t } = useTranslation();
  if (online) return null;
  return (
    <div className="flex items-center gap-2 justify-center bg-amber-100 text-amber-900 text-sm py-2 px-4">
      <WifiOff size={14} /> {t('offline.banner')}
    </div>
  );
}
