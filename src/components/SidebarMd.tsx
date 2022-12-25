import NextImage from 'next/image'
import { Flex, Icon } from '@chakra-ui/react'
import { AiOutlineHome, AiOutlineUser } from 'react-icons/ai'
import { MdOutlineStickyNote2 } from 'react-icons/md'
import { NavLink } from './NavLink'

const links = [
  {
    label: 'Dashboard',
    icon: AiOutlineHome,
    path: '/dashboard'
  },
  {
    label: 'Usuarios',
    icon: AiOutlineUser,
    path: '/dashboard/usuarios'
  },
  {
    label: 'Exámenes',
    icon: MdOutlineStickyNote2,
    path: '/dashboard/examenes'
  }
]

export const SidebarMd = () => {
  return (
    <Flex
      role='group'
      bgColor='main'
      flexDir='column'
      pos='fixed'
      h='100vh'
      // w='13rem'
      w='86px'
      minW='86px'
      zIndex={20}
      py={20}
      gap={10}
      overflow='visible'
      transition='all .2s linear 0s'
      _hover={{
        w: '13rem'
      }}
    >
      <Flex h='100px' justify='center' align='center' overflow='hidden'>
        <Flex
          as='picture'
          h='75px'
          display='none'
          _groupHover={{ display: 'flex' }}
        >
          <NextImage
            priority
            src='/static/img/logo-tic-light.svg'
            width={100}
            height={100}
            alt='Logo TIC'
            style={{
              objectFit: 'cover',
              alignSelf: 'center',
              width: '100%',
              height: '100%'
            }}
          />
        </Flex>

        <Flex as='picture' h='75px' _groupHover={{ display: 'none' }}>
          <NextImage
            priority
            src='/static/img/tic-icon.svg'
            width={100}
            height={100}
            alt='Logo TIC'
            style={{
              objectFit: 'cover',
              alignSelf: 'center',
              width: '100%',
              height: 'auto'
            }}
          />
        </Flex>
      </Flex>

      <Flex flexDir='column' gap={3} w='full' px={4}>
        {links.map(({ label, icon, path }) => (
          <NavLink
            key={label}
            href={path}
            text={label}
            icon={<Icon as={icon} boxSize={6} />}
          />
        ))}
      </Flex>
    </Flex>
  )
}
