import { useState } from 'react'
import Router from 'next/router'
import { useForm } from 'react-hook-form'
import {
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
import { useAuth } from '@/hooks/useAuth'
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
      p={{ base: '3.5rem 2rem', md: '5rem 3.5rem' }}
      shadow='xl'
      display='flex'
      flexDir='column'
      gap={10}
      rounded='lg'
      w='30rem'
    >
      <Heading size='xl' alignSelf='center'>
        Iniciar Sesión
      </Heading>

      <Flex
        as='form'
        gap={5}
        noValidate
        direction='column'
        onSubmit={handleSubmit(onLogin)}
      >
        <FormControl>
          <FormLabel fontWeight='normal'>Cédula de Identidad </FormLabel>

          <InputGroup>
            <InputLeftElement>
              <Icon as={HiOutlineUserCircle} boxSize={5} />
            </InputLeftElement>

            <Input
              type='text'
              bgColor='#C9C9C95d'
              placeholder='09xxxxxxx'
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
              placeholder='*********'
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
          isChecked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
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
