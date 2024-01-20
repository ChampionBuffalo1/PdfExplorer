import { useEffect } from 'react';
import MainScreen from './MainScreen';
import { requestPermission } from '../utils';
import { Text, Platform } from 'react-native';
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

  if (Platform.OS !== 'android') {
    return (
      <Text>
        The App currently uses an Android only API and is not available on other
        platforms
      </Text>
    );
  }

  return <MainScreen />;
}
