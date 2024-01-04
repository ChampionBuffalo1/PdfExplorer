import { useState } from 'react';
import { Flame, Search } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  appName: string;
}

export default function Header({ appName }: HeaderProps): JSX.Element {
  const [search, startSearch] = useState<boolean>(false);
  return (
    <View className="h-14 border bg-[#08080a] flex flex-row justify-between">
      <View className="flex flex-row items-center">
        <Flame color="white" size={26} />
        <Text className="text-lg text-white left-2">{appName}</Text>
      </View>

      {!search && (
        <View className="flex flex-row right-4 items-center">
          <TouchableOpacity onPress={() => startSearch(true)}>
            <Search color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
