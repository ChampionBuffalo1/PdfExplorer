import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

interface PdfViewerType {
  uri: string;
}

export type StackNavigator = {
  Home: undefined;
  PdfView: PdfViewerType;
};

export type DefaultNavigationType = NativeStackNavigationProp<StackNavigator>;

export type StackScreenProps<T extends keyof StackNavigator> =
  NativeStackScreenProps<StackNavigator, T>;
