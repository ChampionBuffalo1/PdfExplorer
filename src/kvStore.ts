import { MMKV } from 'react-native-mmkv';
import shortHash from 'shorthash2';

export const store = new MMKV();

const getKey = (name: string): string => shortHash(name);

export function updateFileCache(
  fileName: string,
  value: Record<string, unknown>,
): boolean {
  const key = getKey(fileName);
  if (store.contains(key)) {
    return false;
  }
  store.set(key, JSON.stringify(value));
  return true;
}

export function getFileFromCache(fileName: string): CachedFileData | undefined {
  const key = getKey(fileName);
  const value = store.getString(key);
  if (!value) {
    return;
  }
  return JSON.parse(value);
}

type FileStatus = 'COMPLETED' | 'NOT_STARTED' | 'ONGOING';
export interface CachedFileData {
  path: string;
  modifiedAt: Date;
  thumbnail: string;
  readPages: number;
  totalPages: number;
  status: FileStatus;
  isPasswordProtected: boolean;
}
