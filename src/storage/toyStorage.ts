import { clampStat, type Toy, type ToyDraft } from '../types/toy';

const STORAGE_KEY = 'cuddly-ranking::toys';

const SEED_TOYS: Omit<Toy, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'seed-bear',
    name: 'Teddy Thunder',
    description: 'Brown bear from grandma. Loyal bodyguard.',
    photoUri: undefined,
    strength: 7,
    speed: 4,
    smartness: 6,
  },
  {
    id: 'seed-bunny',
    name: 'Bunny Blaze',
    description: 'Fastest hopper in the crew.',
    photoUri: undefined,
    strength: 5,
    speed: 8,
    smartness: 5,
  },
  {
    id: 'seed-dragon',
    name: 'Lil Dragon',
    description: 'Sleeps all day but breathes fire at night.',
    photoUri: undefined,
    strength: 8,
    speed: 6,
    smartness: 3,
  },
];

type KeyValueStorage = {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
};

export type ToyPhotoStorage = {
  save(uri: string): Promise<string>;
  migrate(uri: string): Promise<string>;
  remove(uri: string): void;
};

function parseToys(json: string): Toy[] {
  const parsed: unknown = JSON.parse(json);
  if (!Array.isArray(parsed)) {
    throw new Error('Expected a saved toy collection');
  }

  const timestamp = Date.now();
  return parsed.map((entry: unknown) => {
    if (typeof entry !== 'object' || entry === null) {
      throw new Error('Invalid saved toy');
    }

    const toy = entry as Partial<Toy>;
    const { id, name, strength, speed, smartness, description, photoUri } = toy;
    if (
      typeof id !== 'string' || typeof name !== 'string' ||
      typeof strength !== 'number' || !Number.isFinite(strength) ||
      typeof speed !== 'number' || !Number.isFinite(speed) ||
      typeof smartness !== 'number' || !Number.isFinite(smartness) ||
      (description != null && typeof description !== 'string') ||
      (photoUri != null && typeof photoUri !== 'string')
    ) {
      throw new Error('Invalid saved toy');
    }

    const createdAt = typeof toy.createdAt === 'number' && Number.isFinite(toy.createdAt) ? toy.createdAt : timestamp;
    return {
      ...toy,
      id,
      name,
      strength,
      speed,
      smartness,
      description: description ?? undefined,
      photoUri: photoUri ?? undefined,
      createdAt,
      updatedAt: typeof toy.updatedAt === 'number' && Number.isFinite(toy.updatedAt) ? toy.updatedAt : createdAt,
    };
  });
}

export function createToyStorage(storage: KeyValueStorage, photos: ToyPhotoStorage) {
  let savedToys: Toy[] | undefined;
  let pending = Promise.resolve();

  function enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const result = pending.then(operation);
    pending = result.then(() => {}, () => {});
    return result;
  }

  function requireToys() {
    if (!savedToys) throw new Error('The toy collection has not loaded');
    return savedToys;
  }

  async function writeToys(next: Toy[]) {
    await storage.setItem(STORAGE_KEY, JSON.stringify(next));
    savedToys = next;
    return next;
  }

  function removePhoto(uri: string | undefined, toys: Toy[]) {
    if (uri && !toys.some((toy) => toy.photoUri === uri)) {
      try {
        photos.remove(uri);
      } catch (error) {
        console.warn('Could not remove unused toy photo', error);
      }
    }
  }

  function load() {
    return enqueue(async () => {
      savedToys = undefined;
      const json = await storage.getItem(STORAGE_KEY);
      if (json === null) {
        const timestamp = Date.now();
        return writeToys(SEED_TOYS.map((toy) => ({ ...toy, createdAt: timestamp, updatedAt: timestamp })));
      }

      const stored = parseToys(json);
      const migratedPhotos: string[] = [];
      const migrated: Toy[] = [];
      for (const toy of stored) {
        const photoUri = toy.photoUri ? await photos.migrate(toy.photoUri) : toy.photoUri;
        if (photoUri && photoUri !== toy.photoUri) migratedPhotos.push(photoUri);
        migrated.push({ ...toy, photoUri });
      }

      if (migratedPhotos.length > 0) {
        try {
          return await writeToys(migrated);
        } catch (error) {
          migratedPhotos.forEach((uri) => removePhoto(uri, stored));
          console.warn('Could not save migrated toy photos', error);
        }
      }

      savedToys = stored;
      return stored;
    });
  }

  function save(draft: ToyDraft, id?: string) {
    return enqueue(async () => {
      const current = requireToys();
      const previous = id === undefined ? undefined : current.find((toy) => toy.id === id);
      if (id !== undefined && !previous) throw new Error('Toy no longer exists');

      const timestamp = Date.now();
      const photoUri = draft.photoUri && draft.photoUri !== previous?.photoUri
        ? await photos.save(draft.photoUri)
        : draft.photoUri;
      const toy: Toy = {
        id: previous?.id ?? `toy-${timestamp}-${Math.random().toString(36).slice(2, 9)}`,
        name: draft.name.trim(),
        description: draft.description?.trim(),
        photoUri,
        strength: clampStat(draft.strength),
        speed: clampStat(draft.speed),
        smartness: clampStat(draft.smartness),
        createdAt: previous?.createdAt ?? timestamp,
        updatedAt: timestamp,
      };
      const next = previous ? current.map((entry) => entry.id === toy.id ? toy : entry) : [...current, toy];

      try {
        await writeToys(next);
      } catch (error) {
        if (photoUri !== draft.photoUri) removePhoto(photoUri, current);
        throw error;
      }

      removePhoto(previous?.photoUri, next);
      return { toy, toys: next };
    });
  }

  function remove(id: string) {
    return enqueue(async () => {
      const current = requireToys();
      const toy = current.find((entry) => entry.id === id);
      if (!toy) return current;

      const next = await writeToys(current.filter((entry) => entry.id !== id));
      removePhoto(toy.photoUri, next);
      return next;
    });
  }

  return { load, save, remove };
}
