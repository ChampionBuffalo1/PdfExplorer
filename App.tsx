import Home from './src/screens/Home';
import type { ReactElement } from 'react';
import Header from './src/components/Header';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App(): ReactElement {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: () => <Header appName="PdfExplorer" />,
        }}>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
