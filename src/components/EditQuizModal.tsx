import { useEffect, useState, Dispatch, SetStateAction } from 'react'
import {
  FormProvider,
  useForm,
  useFieldArray,
  Control,
  UseFormRegister,
  UseFormWatch,
  FormState,
  useController,
  UseFormResetField,
  useFormContext
} from 'react-hook-form'
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Text,
  Select,
  Icon,
  IconButton,
  chakra,
  Box
} from '@chakra-ui/react'
import { MyModal } from './MyModal'
import { nanoid } from 'nanoid'
import { MyInput } from './MyInput'
import { TextInput } from './TextInput'
import { BsFillImageFill } from 'react-icons/bs'
import { MyAlert } from '.'
import { useAdmin } from '@/hooks'
import { ticApi } from '@/api/tic-api'
import { IoTextOutline } from 'react-icons/io5'
import { MdClose } from 'react-icons/md'

interface EditQuizModalProps {
  isOpen: boolean
  onClose: () => void
  quizId: number
  quizValues: Partial<ExamenDTO>
}

export const EditQuizModal: FCC<EditQuizModalProps> = ({
  isOpen,
  onClose,
  quizId,
  quizValues
}) => {
  const [btnLoading, setBtnLoading] = useState(false)
  const [error, setError] = useState({
    show: false,
    msg: ''
  })

  const methods = useForm<ExamenDTO>({
    defaultValues: {
      cargo: '',
      preguntas: [{ id: nanoid(15), puntaje: 0 }]
    }
  })

  useEffect(() => {
    const entries = Object.entries(quizValues)
    entries.forEach(([key, value]) => {
      methods.setValue(key as any, value)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizValues])

  const closeModal = () => {
    onClose()
    methods.reset()
    setBtnLoading(false)
    setError({
      show: false,
      msg: ''
    })
  }

  const formId = 'editQuizForm'

  return (
    <MyModal
      title='Editar examen'
      isOpen={isOpen}
      onClose={closeModal}
      formID={formId}
      btnLoading={btnLoading}
      btnText='Editar'
      btnVariant='warning'
      size={{ base: 'full', sm: '2xl' }}
    >
      <FormProvider {...methods}>
        <QuizForm
          error={error}
          setError={setError}
          closeModal={closeModal}
          setBtnLoading={setBtnLoading}
          quizId={quizId}
        />
      </FormProvider>
    </MyModal>
  )
}

interface QuizFormProps {
  error: {
    show: boolean
    msg: string
  }
  setError: Dispatch<
    SetStateAction<{
      show: boolean
      msg: string
    }>
  >
  closeModal: () => void
  setBtnLoading: Dispatch<SetStateAction<boolean>>
  quizId: number
}

const QuizForm: FCC<QuizFormProps> = ({
  error,
  setError,
  closeModal,
  setBtnLoading,
  quizId
}) => {
  const { register, handleSubmit, formState, watch, control, resetField } =
    useFormContext<ExamenDTO>()
  const { fields, append } = useFieldArray({
    control,
    name: 'preguntas'
  })

  const { errors } = formState
  const formId = 'editQuizForm'

  const { getQuizzes } = useAdmin()

  const handleEditQuiz = async (data: ExamenDTO) => {
    setBtnLoading(true)
    const datos = { ...data, preguntas: JSON.stringify(data.preguntas) }

    try {
      await ticApi.post('/admin/edit-quiz', { id: quizId, data: datos })
      getQuizzes()
      closeModal()
    } catch (e: any) {
      setError({
        show: true,
        msg: e.response.data
      })
      setBtnLoading(false)
      console.error(e)
    }
  }

  return (
    <>
      <MyAlert
        show={error.show}
        onClose={() => setError({ ...error, show: false })}
        description={error.msg}
      />

      <Flex
        id={formId}
        as='form'
        gap={5}
        flexDir='column'
        onSubmit={handleSubmit(handleEditQuiz)}
      >
        <TextInput
          label='Cargo'
          isInvalid={!!errors.cargo}
          focusBorderColor={!!errors.cargo ? 'crimson' : 'primary'}
          {...register('cargo', {
            required: 'Este campo es requerido'
          })}
          errorMsg={!!errors.cargo ? errors.cargo.message : undefined}
        />

        {/* Preguntas */}
        <Flex flexDir='column' gap={5}>
          {fields.map(({ id }, i) => (
            <QuestionItem
              key={id}
              i={i}
              {...{
                control,
                register,
                watch,
                formState,
                resetField
              }}
            />
          ))}
        </Flex>

        <Button
          size='sm'
          variant='outline'
          borderColor='blackAlpha.300'
          alignSelf='start'
          onClick={() =>
            append({
              id: nanoid(15),
              enunciado: '',
              opciones: [],
              puntaje: 0,
              respuesta: undefined,
              tipo: '' as any
            })
          }
          _hover={{
            bgColor: 'blackAlpha.200'
          }}
        >
          Agregar preguntas
        </Button>
      </Flex>
    </>
  )
}

interface QuestionsArrayProps {
  i: number
  control: Control<ExamenDTO>
  register: UseFormRegister<ExamenDTO>
  watch: UseFormWatch<ExamenDTO>
  formState: FormState<ExamenDTO>
  resetField: UseFormResetField<ExamenDTO>
}

const QuestionItem: FCC<QuestionsArrayProps> = ({
  i,
  control,
  register,
  watch,
  formState,
  resetField
}) => {
  const { errors } = formState
  const questionType = watch(`preguntas.${i}.tipo`)

  useEffect(() => {
    if (questionType === 'tipeo') {
      resetField(`preguntas.${i}.opciones`, { defaultValue: [] })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionType])

  return (
    <Flex flexDir='column' gap={3}>
      <Text fontSize='lg' fontWeight='semibold'>
        Pregunta {i + 1}
      </Text>

      <FormControl>
        <FormLabel>Tipo</FormLabel>

        <Select
          variant='filled'
          placeholder='Selecciona un tipo...'
          bgColor='#C9C9C95d'
          isInvalid={!!errors.preguntas?.[i]?.tipo}
          focusBorderColor={
            !!errors.preguntas?.[i]?.tipo ? 'crimson' : 'primary'
          }
          {...register(`preguntas.${i}.tipo`, {
            required: 'Este campo es requerido'
          })}
        >
          <option value='seleccion'>Selección</option>
          <option value='tipeo'>Tipeo</option>
        </Select>

        {!!errors.preguntas?.[i]?.tipo && (
          <Text as='small' variant='textError'>
            {errors.preguntas?.[i]?.tipo?.message}
          </Text>
        )}
      </FormControl>

      {watch(`preguntas.${i}.tipo`) === 'tipeo' && (
        <TextInput
          label='Texto'
          isInvalid={!!errors.preguntas?.[i]?.enunciado}
          focusBorderColor={
            !!errors.preguntas?.[i]?.enunciado ? 'crimson' : 'primary'
          }
          {...register(`preguntas.${i}.enunciado`, {
            required: 'Este campo es requerido'
          })}
          errorMsg={
            !!errors.preguntas?.[i]?.enunciado
              ? errors.preguntas?.[i]?.enunciado?.message
              : undefined
          }
        />
      )}

      {watch(`preguntas.${i}.tipo`) === 'seleccion' && (
        <>
          <TextInput
            label='Enunciado'
            isInvalid={!!errors.preguntas?.[i]?.enunciado}
            focusBorderColor={
              !!errors.preguntas?.[i]?.enunciado ? 'crimson' : 'primary'
            }
            {...register(`preguntas.${i}.enunciado`, {
              required: 'Este campo es requerido'
            })}
            errorMsg={
              !!errors.preguntas?.[i]?.enunciado
                ? errors.preguntas?.[i]?.enunciado?.message
                : undefined
            }
          />

          <FormControl>
            <FormLabel>Opciones</FormLabel>

            <Options index={i} {...{ control, register, formState }} />
          </FormControl>
        </>
      )}

      <TextInput
        label='Puntaje'
        isInvalid={!!errors.preguntas?.[i]?.puntaje}
        focusBorderColor={
          !!errors.preguntas?.[i]?.puntaje ? 'crimson' : 'primary'
        }
        {...register(`preguntas.${i}.puntaje`, {
          required: 'Este campo es requerido',
          valueAsNumber: true
        })}
        errorMsg={
          !!errors.preguntas?.[i]?.puntaje
            ? errors.preguntas?.[i]?.puntaje?.message
            : undefined
        }
      />
    </Flex>
  )
}

interface OptionsProps {
  index: number
  register: UseFormRegister<ExamenDTO>
  formState: FormState<ExamenDTO>
}

const Options: FCC<OptionsProps> = ({
  index,
  register,
  formState: { errors }
}) => {
  const [showOptionText, setShowOptionText] = useState<number[]>([])
  const [showOptionImg, setShowOptionImg] = useState<number[]>([])

  let { control, watch } = useFormContext<ExamenDTO>()

  const { fields, append } = useFieldArray({
    control,
    name: `preguntas.${index}.opciones`
  })

  const { field: radioField } = useController({
    name: `preguntas.${index}.respuesta`,
    control,
    rules: { required: 'Escoge una opción como respuesta correcta' }
  })

  const currentAnswerValue = watch(`preguntas.${index}.respuesta`)

  return (
    <Flex flexDir='column' gap={2}>
      {fields.map((option, optionIndex) => (
        <Flex key={option.id} gap={4}>
          <div>
            <chakra.input
              type='radio'
              {...radioField}
              value={optionIndex}
              onChange={e => {
                console.log(e.target.value)
                radioField.onChange(Number(e.target.value))
              }}
              appearance='none'
              boxSize={4}
              mt={3}
              border='2px solid'
              rounded='full'
              display='inline-grid'
              placeItems='center'
              cursor='pointer'
              _before={{
                content: '""',
                boxSize: 2,
                display: 'inline-block',
                bg: 'primary',
                rounded: 'full',
                transform:
                  currentAnswerValue === optionIndex ? 'scale(1)' : 'scale(0)',
                transition: 'transform 250ms ease-in-out'
              }}
              borderColor={
                currentAnswerValue !== undefined &&
                currentAnswerValue === optionIndex
                  ? 'primary'
                  : 'gray.500'
              }
              sx={{
                '&:checked::before': {
                  transform: 'scale(1)'
                },
                '&:checked': {
                  borderColor: 'primary'
                }
              }}
            />
          </div>

          {showOptionText.includes(optionIndex) ||
            watch(`preguntas.${index}.opciones.${optionIndex}.nombre`) ? (
              <Box pos='relative'>
                <MyInput
                  placeholder={`Opción ${optionIndex + 1}`}
                  isInvalid={
                    !!errors.preguntas?.[index]?.opciones?.[optionIndex]?.nombre
                  }
                  focusBorderColor={
                    !!errors.preguntas?.[index]?.opciones?.[optionIndex]?.nombre
                      ? 'crimson'
                      : 'primary'
                  }
                  {...register(
                    `preguntas.${index}.opciones.${optionIndex}.nombre`,
                    {
                      required: 'Este campo es requerido'
                    }
                  )}
                  error={
                    !!errors.preguntas?.[index]?.opciones?.[optionIndex]
                      ?.nombre ? (
                        <Text as='small' variant='textError'>
                          {
                            errors.preguntas?.[index]?.opciones?.[optionIndex]
                              ?.nombre?.message
                          }
                        </Text>
                      ) : undefined
                  }
                />

                <IconButton
                  pos='absolute'
                  top='50%'
                  right={2}
                  transform='translateY(-50%)'
                  size='sm'
                  variant='ghost'
                  rounded='full'
                  aria-label='remove option text'
                  title='Eliminar texto'
                  icon={<Icon as={MdClose} boxSize={4} color='primary' />}
                  onClick={() =>
                    setShowOptionText([])
                  }
                  _hover={{
                    bgColor: 'whiteAlpha.200'
                  }}
                />
              </Box>
            ) : (
              <IconButton
                size='sm'
                variant='ghost'
                rounded='full'
                aria-label='add option text'
                title='Agregar texto'
                icon={<Icon as={IoTextOutline} boxSize={5} />}
                onClick={() =>
                  setShowOptionText([...showOptionText, optionIndex])
                }
              />
            )}

          {showOptionImg.includes(optionIndex) ||
            watch(`preguntas.${index}.opciones.${optionIndex}.img`) ? (
              <Box pos='relative'>
                <MyInput
                  placeholder='URL de la imagen'
                  isInvalid={
                    !!errors.preguntas?.[index]?.opciones?.[optionIndex]?.img
                  }
                  focusBorderColor={
                    !!errors.preguntas?.[index]?.opciones?.[optionIndex]?.img
                      ? 'crimson'
                      : 'primary'
                  }
                  {...register(`preguntas.${index}.opciones.${optionIndex}.img`, {
                    required: 'Este campo es requerido'
                  })}
                  error={
                    !!errors.preguntas?.[index]?.opciones?.[optionIndex]?.img ? (
                      <Text as='small' variant='textError'>
                        {
                          errors.preguntas?.[index]?.opciones?.[optionIndex]?.img
                            ?.message
                        }
                      </Text>
                    ) : undefined
                  }
                />

                <IconButton
                  pos='absolute'
                  top='50%'
                  right={2}
                  transform='translateY(-50%)'
                  size='sm'
                  variant='ghost'
                  rounded='full'
                  aria-label='remove option img'
                  title='Eliminar imagen'
                  icon={<Icon as={MdClose} boxSize={4} color='primary' />}
                  onClick={() =>
                    setShowOptionImg([])
                  }
                  _hover={{
                    bgColor: 'whiteAlpha.200'
                  }}
                />
              </Box>
            ) : (
              <IconButton
                size='sm'
                variant='ghost'
                rounded='full'
                aria-label='add option image'
                title='Agregar imagen'
                icon={<Icon as={BsFillImageFill} boxSize={5} />}
                onClick={() => setShowOptionImg([...showOptionImg, optionIndex])}
              />
            )}
        </Flex>
      ))}

      <Flex flexDir='column' gap={2} mt={2}>
        {!!errors.preguntas?.[index]?.respuesta && (
          <Text as='small' variant='textError'>
            {errors.preguntas?.[index]?.respuesta?.message}
          </Text>
        )}

        <Button
          size='xs'
          variant='outline'
          borderColor='blackAlpha.300'
          alignSelf='start'
          onClick={() =>
            append({
              id: nanoid(15)
            })
          }
          _hover={{
            bgColor: 'blackAlpha.200'
          }}
        >
          Agregar opciones
        </Button>
      </Flex>
    </Flex>
  )
}
