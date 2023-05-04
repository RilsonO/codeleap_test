import { useEffect, useRef, useState } from 'react';
import { Platform, RefreshControl } from 'react-native';
import {
  Center,
  HStack,
  Text,
  VStack,
  Icon,
  Pressable,
  useToast,
  FlatList,
  Modal,
  KeyboardAvoidingView,
} from 'native-base';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { storageUserRemove } from '@storage/storageUser';
import { useNavigation } from '@react-navigation/native';
import { NavigatorRoutesProps } from 'src/routes';
import { AppError } from '@utils/AppError';
import { Loading } from '@components/Loading';
import { api } from '@services/api';
import { CareerDTO } from '@dtos/CareerDTO';
import {
  getStatusBarHeight,
  getBottomSpace,
} from 'react-native-iphone-x-helper';
import Career from '@components/Career';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { Input } from '@components/Input';
import { TextArea } from '@components/TextArea';
import { Button } from '@components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '@redux/userSlice';

type FlatListRefProps = typeof FlatList & {
  scrollToIndex: (params: {
    index: number;
    animated?: boolean;
    viewOffset?: number;
    viewPosition?: number;
  }) => void;
};

type FormDataProps = {
  title: string;
  content: string;
};

const signInSchema = yup.object({
  title: yup.string().required('Title is required.'),
  content: yup.string().required('Content is required.'),
});

export function Home() {
  const navigation = useNavigation<NavigatorRoutesProps>();
  const toast = useToast();
  const dispatch = useDispatch();
  const flatListRef = useRef<FlatListRefProps>(null);
  const { name } = useSelector(selectUser);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
  });

  const [loading, setLoading] = useState(true);
  const [careers, setCareers] = useState<CareerDTO[]>([] as CareerDTO[]);
  const [nextPage, setNextPage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  async function handleLogOut() {
    try {
      setLoading(true);
      await storageUserRemove();
      navigation.reset({
        index: 0,
        routes: [{ name: 'signIn' }],
      });
      dispatch(logout());
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Failed to logout. Try again later.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchCareers(refreshing = false) {
    try {
      refreshing ? setIsRefreshing(true) : setLoading(true);
      console.log('next => ', nextPage);

      const { data } = await api.get(`?${!refreshing && nextPage}`);
      if (data.next) {
        setNextPage(data.next.split('?')[1]);
      } else {
        setNextPage('');
      }

      if (refreshing) {
        setCareers(data.results);
        return;
      }

      setCareers((prev) => [...prev, ...data.results]);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Failed to logout. Try again later.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }

  async function handleCreate({ title, content }: FormDataProps) {
    try {
      setIsCreating(true);
      reset();

      const { data } = await api.post('/', {
        username: name,
        title,
        content,
      });
      setCareers((prev) => [data, ...prev]);
      flatListRef?.current?.scrollToIndex({ index: 0 });
      setModalVisible(false);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Failed to logout. Try again later.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsCreating(false);
    }
  }

  useEffect(() => {
    fetchCareers();
  }, []);

  return (
    <>
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} p='6'>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          w='full'
          rounded={16}
          borderWidth={1}
          bg='white'
          borderColor={'gray.300'}
        >
          <VStack p='6'>
            <Modal.CloseButton />

            <Text fontFamily='bold' fontSize='xl' mb='6'>
              What’s on your mind?
            </Text>

            <Text fontFamily='regular' fontSize='md' mb='1'>
              Title
            </Text>
            <Controller
              control={control}
              name='title'
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder='Hello world'
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.title?.message}
                  autoCorrect={false}
                />
              )}
            />

            <Text fontFamily='regular' fontSize='md' mb='1'>
              Content
            </Text>
            <Controller
              control={control}
              name='content'
              render={({ field: { onChange, value } }) => (
                <TextArea
                  placeholder='Content here'
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.content?.message}
                  autoCorrect={false}
                />
              )}
            />
            <Button
              title='Create'
              mt='4'
              w='32'
              alignSelf='flex-end'
              onPress={handleSubmit(handleCreate)}
              isLoading={isCreating}
            />
          </VStack>
        </KeyboardAvoidingView>
      </Modal>

      <VStack flex={1} bg='white'>
        <HStack
          bg='blue.400'
          alignItems='center'
          px='9'
          pt={getStatusBarHeight() + 28}
          pb='7'
          justifyContent='space-between'
        >
          <Text color='white' fontFamily='bold' fontSize='xl'>
            CodeLeap Network
          </Text>
          <Pressable onPress={handleLogOut}>
            <Icon
              as={Ionicons}
              name='ios-log-out-outline'
              size='xl'
              color='white'
            />
          </Pressable>
        </HStack>

        {loading && careers.length === 0 ? (
          <Loading />
        ) : (
          <FlatList
            ref={flatListRef}
            data={careers}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <Career {...item} />}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              fetchCareers();
            }}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={() => {
                  fetchCareers(true);
                }}
              />
            }
            showsVerticalScrollIndicator={false}
            p='6'
            contentContainerStyle={
              careers.length === 0 && {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }
            }
            ListEmptyComponent={
              <Text fontFamily='bold' fontSize='md'>
                Not found!
              </Text>
            }
            ListFooterComponent={<Loading />}
          />
        )}

        <Pressable
          onPress={() => {
            setModalVisible(true);
          }}
          w='12'
          h='12'
          rounded='full'
          bg='blue.400'
          bottom={getBottomSpace()}
          right={6}
          position='absolute'
          alignItems='center'
          justifyContent='center'
        >
          <Icon color='white' as={AntDesign} name='plus' size='xl' />
        </Pressable>
      </VStack>
    </>
  );
}
