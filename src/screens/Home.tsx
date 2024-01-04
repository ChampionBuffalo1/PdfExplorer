import { useState, useEffect } from 'react';
import { View, Text, Platform, BackHandler, NativeModules } from 'react-native';
import {
  check,
  request,
  RESULTS,
  Permission,
  PERMISSIONS,
} from 'react-native-permissions';
import { FlashList } from '@shopify/flash-list';
import PdfInfoCard from '../components/PdfInfoCard';

const { MediaStore } = NativeModules;

export interface MediaReturnType {
  uri: string;
  name: string;
  size: number;
  createdAt: string;
}

export default function Home() {
  const [docInfo, setDocInfo] = useState<MediaReturnType[]>([]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    requestPermission([
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ]);
    MediaStore.getPdfFiles((info: MediaReturnType[]) => setDocInfo(info));
  }, []);

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
          renderItem={({ item, index }) => (
            <PdfInfoCard {...item} key={index} />
          )}
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
            if (result !== RESULTS.GRANTED)
              setTimeout(() => BackHandler.exitApp(), 1000);
          });
          break;
        }
      }
    });
  }
}
