import { FileInfo, getFileType } from '../utils';
import MediaStore from '../MediaStore';
import { useEffect, useState } from 'react';
import StatusMessage from './StatusMessage';
import { useNavigation } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import {
  getThumbnail,
  saveThumbnail,
  CachedFileData,
  getFileFromCache,
} from '../kvStore';

type InfoCardProps = FileInfo & {
  isVisible: boolean;
};

export default function PdfInfoCard({ name, path, isVisible }: InfoCardProps) {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState<string>('');
  const [fileData, setFileData] = useState<CachedFileData | undefined>(
    undefined,
  );

  useEffect(() => {
    if (isVisible && name) {
      setFileData(getFileFromCache(name));
      const thumbnail = getThumbnail(name);
      if (thumbnail) {
        setImageUri(thumbnail);
      } else {
        MediaStore.getThumbnailWithOptions(path, 60, 360, 480)
          .then(base64Image => {
            const newThumbnail = `data:image/jpeg;base64,${base64Image}`;
            setImageUri(newThumbnail);
            if (base64Image) {
              saveThumbnail(name, newThumbnail);
            }
          })
          .catch(console.error);
      }
    }
  }, [name, path, isVisible]);

  return (
    <TouchableOpacity
      className="h-20 mt-2"
      onPress={() => {
        // @ts-expect-error: Not Typed function
        navigation.navigate('PdfView', { path, name });
      }}>
      <View className="flex items-center flex-row h-full">
        <View className="items-center justify-center">
          {imageUri && (
            <Image
              source={{
                uri: imageUri,
              }}
              style={styles.thumbnailImage}
            />
          )}
        </View>

        <View className="left-1 flex justify-center">
          <Text
            className="text-sm text-white whitespace-nowrap"
            lineBreakMode="tail">
            {name}
          </Text>
          <StatusMessage
            type={getFileType(fileData)}
            page={fileData?.currentPage}
            totalPages={fileData?.totalPages}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  thumbnailImage: {
    resizeMode: 'contain',
    aspectRatio: 1,
    width: '100%',
    height: '100%',
  },
});
