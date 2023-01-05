import NextLink from 'next/link'
import {
  Flex,
  Heading,
  Text,
  Card,
  Badge,
  Box,
  Icon,
  SimpleGrid
} from '@chakra-ui/react'
import {
  MdOutlineStickyNote2,
  MdOutlineAdminPanelSettings
} from 'react-icons/md'
import { AiOutlineUser } from 'react-icons/ai'
import { AdminLayout } from '@/layouts'
import { useAdmin } from '@/hooks'
import { OTHERS_NOTE_QUALIFICATION, TEC_NOTE_QUALIFICATION } from '@/utils/constants'

export { getServerSideProps } from '@/utils/admin-middleware'

const DashboardPage = () => {
  const { users, quizzes, admins } = useAdmin()

  const usersQuizPending = users.filter(user => {
    if (!Boolean(user.examen_terminado) && !user.calificacion) {
      return user
    }
  }).length

  const usersApproved = users.filter(({ calificacion, cargo }) => {
    if (
      cargo === 'OPERADORES CDA' ||
      cargo === 'ESCANEADOR' ||
      cargo === 'ASISTENTE ESCANER'
    ) {
      return calificacion! >= TEC_NOTE_QUALIFICATION
    }

    return calificacion! >= OTHERS_NOTE_QUALIFICATION
  }).length

  const usersFailed = users.filter(
    ({ calificacion, examen_terminado, cargo }) => {
      if (calificacion || examen_terminado) {
        if (
          cargo === 'OPERADORES CDA' ||
          cargo === 'ESCANEADOR' ||
          cargo === 'ASISTENTE ESCANER'
        ) {
          return calificacion! < TEC_NOTE_QUALIFICATION
        }

        return calificacion! < OTHERS_NOTE_QUALIFICATION
      }
    }
  ).length

  return (
    <AdminLayout title='Dashboard'>
      <Heading as='h3' fontWeight='medium' fontSize='2rem'>
        Detalles
      </Heading>

      <Flex flexDir='column' align='flex-start' gap={6} mt={10}>
        <Card
          as={NextLink}
          href='/dashboard/usuarios'
          bgColor='white'
          p={8}
          w='400px'
          gap={2}
          shadow='lg'
          rounded='lg'
          border='2px solid transparent'
          transition='all .4s ease-in-out'
          _hover={{
            borderColor: 'primary',
            boxShadow: '0 10px 15px -3px #293BDD7d'
          }}
        >
          <Box display='inline-flex'>
            <Icon as={AiOutlineUser} boxSize={9} />
          </Box>

          <Heading as='h3' fontWeight='medium' fontSize='2rem'>
            Usuarios
          </Heading>

          <SimpleGrid columns={2} color='gray.600' fontSize='.80rem' gap={1}>
            <div>
              Aprobados:{' '}
              <Badge colorScheme='green' ml={1}>
                {usersApproved}
              </Badge>
            </div>

            <div>
              Reprobados:{' '}
              <Badge colorScheme='red' ml={1}>
                {usersFailed}
              </Badge>
            </div>

            <div>
              Pendientes:{' '}
              <Badge colorScheme='yellow' ml={1}>
                {usersQuizPending}
              </Badge>
            </div>

            <div>
              Total:{' '}
              <Badge colorScheme='purple' ml={1}>
                {users.length}
              </Badge>
            </div>
          </SimpleGrid>
        </Card>

        <Card
          as={NextLink}
          href='/dashboard/examenes'
          bgColor='white'
          p={8}
          w='400px'
          justify='center'
          gap={2}
          shadow='lg'
          rounded='lg'
          border='2px solid transparent'
          transition='all .4s ease-in-out'
          _hover={{
            borderColor: 'primary',
            boxShadow: '0 10px 15px -3px #293BDD7d'
          }}
        >
          <Box display='inline-flex'>
            <Icon as={MdOutlineStickyNote2} boxSize={9} />
          </Box>

          <Heading as='h3' fontWeight='medium' fontSize='2rem'>
            Exámenes
          </Heading>
          <Text color='gray.600'>{quizzes.length} exámenes</Text>
        </Card>

        <Card
          as={NextLink}
          href='/dashboard/admins'
          bgColor='white'
          p={8}
          w='400px'
          justify='center'
          gap={2}
          shadow='lg'
          rounded='lg'
          border='2px solid transparent'
          transition='all .4s ease-in-out'
          _hover={{
            borderColor: 'primary',
            boxShadow: '0 10px 15px -3px #293BDD7d'
          }}
        >
          <Box display='inline-flex'>
            <Icon as={MdOutlineAdminPanelSettings} boxSize={9} />
          </Box>

          <Heading as='h3' fontWeight='medium' fontSize='2rem'>
            Administradores
          </Heading>
          <Text color='gray.600'>{admins.length} administradores</Text>
        </Card>
      </Flex>
    </AdminLayout>
  )
}

export default DashboardPage
