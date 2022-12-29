import NextImage from 'next/image'
import { Flex, Text, Box, Button } from '@chakra-ui/react'
import { UserLayout } from '@/layouts'
import { useAuth } from '@/hooks'

const ExamenTerminadoPage = () => {
  const { logout } = useAuth()

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
            Gracias has terminado de rendir tu examen, ahora puedes{' '}
            <span>
              <Button variant='ghost' onClick={logout}>
                Cerrar sesión
              </Button>
            </span>
          </Text>
        </Box>
      </Flex>
    </UserLayout>
  )
}

export default ExamenTerminadoPage
