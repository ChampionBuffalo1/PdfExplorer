import RNFS from 'react-native-fs';
import { BackHandler } from 'react-native';
import { check, request, RESULTS, Permission } from 'react-native-permissions';

export function requestPermission(permissions: Permission[]) {
  for (const permission of permissions) {
    check(permission).then(result => {
      switch (result) {
        case RESULTS.BLOCKED:
        case RESULTS.UNAVAILABLE: {
          setTimeout(() => BackHandler.exitApp(), 1000);
          break;
        }
        case RESULTS.DENIED: {
          request(permission).then(res => {
            if (res !== RESULTS.GRANTED) {
              setTimeout(() => BackHandler.exitApp(), 1000);
            }
          });
          break;
        }
      }
    });
  }
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
