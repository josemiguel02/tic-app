import { useAuth } from '@/hooks/useAuth'
import {
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList
} from '@chakra-ui/react'
import { HiOutlineUserCircle } from 'react-icons/hi'
import { IoMdLogOut } from 'react-icons/io'
import { IoChevronDownOutline } from 'react-icons/io5'

export const LogoutMenu = () => {
  const { logout } = useAuth()

  return (
    <Menu>
      <MenuButton
        as={Button}
        color='primary'
        bgColor='transparent'
        border='1px solid'
        borderColor='primary'
        _hover={{}}
        px={2}
      >
        <Flex gap={2} align='center' justify='center'>
          <Icon as={HiOutlineUserCircle} boxSize={5} />
          <Icon as={IoChevronDownOutline} boxSize={4} />
        </Flex>
      </MenuButton>
      <MenuList shadow='lg' fontSize={{ base: 'sm', md: 'md' }}>
        <MenuItem
          gap={2}
          onClick={logout}
          _hover={{
            bgColor: 'blackAlpha.100'
          }}
          _active={{
            bgColor: 'blackAlpha.200'
          }}
        >
          <Icon as={IoMdLogOut} boxSize={5} color='crimson' />
          Cerrar sesión
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
