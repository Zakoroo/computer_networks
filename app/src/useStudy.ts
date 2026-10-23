import { useCallback, useEffect, useRef, useState } from 'react';
import { createStore } from './storage';
import type { Catalogue, Profile } from './types';

export function useStudy() {
  const [catalogue, setCatalogue] = useState<Catalogue>();
  const [profile, setProfile] = useState<Profile>();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(0);
  const store = useRef<ReturnType<typeof createStore> | null>(null);
  const channel = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    let active = true;
    const currentStore = createStore();
    store.current = currentStore;
    const currentChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('network-study-updates') : null;
    channel.current = currentChannel;
    Promise.all([
      fetch('/content/catalogue.json').then(response => {
        if (!response.ok) throw new Error('The course catalogue is missing. Build the app content and reload.');
        return response.json() as Promise<Catalogue>;
      }), currentStore.read(),
    ]).then(([content, saved]) => {
      if (!active) return;
      if (content.schema_version !== 1) throw new Error('Unsupported course catalogue version.');
      setCatalogue(content); setProfile(saved);
    }).catch(reason => { if (active) setError(String(reason)); });
    if (currentChannel) currentChannel.onmessage = () => {
      currentStore.read().then(saved => { if (active) setProfile(saved); })
        .catch(reason => { if (active) setError(String(reason)); });
    };
    return () => { active = false; currentChannel?.close(); void currentStore.close(); };
  }, []);

  const update = useCallback(async (mutate: (current: Profile) => Profile): Promise<boolean> => {
    if (!store.current) return false;
    setSaving(count => count + 1);
    try {
      const next = await store.current.change(mutate);
      setProfile(next); setError(''); channel.current?.postMessage('changed');
      return true;
    } catch {
      setError('Your latest change could not be saved. Check available browser storage, then try again. Existing saved data was kept.');
      return false;
    } finally { setSaving(count => count - 1); }
  }, []);
  return { catalogue, profile, update, error, clearError: () => setError(''), saving: saving > 0 };
}
