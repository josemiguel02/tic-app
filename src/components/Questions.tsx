import Router from 'next/router'
import { useState } from 'react'
import {
  Flex,
  Card,
  Heading,
  Text,
  Image,
  SimpleGrid,
  Icon,
  useDisclosure
} from '@chakra-ui/react'
import { AnimatePresence, motion, Variants } from 'framer-motion'
import { IoRadioButtonOff, IoRadioButtonOnOutline } from 'react-icons/io5'
import { useQuiz, useAuth, useUI } from '@/hooks'
import { Button, Dialog, TypingInput, TypingInputAlt } from '@/components'
import { ticApi } from '@/api/tic-api'
import { MdOutlineArrowRightAlt } from 'react-icons/md'

const variants: Variants = {
  hidden: { opacity: 0, x: 8 },
  enter: {
    opacity: 1,
    x: 0
  },
  exit: {
    opacity: 0,
    x: -8,
    transition: { duration: 0.1, ease: 'easeInOut' }
  }
}

const Questions = () => {
  let {
    questions,
    questionsSliced,
    setQuestionsSliced,
    addFinalScore,
    finalScore,
    isFinishTyping
  } = useQuiz()

  const { isOpenFinishDialog } = useUI()
  const { user } = useAuth()
  const [currentItem, setCurrentItem] = useState(1)
  const [myAnswer, setMyAnswer] = useState<number | null>(null)
  const [btnLoading, setBtnLoading] = useState(false)
  const hasMoreQuestions = currentItem <= questions.length - 1
  const { isOpen, onOpen, onClose } = useDisclosure()

  const nextQuestionTyping = () => {
    if (hasMoreQuestions) {
      // Cambiando las preguntas
      setQuestionsSliced(questions.slice(currentItem, currentItem + 1))
      setCurrentItem(currentItem + 1)

      // Limpiando la respuesta seleccionada
      setMyAnswer(null)
      return
    }

    onOpen()
  }

  const nextQuestion = () => {
    if (hasMoreQuestions) {
      // Cambiando las preguntas
      setQuestionsSliced(questions.slice(currentItem, currentItem + 1))
      setCurrentItem(currentItem + 1)

      // Limpiando la respuesta seleccionada
      setMyAnswer(null)

      // Comprobando las respuesta correcta
      if (questionsSliced[0].respuesta === myAnswer) {
        // Aumentando el score
        addFinalScore((finalScore += questionsSliced[0].puntaje))
        return
      }

      return
    }

    // Llamamos al dialog y el Dialog decide xd
    onOpen()
  }

  const handleFinish = () => {
    setBtnLoading(true)

    if (questionsSliced[0].respuesta === myAnswer) {
      // Aumentar el score
      addFinalScore((finalScore += questionsSliced[0].puntaje))
    }

    sendQualification()
  }

  const sendQualification = async () => {
    try {
      await ticApi.post('/quiz/send-qualification', {
        id: user?.id,
        finalScore
      })

      onClose()
      Router.replace('/examen-terminado')
      // Router.reload()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Flex w='full' mb={4}>
        <AnimatePresence initial={false} exitBeforeEnter>
          {questionsSliced.map(examen => (
            <Card
              key={examen.id}
              w='full'
              bgColor='#fff6'
              border='1px solid'
              borderColor='gray.200'
              p={{ base: '1.5rem', md: '2rem 2.5rem' }}
              shadow='sm'
              color='none'
              rounded='lg'
              display='flex'
              flexDir='column'
              gap={4}
              as={motion.div}
              variants={variants}
              initial='hidden'
              animate='enter'
              exit='exit'
            >
              <div>
                <Text as='small' color='gray.600' fontWeight='medium'>
                  Pregunta {currentItem} de {questions.length}
                </Text>
              </div>

              {examen.tipo === 'tipeo' ? (
                <>
                  {user?.position === 'DIGITADOR' ? (
                    <TypingInputAlt
                      text={examen.enunciado}
                      score={examen.puntaje}
                    />
                  ) : (
                    <TypingInput
                      text={examen.enunciado}
                      score={examen.puntaje}
                    />
                  )}

                  <Button
                    mt={4}
                    alignSelf='flex-end'
                    onClick={nextQuestionTyping}
                    bgColor={hasMoreQuestions ? 'primary' : 'red'}
                    text={hasMoreQuestions ? 'Siguiente' : 'Finalizar'}
                    disabled={!isFinishTyping}
                    _hover={{
                      bgColor: 'transparent',
                      color: hasMoreQuestions ? 'primary' : 'red',
                      borderColor: hasMoreQuestions ? 'primary' : 'red'
                    }}
                  />
                </>
              ) : (
                <>
                  <div>
                    <Heading
                      fontSize={{ base: 'lg', md: 'xl' }}
                      fontWeight='semibold'
                    >
                      {examen.enunciado}
                    </Heading>

                    <Text color='gray.500' fontSize='sm' mt={1}>
                      Seleccione la opción correcta:
                    </Text>
                  </div>

                  <SimpleGrid
                    gap={{ base: 8, lg: 5 }}
                    columns={{ base: 1, lg: 4 }}
                  >
                    {examen.opciones.map((opcion, optionIndex) => (
                      <Flex key={opcion.id} align='center' gap={2}>
                        <div>
                          <Icon
                            cursor='pointer'
                            onClick={() => setMyAnswer(optionIndex)}
                            boxSize={5}
                            as={
                              myAnswer === optionIndex
                                ? IoRadioButtonOnOutline
                                : IoRadioButtonOff
                            }
                            color={
                              myAnswer === optionIndex ? 'primary' : 'gray.50'
                            }
                            transition='color .3s ease-in-out'
                            _hover={{ color: 'primary' }}
                          />
                        </div>

                        <Flex
                          p={4}
                          flex={{ lg: 1 }}
                          flexDir='column'
                          gap={2}
                          justify='center'
                          align='center'
                          border='2px solid transparent'
                          rounded='md'
                          cursor='pointer'
                          onClick={() => setMyAnswer(optionIndex)}
                          transition='border-color .3s ease-in-out'
                          borderColor={
                            myAnswer === optionIndex ? 'primary' : 'gray.50'
                          }
                          _hover={{
                            borderColor: 'primary'
                          }}
                        >
                          {opcion.img && (
                            <Image
                              src={opcion.img}
                              alt='Option image'
                              boxSize={{ base: '100px', md: '150px' }}
                              objectFit='contain'
                              loading='lazy'
                            />
                          )}

                          {opcion.nombre && (
                            <Text
                              color='gray.600'
                              fontSize={{ base: 'sm', lg: 'md' }}
                            >
                              {opcion.nombre}
                            </Text>
                          )}
                        </Flex>
                      </Flex>
                    ))}
                  </SimpleGrid>

                  <Button
                    mt={4}
                    alignSelf='flex-end'
                    onClick={nextQuestion}
                    variant={hasMoreQuestions ? 'solid' : 'danger'}
                    text={hasMoreQuestions ? 'Siguiente' : 'Finalizar'}
                    rightIcon={
                      hasMoreQuestions ? (
                        <Icon as={MdOutlineArrowRightAlt} boxSize={5} />
                      ) : undefined
                    }
                    disabled={myAnswer === null}
                  />
                </>
              )}
            </Card>
          ))}
        </AnimatePresence>
      </Flex>

      <Dialog
        title='Enviar examen'
        description='¿Está seguro? No puedes deshacer esta acción después.'
        btnText='Enviar'
        btnVariant='success'
        isOpen={isOpen}
        onClose={onClose}
        btnLoading={btnLoading}
        onAction={handleFinish}
      />

      <Dialog
        title='Enviar examen'
        description='Se acabó el tiempo que tenias para realizar tu examen, ahora tienes que enviarlo.'
        btnText='Enviar'
        btnVariant='success'
        isOpen={isOpenFinishDialog}
        showBtnCancel={false}
        onAction={handleFinish}
      />
    </>
  )
}

export default Questions
