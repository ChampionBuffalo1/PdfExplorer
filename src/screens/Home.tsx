import { useEffect } from 'react';
import MainScreen from './MainScreen';
import { requestPermission } from '../utils';
import BootSplash from 'react-native-bootsplash';
import { Text, Platform, PermissionsAndroid } from 'react-native';

export default function Home() {
  // const [] = useState<boolean>(false)
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }
    requestPermission([
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]).then(() => {
      BootSplash.hide({ fade: true });
    });
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
