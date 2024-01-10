import Home from './src/screens/Home';
import type { ReactElement } from 'react';
import PdfView from './src/screens/PdfView';
import Header from './src/components/Header';
import type { StackNavigator } from './NavigationTypes';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<StackNavigator>();

export default function App(): ReactElement {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: () => <Header appName="PdfExplorer" />,
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="PdfView" component={PdfView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
