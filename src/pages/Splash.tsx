import { useNavigation } from '@react-navigation/native';
import { Center, useToast } from 'native-base';
import { useEffect } from 'react';
import * as Animatable from 'react-native-animatable';
import { NavigatorRoutesProps } from 'src/routes';
import LogoImage from '@assets/codeleap_logo_black.png';
import { storageUserGet } from '@storage/storageUser';
import { AppError } from '@utils/AppError';

export function Splash() {
  const toast = useToast();
  const { reset } = useNavigation<NavigatorRoutesProps>();

  async function loadUserData() {
    try {
      const user = await storageUserGet();
      reset({
        index: 0,
        routes: [{ name: user?.name ? 'home' : 'signIn' }],
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Failed to load user data. Try again later.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  useEffect(() => {
    setTimeout(() => {
      loadUserData();
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
