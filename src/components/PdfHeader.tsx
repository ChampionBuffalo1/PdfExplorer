import { DrawerProps } from './PdfDrawer';
import { Text, TextInput, View } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function PdfHeader({
  PDF,
  close,
  pageData,
}: Omit<DrawerProps, 'content'>) {
  const [newPage, setNewPage] = useState<string>(
    pageData.currentPage.toString(),
  );

  useEffect(() => {
    setNewPage(pageData.currentPage.toString());
  }, [pageData.currentPage]);

  const maxDigits = useMemo(() => {
    if (pageData.totalPages && pageData.totalPages !== -1) {
      return Math.ceil(Math.log10(pageData.totalPages));
    }
    return 1;
  }, [pageData]);

  const handlePageChange = useCallback(() => {
    const page = parseInt(newPage, 10);
    if (
      newPage &&
      Number.isSafeInteger(page) &&
      page >= 1 &&
      page <= pageData.totalPages
    ) {
      close();
      PDF.setPage(page);
    }
  }, [PDF, newPage, pageData, close]);

  return (
    <View>
      <View className="flex flex-row justify-center">
        <View className="flex flex-row items-center bg-slate-200 mt-2 rounded-sm">
          <TextInput
            value={newPage}
            className="text-black"
            keyboardType="numeric"
            maxLength={maxDigits}
            onEndEditing={handlePageChange}
            onSubmitEditing={handlePageChange}
            onChangeText={(page: string) => setNewPage(page)}
          />
          <Text className="text-black">/</Text>
          <TextInput
            editable={false}
            className="text-black"
            value={pageData.totalPages.toString() || ''}
          />
        </View>
      </View>
      <Text className="mt-4 mb-2 text-black text-lg font-semibold">
        TABLE OF CONTENT
      </Text>
    </View>
  );
}
