import { useState } from 'react'
import {
  SimpleGrid,
  Select,
  FormControl,
  FormLabel,
  Text
} from '@chakra-ui/react'
import { TextInput } from './TextInput'
import { MyModal } from './MyModal'
import { useAdmin } from '@/hooks'
import { useForm } from 'react-hook-form'
import { ticApi } from '@/api/tic-api'

interface AddUserModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddUserModal: FCC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const [btnLoading, setBtnLoading] = useState(false)
  const { quizzes, getUsers } = useAdmin()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UsuarioDTO>()

  const formId = 'addUserForm'

  const closeModal = () => {
    onClose()
    reset()
    setBtnLoading(false)
  }

  const handleAddUser = async (data: UsuarioDTO) => {
    setBtnLoading(true)

    try {
      await ticApi.post('/admin/add-user', data)
      getUsers()
      closeModal()
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  return (
    <MyModal
      title='Agregar nuevo usuario'
      isOpen={isOpen}
      onClose={closeModal}
      formID={formId}
      btnLoading={btnLoading}
    >
      <SimpleGrid
        id={formId}
        as='form'
        gap={5}
        columns={{ base: 1, sm: 2 }}
        row={{ sm: 4 }}
        onSubmit={handleSubmit(handleAddUser)}
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
          {...register('cedula', {
            required: 'Este campo es requerido'
          })}
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
          {...register('direccion', {
            required: 'Este campo es requerido'
          })}
          errorMsg={!!errors.direccion ? errors.direccion?.message : undefined}
        />

        <TextInput
          label='Celular'
          isInvalid={!!errors.celular}
          focusBorderColor={!!errors.celular ? 'crimson' : 'primary'}
          {...register('celular', {
            required: 'Este campo es requerido'
          })}
          errorMsg={!!errors.celular ? errors.celular?.message : undefined}
        />

        <TextInput
          label='Modelo'
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
