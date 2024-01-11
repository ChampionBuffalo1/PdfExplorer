import { useEffect, useState } from 'react';
import { FileInfo } from '../utils';
import { useNavigation } from '@react-navigation/native';

import { View, Text, Image, TouchableOpacity } from 'react-native';
import { CachedFileData, getFileFromCache } from '../kvStore';

export default function PdfInfoCard({
  path,
  name,
}: FileInfo & {
  isVisible: boolean;
}) {
  const navigation = useNavigation();
  const [metadata, setMetadata] = useState<CachedFileData>();

  useEffect(() => {
    setMetadata(getFileFromCache(name));
  }, []);

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
            // TODO: Generate the Thumbnail URI
            src="uri"
            style={{
              resizeMode: 'contain',
              aspectRatio: 1,
              width: '100%',
              height: '100%',
            }}
          />
        </View>

        <View className="flex left-2">
          <Text className="text-sm whitespace-nowrap">{name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
