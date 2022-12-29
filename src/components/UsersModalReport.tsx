/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { Flex, FormControl, FormLabel, Select, Text } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { usePDF } from '@react-pdf/renderer'
import { MyModal, UsersReportPDF, TextInput } from '.'
import { useAdmin, useAuth } from '@/hooks'

interface UsersModalReportProps {
  isOpen: boolean
  onClose: () => void
}

const UsersModalReport: FCC<UsersModalReportProps> = ({ isOpen, onClose }) => {
  const { admin } = useAuth()
  const { users, quizzes } = useAdmin()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<ReportType>()

  const [usersReport, setUsersReport] = useState<IUsuario[]>([])
  const [usersByPostition, setUsersByPostition] = useState<IUsuario[]>([])
  const [reportDetails, setReportDetails] = useState({} as ReportType)

  const [instance, updateInstance] = usePDF({
    document: (
      <UsersReportPDF
        users={usersReport}
        usersByPostition={usersByPostition}
        reportDetails={reportDetails}
        admin={admin}
      />
    )
  })

  const position = watch('position')
  const dateFrom = watch('dateFrom')
  const dateTo = watch('dateTo')

  useEffect(() => {
    const usersPos = users.filter(user => user.cargo === position)
    setUsersByPostition(usersPos)

    const usersFiltered = usersPos.filter(user => {
      const date = new Date(user.fecha_examen!).getTime()
      const start = new Date(`${dateFrom}T00:00`).getTime()
      const end = new Date(`${dateTo}T00:00`).getTime()

      if (date >= start && date <= end) {
        return user
      }
    })

    setUsersReport(usersFiltered)
    setReportDetails({ position, dateFrom, dateTo })
  }, [position, dateFrom, dateTo])

  useEffect(() => {
    updateInstance()
  }, [usersReport, usersByPostition, admin, reportDetails])

  const handleGenerateReport = () => {
    navigateToReport()
  }

  const navigateToReport = () => {
    window.open(instance.url!, '_blank')
  }

  const closeReportModal = () => {
    onClose()
    reset()
  }

  const formId = 'reportForm'

  return (
    <MyModal
      isOpen={isOpen}
      title='Generar reporte'
      btnText='Generar'
      btnVariant='danger'
      onClose={closeReportModal}
      formID={formId}
      btnLoading={false}
      size='md'
    >
      <Flex
        id={formId}
        as='form'
        flexDir='column'
        gap={5}
        onSubmit={handleSubmit(handleGenerateReport)}
      >
        <FormControl>
          <FormLabel>Cargo</FormLabel>
          <Select
            variant='filled'
            placeholder='Selecciona un cargo...'
            bgColor='#C9C9C95d'
            isInvalid={!!errors.position}
            focusBorderColor={!!errors.position ? 'crimson' : 'primary'}
            {...register('position', {
              required: 'Este campo es requerido'
            })}
          >
            {quizzes.map(({ id, cargo }) => (
              <option key={id} value={cargo}>
                {cargo.toUpperCase()}
              </option>
            ))}
          </Select>

          {!!errors.position && (
            <Text as='small' variant='textError'>
              {errors.position?.message}
            </Text>
          )}
        </FormControl>

        <TextInput
          type='date'
          label='Fecha desde'
          isInvalid={!!errors.dateFrom}
          focusBorderColor={!!errors.dateFrom ? 'crimson' : 'primary'}
          {...register('dateFrom', {
            required: 'Este campo es requerido'
          })}
          errorMsg={!!errors.dateFrom ? errors.dateFrom?.message : undefined}
        />

        <TextInput
          type='date'
          label='Hasta'
          isInvalid={!!errors.dateTo}
          focusBorderColor={!!errors.dateTo ? 'crimson' : 'primary'}
          {...register('dateTo', {
            required: 'Este campo es requerido'
          })}
          errorMsg={!!errors.dateTo ? errors.dateTo?.message : undefined}
        />

        {/* <FormControl>
        <FormLabel>Formato</FormLabel>
        <Select
          variant='filled'
          placeholder='Selecciona un formato...'
          bgColor='#C9C9C95d'
        >
          {['Excel', 'PDF'].map((format) => (
            <option key={format} value={format}>
              {format}
            </option>
          ))}
        </Select>
      </FormControl> */}
      </Flex>
    </MyModal>
  )
}

export default UsersModalReport
