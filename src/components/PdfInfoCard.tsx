import { FileInfo } from '../utils';
import MediaStore from '../MediaStore';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getThumbnail, saveThumbnail } from '../kvStore';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

type InfoCardProps = FileInfo & {
  isVisible: boolean;
};

export default function PdfInfoCard({ name, path, isVisible }: InfoCardProps) {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState<string>('');

  useEffect(() => {
    if (isVisible && name) {
      const thumbnail = getThumbnail(name);
      if (thumbnail) {
        setImageUri(thumbnail);
      } else {
        MediaStore.getThumbnailWithOptions(path, 60, 360, 480)
          .then(base64Image => {
            const thumbnail = `data:image/jpeg;base64,${base64Image}`;
            setImageUri(thumbnail);
            if (base64Image) {
              saveThumbnail(name, thumbnail);
            }
          })
          .catch(console.error);
      }
    }
  }, [name, path, isVisible]);

  return (
    <TouchableOpacity
      onPress={() => {
        // @ts-expect-error: Not Typed function
        navigation.navigate('PdfView', { path });
      }}
      className="h-20 rounded-md">
      <View className="flex items-center flex-row h-full">
        <View className=" h-full w-20 items-center justify-center">
          {imageUri && (
            <Image
              source={{
                uri: imageUri,
              }}
              style={styles.thumbnailImage}
            />
          )}
        </View>

        <View className="flex left-2 justify-center">
          <Text className="text-sm whitespace-nowrap">{name}</Text>
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
