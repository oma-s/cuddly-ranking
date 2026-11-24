import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import { toyPhotoStorage } from '@/src/storage/toyPhotos';
import { createToyStorage } from '@/src/storage/toyStorage';
import type { Toy, ToyDraft } from '@/src/types/toy';

type LoadStatus = 'loading' | 'ready' | 'error';

type ToysContextValue = {
  toys: Toy[];
  loadStatus: LoadStatus;
  reload: () => Promise<void>;
  saveToy: (draft: ToyDraft, id?: string) => Promise<Toy>;
  deleteToy: (id: string) => Promise<void>;
};

const ToysContext = createContext<ToysContextValue | undefined>(undefined);
const toyStorage = createToyStorage(AsyncStorage, toyPhotoStorage);

export function ToysProvider({ children }: PropsWithChildren) {
  const [toys, setToys] = useState<Toy[]>([]);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('loading');

  const load = useCallback(() => toyStorage.load().then(
    (stored) => {
      setToys(stored);
      setLoadStatus('ready');
    },
    (error) => {
      console.warn('Could not load toys', error);
      setLoadStatus('error');
    },
  ), []);

  const reload = useCallback(async () => {
    setLoadStatus('loading');
    await load();
  }, [load]);

  useEffect(() => {
    void load();
  }, [load]);

  const saveToy = useCallback(async (draft: ToyDraft, id?: string) => {
    const saved = await toyStorage.save(draft, id);
    setToys(saved.toys);
    return saved.toy;
  }, []);

  const deleteToy = useCallback(async (id: string) => {
    setToys(await toyStorage.remove(id));
  }, []);

  return (
    <ToysContext.Provider value={{ toys, loadStatus, reload, saveToy, deleteToy }}>
      {children}
    </ToysContext.Provider>
  );
}

export function useToysContext() {
  const context = useContext(ToysContext);
  if (!context) throw new Error('useToysContext must be used within a ToysProvider');
  return context;
}

export function useToyById(id?: string) {
  const { toys } = useToysContext();
  return toys.find((toy) => toy.id === id);
}
