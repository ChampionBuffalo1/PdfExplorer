import RNFS from 'react-native-fs';
import { CachedFileData, FileStatus } from './kvStore';
import { Permission, BackHandler, PermissionsAndroid } from 'react-native';

export async function requestPermission(permissions: Permission[]) {
  const missingPermissions: Permission[] = [];

  for (const permission of permissions) {
    const hasPermission = await PermissionsAndroid.check(permission);
    if (!hasPermission) {
      missingPermissions.push(permission);
    }
  }

  PermissionsAndroid.requestMultiple(missingPermissions).then(perms => {
    for (const [perm, permStatus] of Object.entries(perms)) {
      if (missingPermissions.includes(perm as Permission)) {
        if (permStatus !== 'granted') {
          setTimeout(() => BackHandler.exitApp(), 1000);
          break;
        }
      }
    }
  });
}

export interface FileInfo {
  name: string;
  path: string;
  size: number;
  mtime?: Date;
  ctime?: Date;
}

export async function getPdfFiles(path = ''): Promise<FileInfo[]> {
  const result = await RNFS.readDir(path || RNFS.DownloadDirectoryPath);
  let files: FileInfo[] = [];
  for (const fileDir of result) {
    if (fileDir.isFile() && fileDir.name.endsWith('.pdf')) {
      files.push({
        name: fileDir.name,
        ctime: fileDir.ctime,
        path: fileDir.path,
        size: fileDir.size,
        mtime: fileDir.mtime,
      });
    } else if (fileDir.isDirectory()) {
      const dirFiles = await getPdfFiles(fileDir.path);
      files.push(...dirFiles);
    }
  }
  return files;
}

export function getFileType(cache?: CachedFileData): FileStatus {
  if (!cache) {
    return 'NOT_STARTED';
  }
  if (cache.currentPage === cache.totalPages) {
    return 'COMPLETED';
  }
  return 'ONGOING';
}
