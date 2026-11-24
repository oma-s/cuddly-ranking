import type { ToyPhotoStorage } from './toyStorage';

export const toyPhotoStorage: ToyPhotoStorage = {
  async save(uri) {
    if (!uri.startsWith('blob:')) return uri;

    const response = await fetch(uri);
    if (!response.ok) throw new Error('The selected photo is unavailable');

    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject(new Error('The selected photo could not be read'));
      };
      reader.onerror = () => reject(reader.error ?? new Error('The selected photo could not be read'));
      reader.readAsDataURL(blob);
    });
  },
  async migrate(uri) {
    return uri;
  },
  remove: () => {},
};

export const resolveToyPhotoUri = (uri?: string) => uri;
