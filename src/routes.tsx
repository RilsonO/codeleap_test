import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { SignIn } from '@pages/SignIn';
import { Home } from '@pages/Home';
import { Box, useTheme } from 'native-base';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { Splash } from '@pages/Splash';

type RoutesType = {
  signIn: undefined;
  home: undefined;
  splash: undefined;
};

export type NavigatorRoutesProps = NativeStackNavigationProp<RoutesType>;

const { Navigator, Screen } = createNativeStackNavigator<RoutesType>();

export function Routes() {
  const { colors } = useTheme();

  const theme = DefaultTheme;
  theme.colors.background = colors.white;

  return (
    <NavigationContainer>
      <Box flex={1} bg='white'>
        <Navigator screenOptions={{ headerShown: false }}>
          <Screen name='splash' component={Splash} />
          <Screen name='home' component={Home} />
          <Screen name='signIn' component={SignIn} />
        </Navigator>
      </Box>
    </NavigationContainer>
  );
}
