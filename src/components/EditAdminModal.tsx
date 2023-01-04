import { useState, useEffect } from 'react'
import {
  SimpleGrid,
  Select,
  FormControl,
  FormLabel,
  Text,
  useToast
} from '@chakra-ui/react'
import { useForm, useController } from 'react-hook-form'
import { TextInput, MyAlert, MyModal } from '.'
import { useAdmin } from '@/hooks'
import { ticApi } from '@/api/tic-api'

interface EditAdminModalProps {
  isOpen: boolean
  onClose: () => void
  adminId: number
  editValues: Partial<AdminDTO>
}

export const EditAdminModal: FCC<EditAdminModalProps> = ({
  isOpen,
  onClose,
  adminId,
  editValues
}) => {
  const { adminsRoles, getAdmins } = useAdmin()
  const [btnLoading, setBtnLoading] = useState(false)
  const [error, setError] = useState({
    show: false,
    msg: ''
  })
  const toast = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control
  } = useForm<AdminDTO>()
  const formId = 'editAdminForm'

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

  const closeModal = () => {
    onClose()
    reset()
    setBtnLoading(false)
    setError({
      show: false,
      msg: ''
    })
  }

  const handleEditAdmin = async (data: AdminDTO) => {
    setBtnLoading(true)

    try {
      const res = await ticApi.post('/admin/edit-admin', { id: adminId, data })
      getAdmins()
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

  useEffect(() => {
    const entries = Object.entries(editValues)
    entries.forEach(([key, value]) => {
      setValue(key as any, value)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editValues])

  return (
    <MyModal
      title='Editar administrador'
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
        onSubmit={handleSubmit(handleEditAdmin)}
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
          <FormLabel>Rol</FormLabel>
          <Select
            variant='filled'
            placeholder='Selecciona un cargo...'
            bgColor='#C9C9C95d'
            isInvalid={!!errors.rol_id}
            focusBorderColor={!!errors.rol_id ? 'crimson' : 'primary'}
            {...register('rol_id', {
              required: 'Este campo es requerido',
              valueAsNumber: true
            })}
          >
            {adminsRoles.map(({ id, rol }) => (
              <option key={id} value={id}>
                {rol}
              </option>
            ))}
          </Select>

          {!!errors.rol_id && (
            <Text as='small' variant='textError'>
              {errors.rol_id?.message}
            </Text>
          )}
        </FormControl>
      </SimpleGrid>
    </MyModal>
  )
}
