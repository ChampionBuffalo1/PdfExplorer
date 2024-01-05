import { FileInfo } from '../MediaStore';
import { View, Text, Image, TouchableOpacity } from 'react-native';

export default function PdfInfoCard({ name }: FileInfo) {
  return (
    <TouchableOpacity
      // TODO: Render the pdf or navigate to the pdf renderer
      onPress={() => console.log('pressing: ' + name)}
      className="h-20 border mt-2 border-white rounded-md">
      <View className="flex items-center flex-row h-full">
        <View className="border border-r-white h-full w-20 items-center justify-center">
          <Image
            // TODO: Fetch the thumbnail using the Uri
            src="https://upload.wikimedia.org/wikipedia/commons/f/f0/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006_edit_1.jpg"
            style={{
              resizeMode: 'contain',
              aspectRatio: 1,
              width: '100%',
              height: '100%',
            }}
          />
        </View>

        <View className="flex left-2">
          <Text className="text-sm">{name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
