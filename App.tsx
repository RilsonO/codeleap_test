import { StatusBar } from 'react-native';
import { Center, NativeBaseProvider, Text } from 'native-base';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { THEME } from './src/theme';
import { Loading } from '@components/Loading';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle='dark-content'
        backgroundColor={'transparent'}
        translucent
      />
      {fontsLoaded ? (
        <Center flex={1}>
          <Text fontFamily={'bold'} fontSize='xl'>
            Hello codeleap
          </Text>
        </Center>
      ) : (
        <Loading />
      )}
    </NativeBaseProvider>
  );
}
