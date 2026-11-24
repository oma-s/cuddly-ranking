import { Directory, File, Paths } from 'expo-file-system';

import type { ToyPhotoStorage } from './toyStorage';

const photoPrefix = 'toy-photo:';
const managedName = /^[a-z\d-]+\.[a-z\d]+$/i;
const photoDirectory = () => new Directory(Paths.document, 'toy-photos');

function managedFile(uri: string) {
  if (!uri.startsWith(photoPrefix)) return;
  const name = uri.slice(photoPrefix.length);
  if (managedName.test(name)) return new File(photoDirectory(), name);
}

function localPhotoFile(uri: string) {
  const file = new File(uri);
  if (file.exists) return file;

  // An iOS update can change the absolute path of the app container.
  const previousPickerPhoto = /\/Library\/Caches\/ImagePicker\/([a-z\d_-]+\.[a-z\d]+)$/i.exec(uri);
  if (previousPickerPhoto) {
    const relocated = new File(Paths.cache, 'ImagePicker', previousPickerPhoto[1]);
    if (relocated.exists) return relocated;
  }
}

async function savePhoto(uri: string) {
  if (uri.startsWith(photoPrefix)) return uri;

  const source = new File(uri);
  const extension = /^\.[a-z\d]+$/i.test(source.extension) ? source.extension : '.jpg';
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extension}`;
  const directory = photoDirectory();
  directory.create({ intermediates: true, idempotent: true });
  const destination = new File(directory, name);

  try {
    await source.copy(destination);
  } catch (error) {
    try {
      if (destination.exists) destination.delete();
    } catch (cleanupError) {
      console.warn('Could not remove incomplete toy photo', cleanupError);
    }
    throw error;
  }

  return `${photoPrefix}${name}`;
}

export const toyPhotoStorage: ToyPhotoStorage = {
  save: savePhoto,
  async migrate(uri) {
    if (!uri.startsWith('file://') || !/\/cache(?:s)?\//i.test(uri)) return uri;

    try {
      const file = localPhotoFile(uri);
      if (file) return await savePhoto(file.uri);
    } catch (error) {
      console.warn('Could not migrate toy photo', error);
    }
    return uri;
  },
  remove(uri) {
    const file = managedFile(uri);
    if (file?.exists) file.delete();
  },
};

export function resolveToyPhotoUri(uri?: string) {
  if (!uri) return;
  if (!uri.startsWith(photoPrefix) && !uri.startsWith('file://')) return uri;

  try {
    const file = uri.startsWith(photoPrefix) ? managedFile(uri) : localPhotoFile(uri);
    if (file?.exists) return file.uri;
  } catch {
    return;
  }
}
