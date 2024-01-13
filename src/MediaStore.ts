import { NativeModules } from 'react-native';

const { MediaStore } = NativeModules;

interface MediaStoreInterface {
  getThumbnail(path: string): Promise<string>;
  getThumbnailWithOptions(path: string, quality: number, width: number, height: number): Promise<string>;
}

export default MediaStore as MediaStoreInterface;
