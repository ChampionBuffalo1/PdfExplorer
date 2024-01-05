import { NativeModules } from 'react-native';

const { MediaStore } = NativeModules;

export interface FileInfo {
    name: string;
    uri: string;
    // TODO: Add api support
    size: number // File size in KB / MB
}

interface MediaStoreInterface {
  getPdfFiles(callback: (files: FileInfo[]) => unknown): void;
  getThumbnail(uri: string, callback: (thumbnail: string) => unknown): void;
}

export default MediaStore as MediaStoreInterface;
