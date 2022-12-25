import { GetServerSideProps } from 'next'
import NextImage from 'next/image'
import { Flex, Text, Box, Button } from '@chakra-ui/react'
import { verifyToken } from '@/lib/jwt'
import { Usuario } from '@/database'
import { isAdmin } from '@/utils/check-user-type'
import { UserLayout } from '@/layouts'
import { useAuth } from '@/hooks/useAuth'

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const token = req.cookies['auth-token']

//   if (token) {
//     try {
//       const user = await verifyToken(token)
//       // const { examen_terminado } = await new Usuario().findByID(user.id)

//       if (isAdmin(user)) {
//         return {
//           redirect: {
//             destination: '/dashboard',
//             permanent: false
//           }
//         }
//       }

//       // if (!Boolean(examen_terminado)) {
//       //   return {
//       //     redirect: {
//       //       destination: '/inicio',
//       //       permanent: false
//       //     }
//       //   }
//       // }
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   return {
//     props: {}
//   }
// }

// export { getServerSideProps } from '@/utils/user-middleware'

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
            Gracias has terminado de dar tu examen, ahora puedes{' '}
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
