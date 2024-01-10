import { useState, useEffect } from 'react';
import { FlashList } from '@shopify/flash-list';
import PdfInfoCard from '../components/PdfInfoCard';
import MediaStore, { FileInfo } from '../MediaStore';
import { View, Text, Platform, BackHandler } from 'react-native';
import {
  check,
  request,
  RESULTS,
  Permission,
  PERMISSIONS,
} from 'react-native-permissions';

export default function Home() {
  const [docInfo, setDocInfo] = useState<FileInfo[]>([]);
  const [inViewKeys, setInViewKeys] = useState<string[]>([]);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    requestPermission([
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ]);
    if (setDocInfo) {
      MediaStore.getPdfFiles(setDocInfo);
    }
  }, [setDocInfo]);

  return (
    <View className="bg-[#0d0d0df4] w-full h-full">
      {Platform.OS !== 'android' && (
        <Text>
          The App currently uses an Android only API and is not available on
          other platforms
        </Text>
      )}
      {Platform.OS === 'android' && (
        <FlashList
          data={docInfo}
          extraData={inViewKeys}
          keyExtractor={item => item.uri}
          renderItem={({ item, extraData }) => (
            <PdfInfoCard {...item} isVisible={extraData.includes(item.uri)} />
          )}
          onViewableItemsChanged={info =>
            setInViewKeys(info.viewableItems.map(item => item.key))
          }
          viewabilityConfig={{
            itemVisiblePercentThreshold: 30,
            minimumViewTime: 1000, // 1s
          }}
          // Use the element Inspector (in DevMenu) to find the size of the item
          estimatedItemSize={360}
        />
      )}
    </View>
  );
}

function requestPermission(permissions: Permission[]) {
  for (const permission of permissions) {
    check(permission).then(result => {
      switch (result) {
        case RESULTS.BLOCKED:
        case RESULTS.UNAVAILABLE: {
          setTimeout(() => BackHandler.exitApp(), 1000);
          break;
        }
        case RESULTS.DENIED: {
          request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(result => {
            if (result !== RESULTS.GRANTED) {
              setTimeout(() => BackHandler.exitApp(), 1000);
            }
          });
          break;
        }
      }
    });
  }
}
