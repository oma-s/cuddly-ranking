import AsyncStorage from '@react-native-async-storage/async-storage';

import { Toy } from '@/src/types/toy';

const STORAGE_KEY = 'cuddly-ranking::toys';

const SEED_TOYS: Toy[] = [
  {
    id: 'seed-bear',
    name: 'Teddy Thunder',
    description: 'Brown bear from grandma. Loyal bodyguard.',
    photoUri: undefined,
    strength: 7,
    speed: 4,
    smartness: 6,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'seed-bunny',
    name: 'Bunny Blaze',
    description: 'Fastest hopper in the crew.',
    photoUri: undefined,
    strength: 5,
    speed: 8,
    smartness: 5,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'seed-dragon',
    name: 'Lil Dragon',
    description: 'Sleeps all day but breathes fire at night.',
    photoUri: undefined,
    strength: 8,
    speed: 6,
    smartness: 3,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export const loadToys = async (): Promise<Toy[]> => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) {
      return SEED_TOYS;
    }
    const parsed = JSON.parse(json) as Toy[];
    if (!Array.isArray(parsed)) {
      return SEED_TOYS;
    }
    return parsed.map((toy) => ({
      ...toy,
      createdAt: toy.createdAt ?? Date.now(),
      updatedAt: toy.updatedAt ?? Date.now(),
    }));
  } catch (error) {
    console.warn('loadToys error', error);
    return SEED_TOYS;
  }
};

export const persistToys = async (toys: Toy[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toys));
  } catch (error) {
    console.warn('persistToys error', error);
    throw error;
  }
};
