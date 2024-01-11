import Pdf from 'react-native-pdf';
import { useEffect, useState } from 'react';
import type { StackScreenProps } from '../../NavigationTypes';
import { Dimensions, View, Text, StyleSheet } from 'react-native';

export default function PdfView({ route }: StackScreenProps<'PdfView'>) {
  const [uri, setUri] = useState<string>('');

  useEffect(() => {
    if (route.params?.path) {
      setUri(route.params.path);
    }
  }, [route, setUri]);

  return (
    <View className="flex-1 items-center justify-start">
      {uri && (
        <Pdf
          style={style.pdf}
          source={{
            uri,
          }}
        />
      )}
      {!uri && <Text className="text-black">No URI Found</Text>}
    </View>
  );
}

const style = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
