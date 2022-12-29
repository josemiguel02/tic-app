import { useState } from 'react'
import Router from 'next/router'
import NextImage from 'next/image'
import { useForm } from 'react-hook-form'
import {
  Box,
  Card,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useToast
} from '@chakra-ui/react'
import { HiOutlineUserCircle, HiOutlineLockClosed } from 'react-icons/hi'
import { useAuth } from '@/hooks'
import { Button } from '.'

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserFormData>()
  const [btnLoading, setBtnLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { loginUser, loginAdmin } = useAuth()
  const toast = useToast()

  const onLogin = async (data: UserFormData) => {
    setBtnLoading(true)

    if (isAdmin) {
      const { isValidLoginAdmin, msg } = await loginAdmin(data)

      if (!isValidLoginAdmin) {
        toast({
          title: msg,
          status: 'error',
          duration: 3000,
          isClosable: true
        })
        setBtnLoading(false)
        return
      }

      // Navigate to Dashboard
      Router.reload()
      return
    }

    const { isValidLoginUser, msg } = await loginUser(data)

    if (!isValidLoginUser) {
      toast({
        title: msg,
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      setBtnLoading(false)
      return
    }

    // Navigate to Home Page
    Router.reload()
  }

  return (
    <Card
      color='none'
      bgColor='white'
      p={{ base: '3.5rem 2rem', md: '3.5rem 3rem' }}
      shadow='xl'
      display='flex'
      flexDir='column'
      gap={8}
      rounded='lg'
      w='30rem'
    >
      <Flex flexDir='column' align='center'>
        <picture>
          <NextImage
            priority
            src='/static/img/tic-icon.svg'
            width={100}
            height={50}
            alt='Logo TIC'
            style={{
              objectFit: 'cover',
              alignSelf: 'center'
            }}
          />
        </picture>

        <Heading as='h1' fontSize={{ base: '3xl', md: '4xl' }} size='xl'>
          Iniciar Sesión
        </Heading>
      </Flex>

      <Flex
        as='form'
        gap={5}
        noValidate
        direction='column'
        onSubmit={handleSubmit(onLogin)}
      >
        <FormControl>
          <FormLabel fontWeight='normal'>Cédula de Identidad</FormLabel>

          <InputGroup>
            <InputLeftElement>
              <Icon as={HiOutlineUserCircle} boxSize={5} />
            </InputLeftElement>

            <Input
              type='text'
              bgColor='#C9C9C95d'
              placeholder='Ingrese su cédula'
              variant='filled'
              {...register('identification', {
                required: 'Este campo es requerido'
              })}
              isInvalid={!!errors.identification}
              focusBorderColor={!!errors.identification ? 'crimson' : 'primary'}
            />
          </InputGroup>

          {!!errors.identification && (
            <Text color='crimson' fontSize='small'>
              {errors.identification?.message}
            </Text>
          )}
        </FormControl>

        <FormControl>
          <FormLabel fontWeight='normal'>Contraseña</FormLabel>

          <InputGroup>
            <InputLeftElement>
              <Icon as={HiOutlineLockClosed} boxSize={5} />
            </InputLeftElement>
            <Input
              type='password'
              bgColor='#C9C9C95d'
              placeholder='Ingrese su contraseña'
              variant='filled'
              {...register('password', {
                required: 'Este campo es requerido',
                minLength: { value: 10, message: 'Mínimo 10 caracteres' }
              })}
              isInvalid={!!errors.password}
              focusBorderColor={!!errors.password ? 'crimson' : 'primary'}
            />
          </InputGroup>

          {!!errors.password && (
            <Text color='crimson' fontSize='small'>
              {errors.password?.message}
            </Text>
          )}
        </FormControl>

        <Checkbox
          colorScheme='blue'
          borderColor='gray.400'
          isChecked={isAdmin}
          onChange={e => setIsAdmin(e.target.checked)}
        >
          Administrador
        </Checkbox>

        <Button
          mt={5}
          type='submit'
          isLoading={btnLoading}
          loadingText='Cargando...'
          text='Ingresar'
        />
      </Flex>
    </Card>
  )
}
