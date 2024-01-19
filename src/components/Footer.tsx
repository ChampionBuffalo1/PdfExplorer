import { Text, View } from 'react-native';

export default function Footer() {
  return (
    <View className="mt-2">
      <View className="border border-t-white w-full" />
      <View className="flex items-center m-4">
        <Text>Made With React Native & ❤️</Text>
      </View>
    </View>
  );
}
