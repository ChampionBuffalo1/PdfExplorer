import { useEffect } from 'react';
import Footer from '../components/Footer';
import { requestPermission } from '../utils';
import RenderFiles from '../components/RenderFiles';
import FilterButton from '../components/FilterButton';
import { PERMISSIONS } from 'react-native-permissions';
import { Text, Platform, ScrollView } from 'react-native';

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

  return (
    <ScrollView className="bg-[#0a0a08] w-full h-full">
      <FilterButton />
      <RenderFiles />
      <Footer />
    </ScrollView>
  );
}
