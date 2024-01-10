import { FileInfo } from '../MediaStore';
import { useNavigation } from '@react-navigation/native';

import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function PdfInfoCard({
  uri,
  name,
}: FileInfo & {
  isVisible: boolean;
}) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        // @ts-expect-error: Not Typed function
        navigation.navigate('PdfView', { uri });
      }}
      className="h-20 rounded-md bg-[#0a0a08]">
      <View className="flex items-center flex-row h-full">
        <View className="border border-r-white h-full w-20 items-center justify-center">
          {/* TODO: Generate PDF Thumbnails */}
          <Image
            source={
              {
                //   uri: tbUri,
              }
            }
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
