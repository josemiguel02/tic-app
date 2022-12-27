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
  Badge
} from '@chakra-ui/react'
import { TbPencil } from 'react-icons/tb'
import { FiTrash2 } from 'react-icons/fi'
import { Dialog } from './Dialog'
import { ticApi } from '@/api/tic-api'
import { useAdmin, useAuth } from '@/hooks'
import { EditAdminModal } from '.'

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

  const closeDeleteDialog = () => {
    onClose()
    setDeleteBtnLoading(false)
  }

  const handleDeleteAdmin = async () => {
    setDeleteBtnLoading(true)

    try {
      await ticApi.post('/admin/delete-admin', { id: adminId })
      getAdmins()
      closeDeleteDialog()
    } catch (error) {
      console.error(error)
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
                if (label === 'Opciones' && admin?.role !== 'ADMIN') {
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
                <Td>{cedula}</Td>
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
        onClose={onClose}
        onAction={handleDeleteAdmin}
        btnLoading={deleteBtnLoading}
      />

      <EditAdminModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        adminId={adminIdEdit}
        editValues={editData}
      />
    </>
  )
}
