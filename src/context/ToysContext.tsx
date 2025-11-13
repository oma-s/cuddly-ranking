import React, {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { loadToys, persistToys } from '@/src/storage/toyStorage';
import { RankingCategory, Toy, ToyDraft, ToyStatKey, clampStat } from '@/src/types/toy';

type ToysContextValue = {
  toys: Toy[];
  loading: boolean;
  addToy: (draft: ToyDraft) => Promise<Toy>;
  updateToy: (id: string, draft: ToyDraft) => Promise<Toy | undefined>;
  deleteToy: (id: string) => Promise<void>;
  getToy: (id: string) => Toy | undefined;
  getRanking: (category: RankingCategory, limit?: number) => Toy[];
};

const ToysContext = createContext<ToysContextValue | undefined>(undefined);

const buildToy = (draft: ToyDraft): Toy => {
  const timestamp = Date.now();
  return {
    id: `toy-${timestamp}-${Math.random().toString(36).slice(2, 7)}`,
    name: draft.name.trim(),
    description: draft.description?.trim(),
    photoUri: draft.photoUri,
    strength: clampStat(draft.strength),
    speed: clampStat(draft.speed),
    smartness: clampStat(draft.smartness),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

const getValueForCategory = (toy: Toy, category: RankingCategory) => {
  if (category === 'all') {
    return toy.strength + toy.speed + toy.smartness;
  }
  return toy[category];
};

export const ToysProvider = ({ children }: PropsWithChildren) => {
  const [toys, setToys] = useState<Toy[]>([]);
  const [loading, setLoading] = useState(true);
  const toysRef = useRef<Toy[]>([]);

  const setAndPersist = useCallback(async (next: Toy[]) => {
    toysRef.current = next;
    setToys(next);
    await persistToys(next);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const stored = await loadToys();
        if (!mounted) return;
        toysRef.current = stored;
        setToys(stored);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const addToy = useCallback(
    async (draft: ToyDraft) => {
      const toy = buildToy(draft);
      await setAndPersist([...toysRef.current, toy]);
      return toy;
    },
    [setAndPersist],
  );

  const updateToy = useCallback(
    async (id: string, draft: ToyDraft) => {
      const nextToys = toysRef.current.map((toy) =>
        toy.id === id
          ? {
              ...toy,
              name: draft.name.trim(),
              description: draft.description?.trim(),
              photoUri: draft.photoUri,
              strength: clampStat(draft.strength),
              speed: clampStat(draft.speed),
              smartness: clampStat(draft.smartness),
              updatedAt: Date.now(),
            }
          : toy,
      );
      const updatedToy = nextToys.find((toy) => toy.id === id);
      await setAndPersist(nextToys);
      return updatedToy;
    },
    [setAndPersist],
  );

  const deleteToy = useCallback(
    async (id: string) => {
      await setAndPersist(toysRef.current.filter((toy) => toy.id !== id));
    },
    [setAndPersist],
  );

  const getToy = useCallback(
    (id: string) => toysRef.current.find((toy) => toy.id === id),
    [],
  );

  const getRanking = useCallback(
    (category: RankingCategory, limit = 10) => {
      return [...toysRef.current]
        .sort((a, b) => {
          const diff = getValueForCategory(b, category) - getValueForCategory(a, category);
          if (diff !== 0) return diff;
          return a.name.localeCompare(b.name);
        })
        .slice(0, limit);
    },
    [],
  );

  const value: ToysContextValue = {
    toys,
    loading,
    addToy,
    updateToy,
    deleteToy,
    getToy,
    getRanking,
  };

  return <ToysContext.Provider value={value}>{children}</ToysContext.Provider>;
};

export const useToysContext = () => {
  const ctx = useContext(ToysContext);
  if (!ctx) {
    throw new Error('useToysContext must be used within a ToysProvider');
  }
  return ctx;
};

export const useToyById = (id?: string) => {
  const { toys } = useToysContext();
  if (!id) return undefined;
  return toys.find((toy) => toy.id === id);
};

export const toyStats: ToyStatKey[] = ['strength', 'speed', 'smartness'];
