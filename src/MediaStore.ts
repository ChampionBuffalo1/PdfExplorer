import { NativeModules } from 'react-native';

const { MediaStore } = NativeModules;

interface MediaStoreInterface {
  getThumbnail(uri: string, callback: (thumbnail: string) => unknown): void;
}

export default MediaStore as MediaStoreInterface;
