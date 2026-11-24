import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createToyStorage } from '../src/storage/toyStorage.ts';

const draft = { name: 'Teddy', strength: 7, speed: 4, smartness: 6 };
const existingToy = { ...draft, id: 'existing', name: 'Vorhandenes Tier' };

function fixture(json) {
  const disk = { json, readError: null, writeError: null };
  const storage = {
    async getItem() {
      if (disk.readError) throw disk.readError;
      return disk.json;
    },
    async setItem(_key, value) {
      if (disk.writeError) throw disk.writeError;
      disk.json = value;
    },
  };

  const files = new Set();
  let nextPhoto = 0;
  const photos = {
    async save() {
      const uri = `toy-photo:${++nextPhoto}.jpg`;
      files.add(uri);
      return uri;
    },
    async migrate(uri) {
      return uri.startsWith('file:///cache/') ? photos.save(uri) : uri;
    },
    remove(uri) {
      files.delete(uri);
    },
  };

  return { store: createToyStorage(storage, photos), storage, photos, disk, files };
}

test('seeds a fresh collection once and keeps an intentionally empty collection', async () => {
  const { store, storage, photos, disk } = fixture(null);
  const initial = await store.load();
  assert.equal(initial.length, 3);
  assert.deepEqual(JSON.parse(disk.json), JSON.parse(JSON.stringify(initial)));

  for (const toy of initial) await store.remove(toy.id);
  assert.deepEqual(await createToyStorage(storage, photos).load(), []);
});

test('blocks writes after a read failure and restores the stored collection on retry', async () => {
  const original = JSON.stringify([existingToy]);
  const { store, disk } = fixture(original);
  disk.readError = new Error('Read failed');

  await assert.rejects(store.load(), /Read failed/);
  await assert.rejects(store.save(draft), /has not loaded/);
  assert.equal(disk.json, original);

  disk.readError = null;
  const [recovered] = await store.load();
  assert.equal(recovered.id, existingToy.id);
  assert.equal(typeof recovered.createdAt, 'number');
  assert.equal(recovered.updatedAt, recovered.createdAt);
});

test('preserves unreadable saved values instead of treating them as a fresh install', async () => {
  for (const invalid of ['', '{', '{}', '[null]']) {
    const { store, disk } = fixture(invalid);
    await assert.rejects(store.load());
    await assert.rejects(store.save(draft), /has not loaded/);
    assert.equal(disk.json, invalid);
  }
});

test('a failed write rolls back the new photo and a retry creates only one toy', async () => {
  const { store, disk, files } = fixture('[]');
  await store.load();
  disk.writeError = new Error('Write failed');

  const withPhoto = { ...draft, photoUri: 'file:///cache/teddy.jpg' };
  await assert.rejects(store.save(withPhoto), /Write failed/);
  assert.equal(disk.json, '[]');
  assert.equal(files.size, 0);

  disk.writeError = null;
  const saved = await store.save(withPhoto);
  assert.deepEqual(saved.toys, [saved.toy]);
  assert.ok(files.has(saved.toy.photoUri));
});

test('waits for the photo copy before writing the collection', async () => {
  const { store, disk, photos } = fixture('[]');
  await store.load();

  const started = Promise.withResolvers();
  const finishCopy = Promise.withResolvers();
  const savePhoto = photos.save;
  photos.save = async (uri) => {
    started.resolve();
    await finishCopy.promise;
    return savePhoto(uri);
  };

  const saving = store.save({ ...draft, photoUri: 'file:///cache/teddy.jpg' });
  await started.promise;
  assert.equal(disk.json, '[]');

  finishCopy.resolve();
  const { toy } = await saving;
  assert.equal(JSON.parse(disk.json)[0].photoUri, toy.photoUri);
});

test('serializes mutations and rejects edits for a missing toy', async () => {
  const { store, disk } = fixture('[]');
  await store.load();

  const [first, second] = await Promise.all([
    store.save(draft),
    store.save({ ...draft, name: 'Hase' }),
  ]);
  assert.deepEqual(JSON.parse(disk.json).map((toy) => toy.id), [first.toy.id, second.toy.id]);

  await store.remove(first.toy.id);
  await assert.rejects(store.save(draft, first.toy.id), /no longer exists/);
  assert.deepEqual(JSON.parse(disk.json).map((toy) => toy.id), [second.toy.id]);
});

test('migrates cached photos and removes them only after a successful replacement or deletion', async () => {
  const legacyToy = { ...existingToy, photoUri: 'file:///cache/previous.jpg' };
  const { store, disk, files } = fixture(JSON.stringify([legacyToy]));
  const [migrated] = await store.load();
  assert.ok(files.has(migrated.photoUri));
  assert.equal(JSON.parse(disk.json)[0].photoUri, migrated.photoUri);

  const replacement = { ...draft, photoUri: 'file:///cache/replacement.jpg' };
  disk.writeError = new Error('Write failed');
  await assert.rejects(store.save(replacement, migrated.id), /Write failed/);
  assert.deepEqual([...files], [migrated.photoUri]);

  disk.writeError = null;
  const saved = await store.save(replacement, migrated.id);
  assert.deepEqual([...files], [saved.toy.photoUri]);
  assert.equal(saved.toy.createdAt, migrated.createdAt);

  disk.writeError = new Error('Write failed');
  await assert.rejects(store.remove(migrated.id), /Write failed/);
  assert.deepEqual([...files], [saved.toy.photoUri]);

  disk.writeError = null;
  await store.remove(migrated.id);
  assert.equal(files.size, 0);
  assert.deepEqual(JSON.parse(disk.json), []);
});

test('retains the original photo reference when the migration cannot be persisted', async (context) => {
  context.mock.method(console, 'warn', () => {});
  const legacyToy = { ...existingToy, photoUri: 'file:///cache/previous.jpg' };
  const original = JSON.stringify([legacyToy]);
  const { store, disk, files } = fixture(original);
  disk.writeError = new Error('Write failed');

  const [loaded] = await store.load();
  assert.equal(loaded.photoUri, legacyToy.photoUri);
  assert.equal(disk.json, original);
  assert.equal(files.size, 0);
});
