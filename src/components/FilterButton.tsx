import { SlidersHorizontal } from 'lucide-react-native';
import { Text, View, TouchableOpacity } from 'react-native';

export default function FilterButton() {
  // const [filterModal, setFilterModal] = useState<boolean>(false);
  return (
    <TouchableOpacity
      className="flex flex-row-reverse right-2"
      onPress={() => console.log('Pressing the filter')}>
      <View className="flex flex-row-reverse rounded-md border border-white px-4 py-1">
        <Text className="px-2">Filters</Text>
        <SlidersHorizontal className="text-white" />
      </View>
    </TouchableOpacity>
  );
}
