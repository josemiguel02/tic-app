import React from 'react'
import Head from 'next/head'
import { Box, Heading, Flex, Show } from '@chakra-ui/react'
import { LogoutMenu, PageTransition, Sidebar } from '@/components'
import { useAuth } from '@/hooks'

const Header = () => {
  const { admin } = useAuth()

  return (
    <Flex as='header' py={2} justify='space-between' wrap='wrap'>
      <Box>
        <Heading as='h1' fontWeight='semibold' fontSize='2.5rem'>
          DASHBOARD
        </Heading>
        <Heading fontWeight='normal' color='gray.600'>
          Bienvenido, {admin?.name}!
        </Heading>
      </Box>

      <LogoutMenu />
    </Flex>
  )
}

interface AdminLayoutProps {
  title: string
}

export const AdminLayout: FCC<AdminLayoutProps> = ({ children, title }) => {
  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
        <link rel='icon' href='/static/img/favicon.svg' type='image/svg+xml' />
      </Head>

      <div>
        {/* <Show above='lg'>
          <Sidebar />
        </Show>

        <Show>
          <SidebarMd />
        </Show> */}

        <Sidebar />

        <Box
          w='full'
          flexDir='column'
          // pl={{ base: '1rem', md: '15rem' }}
          // pr={{ base: '1rem', md: '2rem' }}
          pl='86px'
        >
          <Flex flexDir='column' p={4}>
            <Header />
            <PageTransition flexDir='column' mt={10}>
              {children}
            </PageTransition>
          </Flex>
        </Box>
      </div>
    </React.Fragment>
  )
}
