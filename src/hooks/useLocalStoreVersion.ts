import { useEffect, useState } from 'react';
import { subscribeLocalStore } from '../lib/localStore';

// Bumps a counter whenever any local-store write happens, so components
// reading notes/bookmarks re-render without needing a database subscription.
export function useLocalStoreVersion() {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const unsubscribe = subscribeLocalStore(() => setVersion((v) => v + 1));
    return unsubscribe;
  }, []);
  return version;
}
