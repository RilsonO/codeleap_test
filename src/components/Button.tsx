import { Button as ButtonNativeBase, IButtonProps, Text } from 'native-base';

type Props = IButtonProps & {
  title: string;
  variant?: 'solid' | 'outline';
};

export function Button({ title, variant = 'solid', ...rest }: Props) {
  return (
    <ButtonNativeBase
      w='full'
      bg={variant === 'outline' ? 'transparent' : 'blue.400'}
      borderWidth={variant === 'outline' ? 1 : 0}
      borderColor='gray.300'
      rounded={8}
      _pressed={{
        bg: variant === 'outline' ? 'gray.100:alpha.30' : 'blue.400:alpha.70',
      }}
      {...rest}
    >
      <Text
        color={variant === 'outline' ? 'black' : 'white'}
        fontFamily='bold'
        fontSize='md'
      >
        {title}
      </Text>
    </ButtonNativeBase>
  );
}
