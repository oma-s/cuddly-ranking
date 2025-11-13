export type ToyStatKey = 'strength' | 'speed' | 'smartness';

export type RankingCategory = ToyStatKey | 'all';

export interface Toy {
  id: string;
  name: string;
  description?: string;
  photoUri?: string;
  strength: number; // 1-10
  speed: number; // 1-10
  smartness: number; // 1-10
  createdAt: number;
  updatedAt: number;
}

export interface ToyDraft {
  name: string;
  description?: string;
  photoUri?: string;
  strength: number;
  speed: number;
  smartness: number;
}

export const RANKING_CATEGORIES: { key: RankingCategory; label: string; emoji: string }[] = [
  { key: 'strength', label: 'Strength', emoji: '💥' },
  { key: 'speed', label: 'Speed', emoji: '⚡️' },
  { key: 'smartness', label: 'Smartness', emoji: '🧠' },
  { key: 'all', label: 'All Points', emoji: '🏆' },
];

export const emptyToyDraft = (): ToyDraft => ({
  name: '',
  description: '',
  photoUri: undefined,
  strength: 5,
  speed: 5,
  smartness: 5,
});

export const clampStat = (value: number) => {
  if (Number.isNaN(value)) return 1;
  return Math.min(10, Math.max(1, Math.round(value)));
};
