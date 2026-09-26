// MAAR Read — local storage layer, modeled directly on MAAR.Quran's
// namespaced `store` helper (localStorage, JSON-serialized, silently
// no-ops if storage is unavailable) so the save behavior matches what
// users already know from that app: everything below auto-saves as you
// type or tap, with no separate "Save" button, and never leaves the device.
const NS = 'mr_';

type Listener = () => void;
const listeners = new Set<Listener>();
function notify() {
  listeners.forEach((l) => l());
}

export const localStore = {
  getJSON<T>(key: string, fallback: T): T {
    try {
      const v = localStorage.getItem(NS + key);
      return v ? (JSON.parse(v) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  setJSON(key: string, value: unknown) {
    try {
      localStorage.setItem(NS + key, JSON.stringify(value));
      notify();
    } catch {
      // storage unavailable (private mode, quota, etc.) — fail silently,
      // same as the reference app.
    }
  },
  clear(keys: string[]) {
    try {
      keys.forEach((k) => localStorage.removeItem(NS + k));
      notify();
    } catch {}
  },
};

export function subscribeLocalStore(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
