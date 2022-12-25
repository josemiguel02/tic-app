import NextLink from 'next/link'
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Heading,
  Icon,
  useDisclosure
} from '@chakra-ui/react'
import { AdminLayout } from '@/layouts'
import { IoMdAdd } from 'react-icons/io'
import { Button, AddQuizModal, TableQuizzes } from '@/components'
import { useAdmin } from '@/hooks/useAdmin'
import { MdKeyboardArrowRight } from 'react-icons/md'

export { getServerSideProps } from '@/utils/admin-middleware'

const ExamenesPage = () => {
  const { quizzes } = useAdmin()
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

          <Button
            size='sm'
            text='Nuevo examen'
            fontSize='.9rem'
            rightIcon={undefined}
            leftIcon={<Icon as={IoMdAdd} boxSize={5} />}
            onClick={onOpen}
          />
        </Flex>

        <Box mb={6}>
          <TableQuizzes quizzes={quizzes} />
        </Box>
      </AdminLayout>

      <AddQuizModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default ExamenesPage
