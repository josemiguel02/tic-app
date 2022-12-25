import NextLink from 'next/link'
import { Flex, Heading, Text, Card, Badge, Box, Icon } from '@chakra-ui/react'
import { AdminLayout } from '@/layouts'
import { useAdmin } from '@/hooks/useAdmin'
import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai'
import { MdOutlineStickyNote2 } from 'react-icons/md'

export { getServerSideProps } from '@/utils/admin-middleware'

const DashboardPage = () => {
  const { users, quizzes } = useAdmin()

  const usersQuizPending = users.filter((user) => {
    if (!Boolean(user.examen_terminado) && !user.calificacion) {
      return user
    }
  }).length

  const usersApproved = users.filter((user) => {
    const qualification = user.calificacion ?? 0
    return qualification >= 7
  }).length

  const usersFailed = users.filter((user) => {
    if (user.calificacion || user.examen_terminado) {
      return user.calificacion! < 7
    }
  }).length

  return (
    <AdminLayout title='Dashboard'>
      <Heading as='h3'  fontWeight='medium' fontSize='2rem'>
        Detalles
      </Heading>

      <Flex flexDir='column' gap={8} mt={10}>
        <Card
          as={NextLink}
          href='/dashboard/usuarios'
          bgColor='white'
          px={8}
          py={10}
          w='400px'
          gap={4}
          shadow='lg'
          rounded='lg'
          border='2px solid transparent'
          transition='all .4s ease-in-out'
          cursor='pointer'
          _hover={{
            borderColor: 'primary',
            boxShadow: '0 10px 15px -3px #293BDD7d'
          }}
        >
          <Flex gap={2} align='center'>
            <div>
              <Icon as={AiOutlineUser} boxSize={9} />
            </div>

            <Heading as='h3' fontWeight='medium' fontSize='2rem'>
              Usuarios
            </Heading>
          </Flex>
          {/* <Text color='gray.600'>{users.length} usuarios</Text> */}

          <Flex flexDir='column' color='gray.600' fontSize='sm' gap={1}>
            <Text>
              Aprobados:{' '}
              <Badge colorScheme='green' fontSize='sm' ml={1}>
                {usersApproved}
              </Badge>
            </Text>
            <Text>
              Reprobados:{' '}
              <Badge colorScheme='red' fontSize='sm' ml={1}>
                {usersFailed}
              </Badge>
            </Text>
            <Text>
              Pendientes:{' '}
              <Badge colorScheme='yellow' fontSize='sm' ml={1}>
                {usersQuizPending}
              </Badge>
            </Text>
          </Flex>
        </Card>

        <Card
          as={NextLink}
          href='/dashboard/examenes'
          bgColor='white'
          px={8}
          py={10}
          w='400px'
          minH='215px'
          justify='center'
          gap={2}
          shadow='lg'
          rounded='lg'
          border='2px solid transparent'
          transition='all .4s ease-in-out'
          cursor='pointer'
          _hover={{
            borderColor: 'primary',
            boxShadow: '0 10px 15px -3px #293BDD7d'
          }}
        >
          <Heading as='h3' fontWeight='medium' fontSize='2rem'>
            Exámenes
          </Heading>
          <Text color='gray.600'>{quizzes.length} exámenes</Text>
        </Card>
      </Flex>
    </AdminLayout>
  )
}

export default DashboardPage
