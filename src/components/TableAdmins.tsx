import { useState } from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Icon,
  IconButton,
  useDisclosure,
  Badge,
  useToast
} from '@chakra-ui/react'
import { TbPencil } from 'react-icons/tb'
import { FiTrash2 } from 'react-icons/fi'
import { Dialog } from './Dialog'
import { ticApi } from '@/api/tic-api'
import { useAdmin, useAuth } from '@/hooks'
import { EditAdminModal, MyAlert } from '.'

const labels = ['Nombre', 'Apellido', 'Cedula', 'Rol', 'Opciones']
const colors = ['yellow', 'red', 'purple']
const randomColor = colors[Math.floor(Math.random() * colors.length)]

export const TableAdmins = () => {
  const [adminId, setAdminId] = useState<number | null>(null)
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editData, setEditData] = useState({} as Partial<AdminDTO>)
  const [adminIdEdit, setAdminIdEdit] = useState<number | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const { admins, getAdmins } = useAdmin()
  const { admin } = useAuth()
  const toast = useToast()
  const [error, setError] = useState({
    show: false,
    msg: ''
  })

  const isAdmin = admin?.role !== 'ADMIN'

  const closeDeleteDialog = () => {
    onClose()
    setDeleteBtnLoading(false)
    setError({
      show: false,
      msg: ''
    })
  }

  const handleDeleteAdmin = async () => {
    setDeleteBtnLoading(true)

    try {
      const res = await ticApi.post('/admin/delete-admin', { id: adminId })
      getAdmins()
      closeDeleteDialog()
      toast({
        title: res.data.msg,
        status: 'info',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      })
    } catch (e: any) {
      setError({
        show: true,
        msg: e.response.data
      })
      setDeleteBtnLoading(false)
      console.error(e)
    }
  }

  return (
    <>
      <TableContainer
        mt={10}
        sx={{
          '&::-webkit-scrollbar': {
            h: '8px'
          },
          '&::-webkit-scrollbar-thumb': {
            bgColor: 'gray.50',
            borderRadius: '10px',
            transition: 'all .5s ease-in-out'
          },
          '&::-webkit-scrollbar-thumb:hover': {
            bgColor: '#bebebe'
          }
        }}
      >
        <Table variant='striped' colorScheme='blackAlpha' size='sm'>
          <Thead bgColor='main'>
            <Tr color='white'>
              {labels.map((label, i) => {
                if ((label === 'Opciones' || label === 'Cedula') && isAdmin) {
                  return null
                }

                return (
                  <Th key={i} color='inherit'>
                    {label}
                  </Th>
                )
              })}
            </Tr>
          </Thead>
          <Tbody>
            {admins.map(({ id, nombre, apellido, cedula, rol, rol_id }) => (
              <Tr key={id}>
                <Td>{nombre}</Td>
                <Td>{apellido}</Td>
                {!isAdmin && <Td>{cedula}</Td>}
                <Td>
                  <Badge colorScheme={rol === 'ADMIN' ? 'green' : randomColor}>
                    {rol}
                  </Badge>
                </Td>

                {admin?.role === 'ADMIN' && (
                  <Td>
                    <Flex gap={4}>
                      <IconButton
                        size='sm'
                        color='orange.400'
                        bgColor='#ED893630'
                        rounded='full'
                        variant='ghost'
                        aria-label='Edit user'
                        icon={<Icon as={TbPencil} boxSize={5} />}
                        transitionDuration='500ms'
                        _hover={{
                          bgColor: '#ED893650'
                        }}
                        _active={{
                          bgColor: '#ED893660'
                        }}
                        onClick={() => {
                          setAdminIdEdit(id)
                          setEditData({ nombre, apellido, rol_id, cedula })
                          setShowEditModal(true)
                        }}
                      />

                      <IconButton
                        size='sm'
                        color='crimson'
                        bgColor='#DC143C20'
                        rounded='full'
                        variant='ghost'
                        aria-label='Eliminar usuario'
                        icon={<Icon as={FiTrash2} boxSize={5} />}
                        transitionDuration='500ms'
                        _hover={{
                          bgColor: '#DC143C40'
                        }}
                        _active={{
                          bgColor: '#DC143C50'
                        }}
                        onClick={() => {
                          setAdminId(id)
                          onOpen()
                        }}
                      />
                    </Flex>
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Dialog
        title='Eliminar administrador'
        description='¿Está seguro? No puedes deshacer esta acción después.'
        btnText='Eliminar'
        btnVariant='danger'
        isOpen={isOpen}
        onClose={closeDeleteDialog}
        onAction={handleDeleteAdmin}
        btnLoading={deleteBtnLoading}
        error={
          <MyAlert
            show={error.show}
            onClose={() => setError({ ...error, show: false })}
            description={error.msg}
          />
        }
      />

      <EditAdminModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        adminId={adminIdEdit!}
        editValues={editData}
      />
    </>
  )
}
