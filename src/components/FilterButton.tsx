import { getFileFromCache } from '../kvStore';
import { FileInfo, getFileType } from '../utils';
import { Search, XCircle } from 'lucide-react-native';
import { PredicateType } from '../screens/MainScreen';
import { Dropdown } from 'react-native-element-dropdown';
import { Text, View, TextInput, Pressable } from 'react-native';
import {
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from 'react';

interface FilterButtonProps {
  setFilterFn: Dispatch<SetStateAction<PredicateType>>;
}

const dropDownOpts = [
  {
    label: 'On-going',
    value: 'ONGOING',
  },
  {
    label: 'Completed',
    value: 'COMPLETED',
  },
  {
    label: 'Not Started',
    value: 'NOT_STARTED',
  },
];

export default function FilterButton({ setFilterFn }: FilterButtonProps) {
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>('');
  const [dropDownValue, setDropDownValue] = useState<string>('');

  const handleSearch = useCallback(() => {
    if (setFilterFn && (searchString || dropDownValue)) {
      setIsSearch(true);
      // predicate
      const handleFiltering = (file: FileInfo) => {
        const name = file.name.trim().toLowerCase().replace('.pdf', '');
        return (
          name.includes(searchString.toLowerCase()) &&
          (dropDownValue
            ? getFileType(getFileFromCache(file.name)) === dropDownValue
            : true)
        );
      };

      setFilterFn(() => handleFiltering);
    }
  }, [setFilterFn, searchString, dropDownValue]);

  const handleReset = useCallback(() => {
    setIsSearch(false);
    setSearchString('');
    setDropDownValue('');
    setFilterFn(undefined);
  }, [setFilterFn]);

  return (
    <View className="flex flex-row justify-between items-center">
      <View className="left-1 w-1/2">
        <TextInput
          value={searchString}
          placeholder="Search..."
          onSubmitEditing={handleSearch}
          onChangeText={setSearchString}
          className="border-white border rounded-md"
        />
      </View>
      <View className="w-1/3 text-white">
        <Dropdown
          data={dropDownOpts}
          labelField="label"
          valueField="value"
          value={dropDownValue}
          onChange={item => setDropDownValue(item.value)}
          searchField="label"
          renderItem={item => (
            <View className="my-3 items-center">
              <Text className="text-black border-b-slate-700">
                {item.label}
              </Text>
            </View>
          )}
        />
      </View>

      <Pressable
        className="right-2"
        onPress={isSearch ? handleReset : handleSearch}>
        {isSearch && <XCircle className="border border-white text-white" />}
        {!isSearch && <Search className="border border-white text-white" />}
      </Pressable>
    </View>
  );
}
