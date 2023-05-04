import {
  Input as NativeBaseInput,
  IInputProps,
  FormControl,
} from 'native-base';

type Props = IInputProps & {
  errorMessage?: string | null;
};

export function Input({ errorMessage = null, isInvalid, ...rest }: Props) {
  const invalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseInput
        bg='white'
        h={8}
        px={2}
        rounded={8}
        borderColor='gray.400'
        fontSize='sm'
        fontFamily='regular'
        color='black'
        placeholderTextColor='gray.200'
        _focus={{
          bg: 'white',
          borderColor: 'blue.400',
        }}
        {...rest}
      />
      <FormControl.ErrorMessage _text={{ color: 'red.500' }}>
        {errorMessage}
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
