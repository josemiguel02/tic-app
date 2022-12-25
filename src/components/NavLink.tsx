import React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { Box, Flex, Link, LinkProps } from '@chakra-ui/react'

interface NavLinkProps extends LinkProps {
  text: string
  href: string
  icon: React.ReactElement
}

export const NavLink: FCC<NavLinkProps> = ({ text, href, icon, ...rest }) => {
  const { pathname } = useRouter()
  const active = pathname === href

  return (
    <Link
      color='gray.300'
      h={8}
      rounded='md'
      fontSize='sm'
      display='inline-flex'
      alignItems='center'
      justifyContent='center'
      aria-current={active && 'page'}
      transition='all .5s ease-in-out'
      as={NextLink}
      href={href}
      _hover={{
        bgColor: 'primary',
        color: 'white'
      }}
      _activeLink={{
        bgColor: 'primary',
        fontWeight: 'medium',
        color: 'white'
      }}
      {...rest}
    >
      <Flex
        justify='flex-start'
        align='center'
        gap={2}
        pl='14px'
        w='full'
        overflow='hidden'
      >
        <Flex as='span'>{icon}</Flex>
        <Box
          overflow='hidden'
          display='none'
          pos='relative'
          _groupHover={{
            display: 'flex'
          }}
        >
          {text}
        </Box>
      </Flex>
    </Link>
  )
}
