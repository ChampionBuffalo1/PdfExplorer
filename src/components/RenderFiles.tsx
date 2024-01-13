import PdfInfoCard from './PdfInfoCard';
import { useState, useEffect } from 'react';
import { FlashList } from '@shopify/flash-list';
import { getPdfFiles, FileInfo } from '../utils';

export default function RenderFiles() {
  const [pdfFiles, setPdfFiles] = useState<FileInfo[]>([]);
  const [inViewKeys, setInViewKeys] = useState<string[]>([]);

  useEffect(() => {
    getPdfFiles().then(setPdfFiles);
  }, []);

  return (
    <FlashList
      data={pdfFiles}
      extraData={inViewKeys}
      keyExtractor={item => item.path}
      renderItem={({ item, extraData }) => (
        <PdfInfoCard {...item} isVisible={extraData.includes(item.path)} />
      )}
      onViewableItemsChanged={info =>
        setInViewKeys(info.viewableItems.map(item => item.key))
      }
      viewabilityConfig={{
        itemVisiblePercentThreshold: 40,
        minimumViewTime: 500, // 0.5s
      }}
      // Use the element Inspector (in DevMenu) to find the size of the item
      estimatedItemSize={360}
    />
  );
}
