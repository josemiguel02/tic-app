
import { useEffect, useState } from 'react'
import {
  useForm,
  useFieldArray,
  Control,
  UseFormRegister,
  UseFormWatch,
  FormState,
  useController,
  UseFormResetField
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
  chakra
} from '@chakra-ui/react'
import { MyModal } from './MyModal'
import { nanoid } from 'nanoid'
import { MyInput } from './MyInput'
import { TextInput } from './TextInput'
import { ticApi } from '@/api/tic-api'
import { useAdmin } from '@/hooks'
import { BsFillImageFill } from 'react-icons/bs'

interface AddQuizModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddQuizModal: FCC<AddQuizModalProps> = ({ isOpen, onClose }) => {
  const [btnLoading, setBtnLoading] = useState(false)
  const { getQuizzes } = useAdmin()
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState,
    reset,
    resetField
  } = useForm<ExamenDTO>({
    defaultValues: {
      preguntas: [
        {
          id: nanoid(15),
          // enunciado: undefined,
          opciones: [{ id: nanoid(15) }],
          respuesta: undefined
          // puntaje: 0
        }
      ]
    }
  })

  const { errors, isDirty, dirtyFields, isSubmitted } = formState
  const formId = 'addQuizForm'

  // console.log({ isDirty, dirtyFields })

  const { fields, append, remove } = useFieldArray({
    name: 'preguntas',
    control
  })

  const closeModal = () => {
    onClose()
    reset(
      {
        preguntas: [
          {
            id: nanoid(15),
            opciones: [{ id: nanoid(15) }],
            respuesta: undefined
          }
        ]
      },
      { keepDirtyValues: false, keepDirty: false, keepDefaultValues: false }
      // reset({}, { keepDefaultValues: true, keepDirtyValues: false })
    )

    setBtnLoading(false)
  }

  const handleAddQuiz = async (data: ExamenDTO) => {
    // console.log(data)
    // TODO: Arreglar el state que se queda dirty en los campos de Options.
    setBtnLoading(true)
    const datos = { ...data, preguntas: JSON.stringify(data.preguntas) }

    try {
      await ticApi.post('/admin/add-quiz', datos)
      getQuizzes()
      closeModal()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <MyModal
      title='Agregar nuevo examen'
      isOpen={isOpen}
      onClose={closeModal}
      formID={formId}
      btnLoading={btnLoading}
    >
      <Flex
        id={formId}
        as='form'
        gap={5}
        flexDir='column'
        onSubmit={handleSubmit(handleAddQuiz)}
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
              opciones: [{ id: nanoid(15) }],
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
    </MyModal>
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
  control: Control<ExamenDTO>
  register: UseFormRegister<ExamenDTO>
  formState: FormState<ExamenDTO>
}

const Options: FCC<OptionsProps> = ({
  index,
  control,
  register,
  formState: { errors }
}) => {
  const [showOptionImg, setShowOptionImg] = useState<number[]>([])
  const { fields, append } = useFieldArray({
    name: `preguntas.${index}.opciones`,
    control
  })

  const { field: radioField, formState: radioState } = useController({
    name: `preguntas.${index}.respuesta`,
    control,
    rules: { required: 'Escoge una opción como respuesta correcta' }
  })

  return (
    <Flex flexDir='column' gap={2}>
      {fields.map((option, optionIndex) => (
        <Flex key={option.id} gap={4}>
          {/* <input
            type='radio'
            {...radioField}
            value={optionIndex}
            onChange={(e) => {
              console.log(e.target.value)
              radioField.onChange(Number(e.target.value))
            }}
          /> */}

          <div>
            <chakra.input
              type='radio'
              {...radioField}
              value={optionIndex}
              onChange={(e) => {
                console.log(e.target.value)
                radioField.onChange(Number(e.target.value))
              }}
              appearance='none'
              boxSize={4}
              mt={3}
              border='2px solid'
              borderColor='gray.500'
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
                transform: 'scale(0)',
                transition: 'transform 250ms ease-in-out'
              }}
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

          <div>
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
                !!errors.preguntas?.[index]?.opciones?.[optionIndex]?.nombre ? (
                  <Text as='small' variant='textError'>
                    {
                      errors.preguntas?.[index]?.opciones?.[optionIndex]?.nombre
                        ?.message
                    }
                  </Text>
                ) : undefined
              }
            />
          </div>

          {showOptionImg.includes(optionIndex) ? (
            <div>
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
            </div>
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
        {!!radioState.errors.preguntas?.[index]?.respuesta && (
          <Text as='small' variant='textError'>
            {radioState.errors.preguntas?.[index]?.respuesta?.message}
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
