import PdfDrawer from '../components/PdfDrawer';
import { Drawer } from 'react-native-drawer-layout';
import Pdf, { TableContent } from 'react-native-pdf';
import type { StackScreenProps } from '../NavigationTypes';
import { Dimensions, View, StyleSheet } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CachedFileData, getFileFromCache, setFileCache } from '../kvStore';

export type PageData = { currentPage: number; totalPages: number };

export default function PdfView({
  route,
  navigation,
}: StackScreenProps<'PdfView'>) {
  const PdfRef = useRef<Pdf>(null);
  const fileName = useRef<string>('');
  const toc = useRef<TableContent[]>([]);
  const [open, setOpen] = useState(false);
  const [uri, setUri] = useState<string>('');
  const pageDataRef = useRef<PageData>({
    currentPage: -1,
    totalPages: -1,
  });

  const handleDrawerOpen = useCallback(() => setOpen(true), []);
  const handleDrawerClose = useCallback(() => setOpen(false), []);

  const drawerContent = useCallback(() => {
    if (PdfRef.current) {
      return (
        <PdfDrawer
          PDF={PdfRef.current}
          content={toc.current}
          close={handleDrawerClose}
          pageData={pageDataRef.current}
        />
      );
    }
  }, [toc, pageDataRef, PdfRef, handleDrawerClose]);

  const onPdfLoad = useCallback(() => {
    // Restore state from cache
    if (PdfRef.current && fileName.current) {
      const cacheData = getFileFromCache(fileName.current);
      if (
        !cacheData ||
        pageDataRef.current.currentPage >= cacheData.currentPage
      ) {
        return;
      }
      PdfRef.current.setPage(cacheData.currentPage);
    }
  }, [fileName, PdfRef]);

  const onUnmount = useCallback(() => {
    if (!fileName.current) {
      return;
    }
    // Saving state to cache
    const cacheData =
      getFileFromCache(fileName.current) || ({} as CachedFileData);
    if (cacheData.currentPage === pageDataRef.current.currentPage) {
      return;
    }
    const { totalPages, currentPage } = pageDataRef.current;
    setFileCache(fileName.current, {
      ...cacheData,
      totalPages,
      currentPage,
    });
  }, [fileName, pageDataRef]);

  useEffect(() => onUnmount, [onUnmount]);

  useEffect(() => {
    if (route.params) {
      fileName.current = route.params.name;
      if (route.params.path) {
        setUri(route.params.path);
      } else {
        navigation.goBack();
      }
    }
  }, [route, navigation, setUri]);

  return (
    <Drawer
      open={open}
      onOpen={handleDrawerOpen}
      onClose={handleDrawerClose}
      renderDrawerContent={drawerContent}>
      <View className="flex-1 items-center justify-start">
        {uri && (
          <Pdf
            ref={PdfRef}
            source={{ uri }}
            style={style.pdf}
            enableAntialiasing
            showsVerticalScrollIndicator
            onLoadComplete={(totalPages, _path, _size, tableofContent) => {
              pageDataRef.current.totalPages = totalPages;
              if (tableofContent) {
                toc.current = tableofContent;
              }
              onPdfLoad();
            }}
            onPageChanged={currentPage => {
              pageDataRef.current.currentPage = currentPage;
            }}
          />
        )}
      </View>
    </Drawer>
  );
}

const style = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
