import { useNavigation } from '@react-navigation/native';
import { Center } from 'native-base';
import { useEffect } from 'react';
import * as Animatable from 'react-native-animatable';
import { NavigatorRoutesProps } from 'src/routes';
import LogoImage from '@assets/codeleap_logo_black.png';

export function Splash() {
  const { reset } = useNavigation<NavigatorRoutesProps>();

  useEffect(() => {
    setTimeout(() => {
      reset({
        index: 0,
        routes: [{ name: 'signIn' }],
      });
    }, 2000);
  });

  return (
    <Center flex={1} bg='white'>
      <Animatable.Image
        animation='pulse'
        iterationCount='infinite'
        source={LogoImage}
        resizeMode='contain'
        style={{ width: '50%' }}
      />
    </Center>
  );
}
