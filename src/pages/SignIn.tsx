import { useState } from 'react';
import { Platform } from 'react-native';
import { Button } from '@components/Button';
import { Input } from '@components/Input';
import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast,
  KeyboardAvoidingView,
} from 'native-base';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AppError } from '@utils/AppError';
import { storageUserSave } from '@storage/storageUser';
import { useNavigation } from '@react-navigation/native';
import { NavigatorRoutesProps } from 'src/routes';
import LogoImage from '@assets/codeleap_logo_black.png';
import { useDispatch } from 'react-redux';
import { updateUser } from '@redux/userSlice';

type FormDataProps = {
  name: string;
};

const signInSchema = yup.object({
  name: yup.string().required('Username is required.'),
});

export function SignIn() {
  const dispatch = useDispatch();
  const { reset } = useNavigation<NavigatorRoutesProps>();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn({ name }: FormDataProps) {
    try {
      setIsLoading(true);
      dispatch(updateUser(name));
      await storageUserSave({ name });
      reset({
        index: 0,
        routes: [{ name: 'home' }],
      });
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Failed to save user data. Try again later.';

      setIsLoading(false);

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <VStack flex={1} px={10} pb={16} bg='white'>
          <Center flex={1}>
            <Image
              source={LogoImage}
              alt='Logo da codeleap'
              resizeMode='contain'
              w='1/2'
              h='16'
              alignSelf='center'
            />
            <Heading fontSize='xl' mb={6} fontFamily='bold' textAlign='center'>
              Welcome to CodeLeap network!
            </Heading>

            <Text fontFamily='regular' fontSize='md' mb='2'>
              Please enter your username
            </Text>

            <Controller
              control={control}
              name='name'
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='John doe'
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.name?.message}
                  autoCorrect={false}
                />
              )}
            />
            <Button
              title='ENTER'
              onPress={handleSubmit(handleSignIn)}
              isLoading={isLoading}
              mt='4'
            />
          </Center>
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
