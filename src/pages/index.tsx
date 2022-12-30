import NextImage from 'next/image'
import { Box, Flex, SimpleGrid } from '@chakra-ui/react'
import { MainLayout } from '@/layouts'
import { LoginForm } from '@/components'

export { getServerSideProps } from '@/utils/index-middleware'

const IndexPage = () => {
  return (
    <MainLayout title='Tic App'>
      <SimpleGrid
        minH='100vh'
        columns={{ base: 1, lg: 2 }}
        px={{ base: 4, md: 0 }}
      >
        <Flex
          bgColor='main'
          justify='center'
          align='center'
          display={{ base: 'none', lg: 'flex' }}
        >
          <Flex flexDir='column' gap={2}>
            <Box as='picture' w='fit-content' alignSelf='center'>
              <NextImage
                priority
                src='/static/img/logo-tic-light.svg'
                width={260}
                height={50}
                alt='Logo TIC'
                style={{
                  objectFit: 'cover'
                }}
              />
            </Box>

            <Box as='picture' w={320}>
              <NextImage
                priority
                width={320}
                height={320}
                alt='Login Hero'
                src='/static/img/login-hero.svg'
                style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
              />
            </Box>
          </Flex>
        </Flex>

        <Flex justify='center' align='center' mx={{ md: 2 }}>
          <LoginForm />
        </Flex>
      </SimpleGrid>
    </MainLayout>
  )
}

export default IndexPage
