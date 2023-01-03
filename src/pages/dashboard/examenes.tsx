import NextLink from 'next/link'
import dynamic from 'next/dynamic'
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Heading,
  Icon,
  useDisclosure,
  CircularProgress
} from '@chakra-ui/react'
import { AdminLayout } from '@/layouts'
import { IoMdAdd } from 'react-icons/io'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { Button, AddQuizModal } from '@/components'
import { useAuth } from '@/hooks'

const QuizzesTable = dynamic(() => import('@/components/QuizzesTable'), {
  loading: () => <CircularProgress isIndeterminate color='primary' />
})

export { getServerSideProps } from '@/utils/admin-middleware'

const ExamenesPage = () => {
  const { admin } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <AdminLayout title='Dashboard - Exámenes'>
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
            <BreadcrumbLink>Exámenes</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Flex mt={3} justify='space-between' align='center'>
          <Heading as='h3' fontWeight='medium' fontSize='2rem'>
            Exámenes
          </Heading>

          {admin?.role === 'ADMIN' && (
            <Button
              size='sm'
              text='Agregar'
              rightIcon={undefined}
              leftIcon={<Icon as={IoMdAdd} boxSize={5} />}
              onClick={onOpen}
            />
          )}
        </Flex>

        <Box mb={6}>
          <QuizzesTable />
        </Box>
      </AdminLayout>

      <AddQuizModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default ExamenesPage
