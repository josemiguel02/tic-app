import React from 'react'
import Head from 'next/head'
import { Container } from '@chakra-ui/react'
import { Navbar, PageTransition, Timer } from '@/components'

interface UserLayoutProps {
  title: string
  timer?: boolean
}

export const UserLayout: FCC<UserLayoutProps> = ({
  children,
  title,
  timer
}) => {
  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
        <link rel='icon' href='/static/img/favicon.svg' type='image/svg+xml' />
      </Head>
      <Navbar />
      {timer && <Timer />}
      <Container as='main' maxW='container.xl'>
        <PageTransition>{children}</PageTransition>
      </Container>
    </React.Fragment>
  )
}
