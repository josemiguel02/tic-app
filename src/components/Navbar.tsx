import { Box, Container, Heading } from '@chakra-ui/react'
import { useAuth } from '@/hooks/useAuth'
import { LogoutMenu } from './LogoutMenu'

export const Navbar = () => {
  const { user } = useAuth()

  return (
    <Box as='header' bgColor='main'>
      <Container
        as='nav'
        py={4}
        display='flex'
        maxW='container.xl'
        alignItems='center'
        justifyContent='space-between'
        flexWrap='wrap'
      >
        <Heading color='white' as='h1' fontSize={{ base: 'xl', sm: '2xl', md: '3xl' }}>
          Bienvenido, {user?.name}!
        </Heading>

        <LogoutMenu />
      </Container>
    </Box>
  )
}
