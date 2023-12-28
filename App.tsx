import React from 'react';
import Home from './src/Home';
import { View, useColorScheme } from 'react-native';

export default function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View>
      <Home />
    </View>
  );
}
