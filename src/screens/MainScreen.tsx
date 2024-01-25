import Footer from '../components/Footer';
import EmptyList from '../components/EmptyList';
import { FlashList } from '@shopify/flash-list';
import { getPdfFiles, FileInfo } from '../utils';
import PdfInfoCard from '../components/PdfInfoCard';
import FilterButton from '../components/FilterButton';
import { useState, useEffect, useCallback } from 'react';
import { View, PermissionsAndroid, RefreshControl } from 'react-native';

export default function MainScreen() {
  const [pdfFiles, setPdfFiles] = useState<FileInfo[]>([]);
  const [predicate, setPredicate] = useState<PredicateType>();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadFiles = useCallback(() => {
    setRefreshing(true);
    getPdfFiles()
      .then(files => {
        setPdfFiles(files);
        setRefreshing(false);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ).then(result => {
      if (result) {
        loadFiles();
      }
    });
  }, [loadFiles]);

  return (
    <View className="bg-[#0a0a08] w-full h-full min-h-[2px]">
      <FlashList
        data={predicate ? pdfFiles.filter(predicate) : pdfFiles}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadFiles} />
        }
        keyExtractor={item => item.path}
        renderItem={({ item }) => <PdfInfoCard {...item} />}
        viewabilityConfig={{ itemVisiblePercentThreshold: 40 }}
        ListFooterComponent={Footer}
        ListEmptyComponent={EmptyList}
        ListHeaderComponent={<FilterButton setFilterFn={setPredicate} />}
        // Use the element Inspector (in DevMenu) to find the size of the item
        estimatedItemSize={360}
      />
    </View>
  );
}

export type PredicateType = ((files: FileInfo) => boolean) | undefined;
