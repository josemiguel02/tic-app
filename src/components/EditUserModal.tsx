import { useEffect, useState } from 'react'
import {
  SimpleGrid,
  Select,
  FormControl,
  FormLabel,
  Text,
  useToast
} from '@chakra-ui/react'
import { useForm, useController } from 'react-hook-form'
import { TextInput } from './TextInput'
import { MyModal } from './MyModal'
import { useAdmin } from '@/hooks'
import { ticApi } from '@/api/tic-api'
import { MyAlert } from '.'

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  userId: number | null
  defaultValues: Partial<UsuarioDTO>
}

export const EditUserModal: FCC<EditUserModalProps> = ({
  userId,
  isOpen,
  onClose,
  defaultValues
}) => {
  const [btnLoading, setBtnLoading] = useState(false)
  const { quizzes, getUsers } = useAdmin()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control
  } = useForm<UsuarioDTO>()

  const [error, setError] = useState({
    show: false,
    msg: ''
  })
  const toast = useToast()
  const formId = 'addUserForm'

  const { field: identificationField } = useController({
    control,
    name: 'cedula',
    rules: {
      required: 'Este campo es requerido',
      minLength: {
        value: 10,
        message: 'Mínimo 10 caracteres'
      }
    }
  })

  const { field: phoneNumberField } = useController({
    control,
    name: 'celular',
    rules: {
      required: 'Este campo es requerido',
      minLength: {
        value: 10,
        message: 'Mínimo 10 caracteres'
      }
    }
  })

  const handleEditUser = async (data: UsuarioDTO) => {
    setBtnLoading(true)

    try {
      const res = await ticApi.post('/admin/edit-user', { id: userId, data })
      getUsers()
      closeModal()
      toast({
        title: res.data.msg,
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      })
    } catch (e: any) {
      setError({
        show: true,
        msg: e.response.data
      })
      setBtnLoading(false)
      console.error(e)
    }
  }

  const closeModal = () => {
    onClose()
    reset()
    setBtnLoading(false)
    setError({
      show: false,
      msg: ''
    })
  }

  useEffect(() => {
    const entries = Object.entries(defaultValues)
    entries.forEach(([key, value]) => {
      setValue(key as any, value)
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues])

  return (
    <MyModal
      title='Editar usuario'
      isOpen={isOpen}
      onClose={closeModal}
      formID={formId}
      btnLoading={btnLoading}
      btnText='Editar'
      btnVariant='warning'
    >
      <MyAlert
        show={error.show}
        onClose={() => setError({ ...error, show: false })}
        description={error.msg}
      />

      <SimpleGrid
        id={formId}
        as='form'
        gap={5}
        columns={{ base: 1, sm: 2 }}
        row={{ sm: 4 }}
        onSubmit={handleSubmit(handleEditUser)}
      >
        <TextInput
          label='Nombre'
          isInvalid={!!errors.nombre}
          focusBorderColor={!!errors.nombre ? 'crimson' : 'primary'}
          {...register('nombre', {
            required: 'Este campo es requerido'
          })}
          errorMsg={!!errors.nombre ? errors.nombre?.message : undefined}
        />

        <TextInput
          label='Apellido'
          isInvalid={!!errors.apellido}
          focusBorderColor={!!errors.apellido ? 'crimson' : 'primary'}
          {...register('apellido', {
            required: 'Este campo es requerido'
          })}
          errorMsg={!!errors.apellido ? errors.apellido?.message : undefined}
        />

        <TextInput
          label='Cédula'
          isInvalid={!!errors.cedula}
          focusBorderColor={!!errors.cedula ? 'crimson' : 'primary'}
          {...identificationField}
          value={identificationField.value || ''}
          onChange={e => {
            identificationField.onChange(e.target.value.replace(/[^0-9]/gi, ''))
          }}
          errorMsg={!!errors.cedula ? errors.cedula?.message : undefined}
        />

        <FormControl>
          <FormLabel>Cargo</FormLabel>
          <Select
            variant='filled'
            placeholder='Selecciona un cargo...'
            bgColor='#C9C9C95d'
            isInvalid={!!errors.examen_id}
            focusBorderColor={!!errors.examen_id ? 'crimson' : 'primary'}
            {...register('examen_id', {
              required: 'Este campo es requerido',
              valueAsNumber: true
            })}
          >
            {quizzes.map(({ id, cargo }) => (
              <option key={id} value={id}>
                {cargo.toUpperCase()}
              </option>
            ))}
          </Select>

          {!!errors.examen_id && (
            <Text as='small' variant='textError'>
              {errors.examen_id?.message}
            </Text>
          )}
        </FormControl>

        <TextInput
          label='Dirección'
          isInvalid={!!errors.direccion}
          focusBorderColor={!!errors.direccion ? 'crimson' : 'primary'}
          {...register('direccion')}
          errorMsg={!!errors.direccion ? errors.direccion?.message : undefined}
        />

        <TextInput
          label='Celular'
          isInvalid={!!errors.celular}
          focusBorderColor={!!errors.celular ? 'crimson' : 'primary'}
          {...phoneNumberField}
          value={phoneNumberField.value || ''}
          onChange={e => {
            phoneNumberField.onChange(e.target.value.replace(/[^0-9]/gi, ''))
          }}
          errorMsg={!!errors.celular ? errors.celular?.message : undefined}
        />

        <TextInput
          label='Modelo'
          isInvalid={!!errors.modelo}
          focusBorderColor={!!errors.modelo ? 'crimson' : 'primary'}
          {...register('modelo')}
          errorMsg={!!errors.modelo ? errors.modelo?.message : undefined}
        />

        <FormControl>
          <FormLabel>Operadora</FormLabel>
          <Select
            variant='filled'
            placeholder='Selecciona una operadora...'
            bgColor='#C9C9C95d'
            isInvalid={!!errors.operadora}
            focusBorderColor={!!errors.operadora ? 'crimson' : 'primary'}
            {...register('operadora')}
          >
            {['CLARO', 'MOVISTAR', 'TUENTI', 'CNT'].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>

          {!!errors.operadora && (
            <Text as='small' variant='textError'>
              {errors.operadora?.message}
            </Text>
          )}
        </FormControl>
      </SimpleGrid>
    </MyModal>
  )
}
