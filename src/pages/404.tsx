import React from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { Box, Button, Flex, Grid, Heading, Text } from '@chakra-ui/react'

export default function Custom404() {
  return (
    <React.Fragment>
      <Head>
        <title>404 | No encontrado</title>
        <link rel='icon' href='/static/img/favicon.svg' type='image/svg+xml' />
      </Head>
      <Grid minH='100vh' placeItems='center'>
        <Flex flexDir='column' gap={5} textAlign='center'>
          <Heading as='h1'>404 | No encontrado</Heading>
          <Text>
            ¡Vaya! No hemos podido encontrar la página que solicitaste.
          </Text>
          <Button variant='ghost' as={NextLink} href='/'>
            Regresar al Inicio
          </Button>
        </Flex>
      </Grid>
    </React.Fragment>
  )
}
