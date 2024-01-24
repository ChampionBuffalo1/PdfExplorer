import { MMKV } from 'react-native-mmkv';
import shortHash from 'shorthash2';

export const store = new MMKV();

const THUMBNAIL_EXT = '.thumb';
const getKey = (name: string): string => shortHash(name);
const getThumbnailKey = (name: string): string => getKey(name) + THUMBNAIL_EXT;

export function saveThumbnail(fileName: string, b64thumbnail: string): void {
  store.set(getThumbnailKey(fileName), b64thumbnail);
}
export function getThumbnail(fileName: string): string | undefined {
  return store.getString(getThumbnailKey(fileName));
}
export function removeThumbnail(fileName: string): void {
  return store.delete(getThumbnailKey(fileName));
}
/**
 * Puts data in cache
 */
export function setFileCache(fileName: string, value: CachedFileData): void {
  const key = getKey(fileName);
  store.set(key, JSON.stringify(value));
}

/**
 * Retrives data from cache
 */
export function getFileFromCache(fileName: string): CachedFileData | undefined {
  const key = getKey(fileName);
  const value = store.getString(key);
  if (!value) {
    return;
  }
  return JSON.parse(value);
}

/**
 * Removes the file from the cache
 */
export function removeFileFromCache(fileName: string): boolean {
  const key = getKey(fileName);
  if (!store.contains(key)) {
    return false;
  }
  store.delete(key);
  return true;
}
// Accessed using `getFileType` fn
export type FileStatus = 'COMPLETED' | 'NOT_STARTED' | 'ONGOING';
export interface CachedFileData {
  totalPages: number;
  currentPage: number;
  isPasswordProtected?: boolean;
}
