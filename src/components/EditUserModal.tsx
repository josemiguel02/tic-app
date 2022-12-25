import { useEffect, useState } from 'react'
import {
  SimpleGrid,
  Select,
  FormControl,
  FormLabel,
  Text
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { TextInput } from './TextInput'
import { MyModal } from './MyModal'
import { useAdmin } from '@/hooks/useAdmin'
import { quizApi } from '@/api/quiz-api'

interface EditUserModalProps {
  userId: number | null
  isOpen: boolean
  onClose: () => void
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
    reset
  } = useForm<UsuarioDTO>()

  const formId = 'addUserForm'

  const handleEditUser = async (datos: UsuarioDTO) => {
    setBtnLoading(true)

    try {
      await quizApi.post('/admin/edit-user', { id: userId, datos })
      getUsers()
      closeModal()
    } catch (error) {
      console.error(error)
    }
  }

  const closeModal = () => {
    onClose()
    reset()
    setBtnLoading(false)
  }

  useEffect(() => {
    const entries = Object.entries(defaultValues)
    entries.forEach(([key, value]) => {
      setValue(key as any, value)
    })
  }, [setValue, defaultValues])

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
          // defaultValue={nombre}
          isInvalid={!!errors.nombre}
          focusBorderColor={!!errors.nombre ? 'crimson' : 'primary'}
          {...register('nombre', {
            required: 'Este campo es requerido'
          })}
          errorMsg={!!errors.nombre ? errors.nombre?.message : undefined}
        />

        <TextInput
          label='Apellido'
          // defaultValue={apellido}
          isInvalid={!!errors.apellido}
          focusBorderColor={!!errors.apellido ? 'crimson' : 'primary'}
          {...register('apellido', {
            required: 'Este campo es requerido'
          })}
          errorMsg={!!errors.apellido ? errors.apellido?.message : undefined}
        />

        <TextInput
          label='Cédula'
          // defaultValue={cedula}
          isInvalid={!!errors.cedula}
          focusBorderColor={!!errors.cedula ? 'crimson' : 'primary'}
          {...register('cedula', {
            required: 'Este campo es requerido'
          })}
          errorMsg={!!errors.cedula ? errors.cedula?.message : undefined}
        />

        <FormControl>
          <FormLabel>Cargo</FormLabel>
          <Select
            variant='filled'
            // defaultValue={examen_id}
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
          // defaultValue={direccion}
          isInvalid={!!errors.direccion}
          focusBorderColor={!!errors.direccion ? 'crimson' : 'primary'}
          {...register('direccion', {
            required: 'Este campo es requerido'
          })}
          errorMsg={!!errors.direccion ? errors.direccion?.message : undefined}
        />

        <TextInput
          label='Celular'
          // defaultValue={celular}
          isInvalid={!!errors.celular}
          focusBorderColor={!!errors.celular ? 'crimson' : 'primary'}
          {...register('celular', {
            required: 'Este campo es requerido'
          })}
          errorMsg={!!errors.celular ? errors.celular?.message : undefined}
        />

        <TextInput
          label='Modelo'
          // defaultValue={modelo}
          isInvalid={!!errors.modelo}
          focusBorderColor={!!errors.modelo ? 'crimson' : 'primary'}
          {...register('modelo', {
            required: 'Este campo es requerido'
          })}
          errorMsg={!!errors.modelo ? errors.modelo?.message : undefined}
        />

        <FormControl>
          <FormLabel>Operadora</FormLabel>
          <Select
            variant='filled'
            // defaultValue={operadora}
            placeholder='Selecciona una operadora...'
            bgColor='#C9C9C95d'
            isInvalid={!!errors.operadora}
            focusBorderColor={!!errors.operadora ? 'crimson' : 'primary'}
            {...register('operadora', {
              required: 'Este campo es requerido'
            })}
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
