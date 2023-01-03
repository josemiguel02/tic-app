import { ChangeEvent, useRef, useState } from 'react'
import NextLink from 'next/link'
import dynamic from 'next/dynamic'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Box,
  Flex,
  Heading,
  Text,
  Icon,
  useDisclosure,
  CircularProgress,
  Input,
  InputGroup,
  InputLeftElement,
  Button
} from '@chakra-ui/react'
import { AdminLayout } from '@/layouts'
import { AddUserModal, Dialog } from '@/components'
import { IoMdAdd } from 'react-icons/io'
import { FaFileCsv } from 'react-icons/fa'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { AiOutlineFilePdf } from 'react-icons/ai'
import { BiSearchAlt } from 'react-icons/bi'
import { useAdmin, useAuth } from '@/hooks'
import { ticApi } from '@/api/tic-api'
import { blobToStr } from '@/utils/blob-to-str'

const UsersModalReport = dynamic(
  () => import('@/components/UsersModalReport'),
  {
    ssr: false
  }
)

const DataTable = dynamic(() => import('@/components/DataTable'), {
  loading: () => <CircularProgress isIndeterminate color='primary' />
})

export { getServerSideProps } from '@/utils/admin-middleware'

const UsuariosPage = () => {
  const [, setTxt] = useState('')
  const [showCSVDialog, setShowCSVDialog] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [csvBtnLoading, setCsvBtnLoading] = useState(false)
  const [csvError, setCsvError] = useState({
    show: false,
    msg: ''
  })
  const { admin } = useAuth()
  const { users, setUsersFiltered, getUsers } = useAdmin()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const debounceRef = useRef<NodeJS.Timeout>()

  // CSV
  const [csvFile, setCsvFile] = useState({} as File)

  const closeCsvDialog = () => {
    setShowCSVDialog(false)
    setCsvFile({} as File)
    setCsvBtnLoading(false)
    setCsvError({
      show: false,
      msg: ''
    })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0])
    }
  }

  const sendCsvFile = async () => {
    if (csvFile instanceof File) {
      if (!csvFile.type.includes('text/csv')) {
        alert('Debe ser un archivo con formato .csv')
        return
      }

      setCsvBtnLoading(true)
      setCsvError({
        show: false,
        msg: ''
      })

      try {
        const csvString = await blobToStr(csvFile)
        await ticApi.post('/admin/add-users', { csvString })
        getUsers()
        closeCsvDialog()
      } catch (error) {
        setCsvBtnLoading(false)
        setCsvError({
          show: true,
          msg: 'Se produjo un error. Por favor, vuelve a intentarlo más tarde.'
        })
        console.error(error)
      }

      return
    }

    alert('Debes cargar un archivo .csv')
  }

  const onQueryChanged = (query: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      searchUser(query)
    }, 400)
  }

  const searchUser = (query: string) => {
    const usuarios = users.filter(user => {
      if (user.nombre.toLocaleLowerCase().startsWith(query.toLowerCase())) {
        return user
      }
    })

    setUsersFiltered(usuarios)
  }

  return (
    <>
      <AdminLayout title='Dashboard - Usuarios'>
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
            <BreadcrumbLink>Usuarios</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Heading as='h3' mt={3} fontWeight='medium' fontSize='2rem'>
          Usuarios
        </Heading>

        <Flex mt={5} justify='space-between'>
          {/* <InputGroup maxW='200px' alignSelf='end'>
            <InputLeftElement top='50%' transform='translateY(-50%)'>
              <Icon as={BiSearchAlt} boxSize={5} />
            </InputLeftElement>

            <Input
              type='search'
              variant='filled'
              rounded='md'
              bgColor='#C9C9C95d'
              placeholder='Buscar...'
              size='sm'
              focusBorderColor='primary'
              onChange={e => {
                setTxt(e.target.value)
                onQueryChanged(e.target.value)
              }}
            />
          </InputGroup> */}

          <Button
            size='sm'
            variant='danger'
            onClick={() => setShowReportDialog(true)}
            leftIcon={<Icon as={AiOutlineFilePdf} boxSize={4} />}
            alignSelf='end'
          >
            Generar reporte
          </Button>

          <Flex flexDir='column' gap={2}>
            {admin?.role === 'ADMIN' && (
              <>
                <Button
                  size='sm'
                  leftIcon={<Icon as={IoMdAdd} boxSize={5} />}
                  onClick={onOpen}
                >
                  Agregar
                </Button>

                <Button
                  size='sm'
                  variant='success'
                  leftIcon={<Icon as={FaFileCsv} boxSize={4} />}
                  onClick={() => setShowCSVDialog(true)}
                >
                  Importar CSV
                </Button>
              </>
            )}
          </Flex>
        </Flex>

        <Box mb={6}>
          <DataTable />
        </Box>
      </AdminLayout>

      <AddUserModal isOpen={isOpen} onClose={onClose} />

      <Dialog
        isOpen={showCSVDialog}
        title='Importar archivo CSV'
        btnText='Importar'
        btnVariant='success'
        btnLoading={csvBtnLoading}
        onAction={sendCsvFile}
        onClose={closeCsvDialog}
      >
        <>
          <Box
            w='full'
            h='200px'
            border='2px dashed #293BDD80'
            rounded='sm'
            pos='relative'
            transition='all .3s ease-in-out'
            _hover={{
              bgColor: 'blackAlpha.200',
              borderColor: 'primary'
            }}
          >
            <Box pos='absolute' w='full' h='full'>
              <Flex
                flexDir='column'
                gap={4}
                justify='center'
                align='center'
                h='full'
              >
                <Icon as={FaFileCsv} boxSize={8} color='whatsapp.500' />
                <Text>{csvFile.name ?? 'Carga un archivo .csv'}</Text>
              </Flex>
            </Box>

            <Input
              type='file'
              boxSize='full'
              opacity={0}
              px={0}
              cursor='pointer'
              accept='.csv'
              onChange={handleFileChange}
            />
          </Box>

          {csvError.show && (
            <Text mt={4} color='crimson' fontWeight='medium' fontSize='.9rem'>
              {csvError.msg}
            </Text>
          )}
        </>
      </Dialog>

      <UsersModalReport
        isOpen={showReportDialog}
        onClose={() => setShowReportDialog(false)}
      />
    </>
  )
}

export default UsuariosPage
