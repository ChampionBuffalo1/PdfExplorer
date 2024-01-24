import { useEffect } from 'react';
import MainScreen from './MainScreen';
import { requestPermission } from '../utils';
import BootSplash from 'react-native-bootsplash';
import { Text, Platform, PermissionsAndroid } from 'react-native';

export default function Home() {
  useEffect(() => {
    if (Platform.OS !== 'android') {
      // Remove the splashscreen to show error message
      BootSplash.hide({ fade: true });
      return;
    }
    requestPermission([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ]).finally(() => BootSplash.hide({ fade: true }));
  }, []);

  if (Platform.OS !== 'android') {
    return (
      <Text className="text-black">
        The App currently uses an Android only API and is not available on other
        platforms
      </Text>
    );
  }
  return <MainScreen />;
}
