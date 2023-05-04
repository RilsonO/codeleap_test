import { extendTheme } from 'native-base';

export const THEME = extendTheme({
  colors: {
    green: {
      400: '#47B960',
    },
    gray: {
      400: '#777777',
      300: '#999999',
      200: '#CCCCCC',
      100: '#DDDDDD',
    },
    blue: {
      500: '#7695EC',
    },
    white: '#FFFFFF',
    red: {
      500: '#FF5151',
    },
  },
  fonts: {
    bold: 'Roboto_700Bold',
    regular: 'Roboto_400Regular',
  },
  fontSizes: {
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
  },
});
