import {
  TextArea as NativeBaseTextArea,
  ITextAreaProps,
  FormControl,
} from 'native-base';

type Props = ITextAreaProps & {
  errorMessage?: string | null;
};

export function TextArea({ errorMessage = null, isInvalid, ...rest }: Props) {
  const invalid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={invalid} mb={4}>
      <NativeBaseTextArea
        bg='white'
        h={20}
        maxW='300'
        px={2}
        rounded={8}
        borderColor='gray.400'
        fontSize='sm'
        fontFamily='regular'
        color='black'
        placeholderTextColor='gray.200'
        autoCompleteType={false}
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
