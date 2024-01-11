import { useEffect } from 'react';
import { requestPermission } from '../utils';
import { View, Text, Platform } from 'react-native';
import RenderFiles from '../components/RenderFiles';
import { PERMISSIONS } from 'react-native-permissions';

export default function Home() {
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    requestPermission([
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    ]);
  }, []);

  return (
    <View className="bg-[#0d0d0df4] w-full h-full">
      {Platform.OS !== 'android' && (
        <Text>
          The App currently uses an Android only API and is not available on
          other platforms
        </Text>
      )}
      {Platform.OS === 'android' && <RenderFiles />}
    </View>
  );
}
