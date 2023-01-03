import Router from 'next/router'
import {
  Box,
  Card,
  Heading,
  Text,
  OrderedList,
  ListItem
} from '@chakra-ui/react'
import { useAuth } from '@/hooks'
import { UserLayout } from '@/layouts'
import { Button } from '@/components'

export { getServerSideProps } from '@/utils/user-middleware'

const HomePage = () => {
  const { user } = useAuth()

  return (
    <UserLayout title='Inicio'>
      <Card
        color='none'
        bgColor='#fff6'
        p={{ base: '1.5rem', md: '2rem 2.5rem' }}
        rounded='lg'
        shadow='xl'
        maxW='container.md'
        display='flex'
        flexDir='column'
        gap={5}
        mt={20}
      >
        <Heading fontSize={{ base: 'lg', md: 'xl' }} fontWeight='semibold'>
          Has sido asignado al examen con el cargo de:{' '}
          {user?.position.toUpperCase()}
        </Heading>

        <Box mx={10}>
          <Text fontWeight='medium'>
            Antes de comenzar el examen debes seguir las siguientes
            instrucciones:
          </Text>

          <OrderedList mt={2} fontSize='md'>
            <ListItem>
              Tendrás sólo 10 minutos para completar el exámen.
            </ListItem>
            <ListItem>Debes seleccionar una sola opción.</ListItem>
            <ListItem>
              No puedes seleccionar ninguna opción una vez que pase el tiempo,
              ya que el exámen se cerrará.
            </ListItem>
          </OrderedList>
        </Box>

        <Button
          mt={4}
          onClick={() => Router.replace('/examen')}
          alignSelf='center'
          text='Comenzar examen'
        />
      </Card>
    </UserLayout>
  )
}

export default HomePage
