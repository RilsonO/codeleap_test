import { useCallback, memo, useState, useRef } from 'react';
import { Platform } from 'react-native';
import { CareerDTO } from '@dtos/CareerDTO';
import {
  AlertDialog,
  Box,
  HStack,
  Text,
  VStack,
  useToast,
  Pressable,
  Modal,
  KeyboardAvoidingView,
} from 'native-base';
import TrashSvg from '@assets/trash.svg';
import NoteSvg from '@assets/note.svg';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useSelector } from 'react-redux';
import { selectUser } from '@redux/userSlice';
import { Button } from './Button';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { Input } from './Input';
import { TextArea } from './TextArea';

dayjs.extend(relativeTime);

type FormDataProps = {
  title: string;
  content: string;
};

const signInSchema = yup.object({
  title: yup.string().required('Title is required.'),
  content: yup.string().required('Content is required.'),
});

function Career(params: CareerDTO) {
  const cancelRef = useRef(null);

  const toast = useToast();

  const [career, setCareer] = useState(params);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { name } = useSelector(selectUser);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
    defaultValues: {
      title: career.title,
      content: career.content,
    },
  });

  const onCloseDialog = () => setIsOpenDialog(false);
  const onOpenDialog = () => setIsOpenDialog(true);
  const onCloseModal = () => setModalVisible(false);
  const onOpenModal = () => setModalVisible(true);

  const getTimeAgo = useCallback((datetime: string) => {
    const now = dayjs();
    const created = dayjs(datetime);
    return created.from(now);
  }, []);

  async function handleDelete() {
    try {
      setIsDeleting(true);

      await api.delete(`${career.id}/`);
      setIsDeleted(true);
      onCloseDialog();
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Failed to delete. Try again later.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleUpdate({ title, content }: FormDataProps) {
    try {
      setIsUpdating(true);

      const { data } = await api.patch(`${career.id}/`, {
        title,
        content,
      });
      setCareer(data);
      onCloseModal();
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Failed to update. Try again later.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpenDialog}
        onClose={onCloseDialog}
        p='6'
      >
        <Box w='full' rounded={16} borderWidth={1} bg='white' p='6'>
          <Text fontFamily='bold' fontSize='xl'>
            Are you sure you want to delete this item?
          </Text>
          <HStack w='full' justifyContent={'space-between'} mt='10'>
            <Button
              variant='outline'
              title='Cancel'
              w='32'
              onPress={onCloseDialog}
              isDisabled={isDeleting}
            />
            <Button
              bg='red.500'
              title='Delete'
              w='32'
              onPress={handleDelete}
              isLoading={isDeleting}
            />
          </HStack>
        </Box>
      </AlertDialog>

      <Modal isOpen={modalVisible} onClose={onCloseModal} p='6'>
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
              Edit item
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

            <HStack w='full' justifyContent='space-between' mt='4'>
              <Button
                variant='outline'
                title='Cancel'
                w='32'
                alignSelf='flex-end'
                onPress={onCloseModal}
                isDisabled={isUpdating}
              />

              <Button
                title='Save'
                w='32'
                bg='green.400'
                alignSelf='flex-end'
                onPress={handleSubmit(handleUpdate)}
                isLoading={isUpdating}
              />
            </HStack>
          </VStack>
        </KeyboardAvoidingView>
      </Modal>

      {!isDeleted && (
        <Box w='full' rounded='4' borderWidth={1} borderColor='gray.300' mb='6'>
          <HStack
            w='full'
            bg='blue.400'
            p='6'
            alignItems='center'
            justifyContent='space-between'
          >
            <Text
              numberOfLines={1}
              flex={1}
              fontSize='xl'
              fontFamily='bold'
              color='white'
            >
              {career.title}
            </Text>
            {name === career.username && (
              <HStack>
                <Pressable onPress={onOpenDialog}>
                  <TrashSvg />
                </Pressable>

                <Pressable ml='2' onPress={onOpenModal}>
                  <NoteSvg />
                </Pressable>
              </HStack>
            )}
          </HStack>

          <VStack>
            <HStack
              w='full'
              p='6'
              alignItems='center'
              justifyContent='space-between'
            >
              <Text
                flex={1}
                numberOfLines={1}
                fontSize='lg'
                fontFamily='bold'
                color='gray.400'
              >
                @{career.username}
              </Text>
              <Text fontSize='lg' fontFamily='regular' color='gray.400'>
                {getTimeAgo(career.created_datetime)}
              </Text>
            </HStack>

            <Text
              mx='6'
              mb='6'
              fontSize='lg'
              fontFamily='regular'
              color='gray.400'
            >
              {career.content}
            </Text>
          </VStack>
        </Box>
      )}
    </>
  );
}

export default memo(Career);
