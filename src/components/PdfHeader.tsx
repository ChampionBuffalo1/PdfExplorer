import { Text, TextInput, View } from 'react-native';
import { DrawerProps } from './PdfDrawer';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function PdfHeader({
  PDF,
  close,
  pageData,
}: Omit<DrawerProps, 'content'>) {
  const [newPage, setNewPage] = useState<number>(pageData.currentPage);

  useEffect(() => {
    setNewPage(pageData.currentPage);
  }, [pageData.currentPage]);

  const maxDigits = useMemo(() => {
    if (pageData?.totalPages && pageData.totalPages !== -1) {
      return Math.ceil(Math.log10(pageData.totalPages));
    }
    return 1;
  }, [pageData]);

  const handlePageChange = useCallback(() => {
    if (newPage && newPage > 1 && newPage < pageData.totalPages) {
      close();
      PDF.setPage(newPage);
    }
  }, [PDF, newPage, pageData]);

  return (
    <View>
      <View className="flex flex-row justify-center">
        <View className="flex flex-row items-center bg-slate-200 mt-2 rounded-sm">
          <TextInput
            className="text-black"
            keyboardType="numeric"
            maxLength={maxDigits}
            onEndEditing={handlePageChange}
            onSubmitEditing={handlePageChange}
            onChangeText={(page: string) => setNewPage(parseInt(page, 10))}
            value={
              newPage > 0 ? newPage.toString() : pageData.currentPage.toString()
            }
          />
          <Text className="text-black">/</Text>
          <TextInput
            editable={false}
            className="text-black"
            value={pageData?.totalPages.toString() || ''}
          />
        </View>
      </View>
      <Text className="mt-4 mb-2 text-black text-lg font-semibold">
        TABLE OF CONTENT
      </Text>
    </View>
  );
}
