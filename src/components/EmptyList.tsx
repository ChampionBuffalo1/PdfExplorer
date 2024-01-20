import { Text, View } from 'react-native';

export default function EmptyList() {
  return (
    <View className="flex flex-row justify-center mt-4">
      <Text className="text-white">
        No PDF File found in Downloads directory
      </Text>
    </View>
  );
}
