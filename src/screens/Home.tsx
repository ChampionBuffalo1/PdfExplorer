import { useEffect, useState } from 'react';
import {
  Text,
  ScrollView,
  BackHandler,
  NativeModules,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import {
  PERMISSIONS,
  Permission,
  RESULTS,
  check,
  request,
} from 'react-native-permissions';

const { MediaStore } = NativeModules;

export default function Home() {
  const [map, setMap] = useState<string[]>([]);
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    requestPermission([
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ]);
  }, []);

  return (
    <ScrollView className="h-screen text-black">
      {map.length == 0 && (
        <TouchableOpacity
          className="h-24 bg-blue-500"
          onPress={() => {
            MediaStore.getPdfFiles((str: string[]) => setMap(str));
          }}>
          <Text className="text-black text-center">Display pdf thumbnails!</Text>
        </TouchableOpacity>
      )}
      {map.length > 0 &&
        map.map(m => (
          <Image
            source={{ uri: `data:image/png;base64,${m}` }}
            style={{ width: 480, height: 300 }}
          />
        ))}
    </ScrollView>
  );
}

async function requestPermission(permissions: Permission[]) {
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
