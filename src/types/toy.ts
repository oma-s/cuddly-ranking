export type ToyStatKey = "strength" | "speed" | "smartness";

export type RankingCategory = ToyStatKey | "all";

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

export const TOY_STATS = [
  { key: "strength", label: "Stärke", emoji: "💥" },
  { key: "speed", label: "Geschwindigkeit", emoji: "⚡️" },
  { key: "smartness", label: "Smartness", emoji: "🧠" },
] as const;

export const RANKING_CATEGORIES = [
  ...TOY_STATS,
  { key: "all", label: "Insgesamt", emoji: "🏆" },
] as const;

export const getToyScore = (toy: Toy, category: RankingCategory) =>
  category === "all" ? toy.strength + toy.speed + toy.smartness : toy[category];

export const emptyToyDraft = (): ToyDraft => ({
  name: "",
  description: "",
  photoUri: undefined,
  strength: 5,
  speed: 5,
  smartness: 5,
});

export const clampStat = (value: number) => {
  if (Number.isNaN(value)) return 1;
  return Math.min(10, Math.max(1, Math.round(value)));
};
