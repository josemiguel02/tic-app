import { Text, Button, Badge, chakra, Box } from '@chakra-ui/react'
import { useAuth, useQuiz } from '@/hooks'
import {
  OTHERS_NOTE_QUALIFICATION,
  TEC_NOTE_QUALIFICATION
} from '@/utils/constants'

const QuizFinishMessage = () => {
  const { logout, user } = useAuth()
  const { finalScore } = useQuiz()

  const isFinished = Boolean(user?.quizFinished)
  const QUALIFICATION = user?.qualification!
  const position = user?.position

  const NOTE_QUALIFICATION_BY_POSITION =
    position === 'OPERADORES CDA' ||
    position === 'ESCANEADOR' ||
    position === 'ASISTENTE ESCANER'
      ? TEC_NOTE_QUALIFICATION
      : OTHERS_NOTE_QUALIFICATION

  return (
    <Box fontWeight='medium'>
      Gracias has terminado de rendir tu examen.
      {isFinished ? (
        <Text>
          {QUALIFICATION >= NOTE_QUALIFICATION_BY_POSITION ? (
            <Badge colorScheme='green' fontSize='inherit'>
              APROBASTE
            </Badge>
          ) : (
            <Badge colorScheme='red' fontSize='inherit'>
              REPROBASTE
            </Badge>
          )}{' '}
          con: {QUALIFICATION}/20
        </Text>
      ) : (
        <Text>
          {finalScore >= NOTE_QUALIFICATION_BY_POSITION ? (
            <Badge colorScheme='green' fontSize='inherit'>
              APROBASTE
            </Badge>
          ) : (
            <Badge colorScheme='red' fontSize='inherit'>
              REPROBASTE
            </Badge>
          )}{' '}
          con: {finalScore}/20
        </Text>
      )}
      <Text mt={4}>
        Ahora puedes{' '}
        <chakra.span display='inline-flex'>
          <Button
            p={0}
            h={0}
            minH={0}
            variant='ghost'
            onClick={logout}
            fontSize='inherit'
            _hover={{ color: 'primary' }}
            transition='color .3s ease-in-out'
          >
            Cerrar sesión
          </Button>
        </chakra.span>
      </Text>
    </Box>
  )
}

export default QuizFinishMessage
