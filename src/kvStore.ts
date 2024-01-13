import { MMKV } from 'react-native-mmkv';
import shortHash from 'shorthash2';

export const store = new MMKV();

const getKey = (name: string): string => shortHash(name);

/**
 * Puts data in cache
 */
export function setFileCache(fileName: string, value: CachedFileData): boolean {
  const key = getKey(fileName);
  if (store.contains(key)) {
    return false;
  }
  store.set(key, JSON.stringify(value));
  return true;
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
  return store.contains(key);
}

type FileStatus = 'COMPLETED' | 'NOT_STARTED' | 'ONGOING';
export interface CachedFileData {
  path: string;
  modifiedAt?: Date;
  thumbnail: string;
  totalPages: number;
  currentPage: number;
  status: FileStatus;
  isPasswordProtected?: boolean;
}
