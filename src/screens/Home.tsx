import { useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  ScrollView,
  BackHandler,
  NativeModules,
  TouchableOpacity,
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
  const [images, setImages] = useState<string[]>([]);
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    requestPermission([
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ]);
  }, []);

  return (
    <View>
      {images.length == 0 && (
        <TouchableOpacity
          className="h-24 bg-blue-500"
          onPress={() => {
            MediaStore.getPdfFiles((img: string[]) => setImages(img));
          }}>
          <Text className="text-black text-center">
            Display pdf thumbnails!
          </Text>
        </TouchableOpacity>
      )}
      <ScrollView>
        {images.length > 0 &&
          images.map((img64, idx) => (
            <Image
              key={idx}
              style={{
                resizeMode: 'contain',
                flex: 1,
                aspectRatio: 1,
              }}
              source={{ uri: `data:image/png;base64,${img64}` }}
            />
          ))}
      </ScrollView>
    </View>
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
