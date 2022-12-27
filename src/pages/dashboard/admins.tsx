import NextLink from 'next/link'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Box,
  Flex,
  Heading,
  Icon,
  useDisclosure,
  CircularProgress
} from '@chakra-ui/react'
import { AdminLayout } from '@/layouts'
import { TableAdmins, Button, AddAdminModal } from '@/components'
import { IoMdAdd } from 'react-icons/io'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { useAuth, useAdmin } from '@/hooks'

export { getServerSideProps } from '@/utils/admin-middleware'

const AdminsPage = () => {
  const { admin } = useAuth()
  const { admins } = useAdmin()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <AdminLayout title='Dashboard - Administradores'>
        <Breadcrumb
          spacing='6px'
          fontSize='sm'
          separator={<MdKeyboardArrowRight color='gray.500' />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={NextLink} href='/dashboard'>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Administradores</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Flex mt={3} justify='space-between' align='center'>
          <Heading as='h3' fontWeight='medium' fontSize='2rem'>
            Administradores
          </Heading>

          {admin?.role === 'ADMIN' && (
            <Button
              size='sm'
              text='Nuevo admin'
              fontSize='.9rem'
              rightIcon={undefined}
              leftIcon={<Icon as={IoMdAdd} boxSize={5} />}
              onClick={onOpen}
            />
          )}
        </Flex>

        <Box mb={6}>
          {!admins.length ? (
            <CircularProgress isIndeterminate color='primary' flex='1' />
          ) : (
            <TableAdmins />
          )}
        </Box>
      </AdminLayout>

      <AddAdminModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default AdminsPage
