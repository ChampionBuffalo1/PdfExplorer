import { FileInfo } from '../utils';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CachedFileData, getFileFromCache } from '../kvStore';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

type InfoCardProps = FileInfo & {
  isVisible: boolean;
};

export default function PdfInfoCard({ name, path, isVisible }: InfoCardProps) {
  const navigation = useNavigation();
  const [metadata, setMetadata] = useState<CachedFileData>();

  useEffect(() => {
    if (name) {
      setMetadata(getFileFromCache(name));
    }
  }, [name]);

  useEffect(() => {
    if (isVisible) {
      // TODO: Generate PDF Thumbnail Image or Retrieve From Cache
    }
  }, [isVisible]);

  return (
    <TouchableOpacity
      onPress={() => {
        // @ts-expect-error: Not Typed function
        navigation.navigate('PdfView', { path });
      }}
      className="h-20 rounded-md bg-[#0a0a08]">
      <View className="flex items-center flex-row h-full">
        <View className="border border-r-white h-full w-20 items-center justify-center">
          <Image
            // TODO: Show the PDF
            src="uri"
            style={styles.thumbnailImage}
          />
        </View>

        <View className="flex left-2">
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
