import NextImage from 'next/image'
import { Flex, Text, Box, Button, chakra } from '@chakra-ui/react'
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
      </Flex>
    </UserLayout>
  )
}

export default ExamenTerminadoPage
