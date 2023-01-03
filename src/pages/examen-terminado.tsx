import NextImage from 'next/image'
import { Flex, Text, Box, Button, chakra, Badge } from '@chakra-ui/react'
import { UserLayout } from '@/layouts'
import { useAuth, useQuiz } from '@/hooks'
import { NOTE_QUALIFICATION } from '@/utils/constants'

const ExamenTerminadoPage = () => {
  const { logout } = useAuth()
  const { finalScore } = useQuiz()

  return (
    <UserLayout title='Examen terminado'>
      <Flex flexDir='column' gap={5} mt={20} align='center'>
        <NextImage
          src='/static/img/quiz-finished.svg'
          width={300}
          height={300}
          alt='Quiz finished image'
          style={{ objectFit: 'cover' }}
        />

        <Box maxW='lg' textAlign='center'>
          <Text fontSize='lg' fontWeight='medium'>
            Gracias has terminado de rendir tu examen.
            <Text>
              {finalScore >= NOTE_QUALIFICATION ? (
                <Badge colorScheme='green' fontSize='inherit'>
                  APROBASTE
                </Badge>
              ) : (
                <Badge colorScheme='red' fontSize='inherit'>
                  REPROBASTE
                </Badge>
              )}
              con: {finalScore}
            </Text>
            <Text>
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
          </Text>
        </Box>
      </Flex>
    </UserLayout>
  )
}

export default ExamenTerminadoPage
