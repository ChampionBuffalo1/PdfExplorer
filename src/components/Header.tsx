import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Flame } from 'lucide-react-native';

interface HeaderProps {
  appName?: string;
}

export default function Header({ appName = '' }: HeaderProps): ReactNode {
  return (
    <View className="h-14 border bg-[#08080a] flex flex-row justify-between">
      <View className="flex flex-row items-center">
        <Flame color="white" size={26} />
        <Text className="text-lg text-white left-2">{appName || 'Home'}</Text>
      </View>
    </View>
  );
}
