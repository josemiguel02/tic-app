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
import { EditUserModal } from './EditUserModal'
import { MyAlert } from '.'

const labels = [
  'Nombre',
  'Apellido',
  'Cedula',
  'Cargo',
  'Direccion',
  'Celular',
  'Modelo',
  'Operadora',
  'Estado Examen',
  'Calificacion',
  'Opciones'
]

export const TableUsers = () => {
  const [userId, setUserId] = useState<number | null>(null)
  const [userIdEdit, setUserIdEdit] = useState<number | null>(null)
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false)
  const [editData, setEditData] = useState({} as Partial<UsuarioDTO>)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [showEditModal, setShowEditModal] = useState(false)
  const { getUsers, usersFiltered } = useAdmin()
  const { admin } = useAuth()
  const [error, setError] = useState({
    show: false,
    msg: ''
  })

  const toast = useToast()

  const closeDeleteDialog = () => {
    onClose()
    setDeleteBtnLoading(false)
    setError({
      show: false,
      msg: ''
    })
  }

  const handleDeleteUser = async () => {
    setDeleteBtnLoading(true)

    try {
      const res = await ticApi.post('/admin/delete-user', { id: userId })
      getUsers()
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
            {usersFiltered.map(
              ({
                id,
                nombre,
                apellido,
                cedula,
                cargo,
                direccion,
                celular,
                modelo,
                operadora,
                examen_terminado,
                calificacion,
                examen_id
              }) => (
                <Tr key={id}>
                  <Td>{nombre}</Td>
                  <Td>{apellido}</Td>
                  <Td>{cedula}</Td>
                  <Td textTransform='capitalize'>{cargo}</Td>
                  <Td>{direccion}</Td>
                  <Td>{celular}</Td>
                  <Td>{modelo}</Td>
                  <Td>{operadora}</Td>
                  <Td>
                    {Boolean(examen_terminado) ? (
                      <Badge colorScheme='green'>Terminado</Badge>
                    ) : (
                      <Badge colorScheme='orange'>Pendiente</Badge>
                    )}
                  </Td>

                  <Td>{calificacion ?? 'null'}</Td>

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
                            setUserIdEdit(id)
                            setEditData({
                              nombre,
                              apellido,
                              cedula,
                              examen_id,
                              direccion,
                              celular,
                              modelo,
                              operadora
                            })
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
                            setUserId(id)
                            onOpen()
                          }}
                        />
                      </Flex>
                    </Td>
                  )}
                </Tr>
              )
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <Dialog
        title='Eliminar Usuario'
        description='¿Está seguro? No puedes deshacer esta acción después.'
        btnText='Eliminar'
        btnVariant='danger'
        isOpen={isOpen}
        onClose={closeDeleteDialog}
        onAction={handleDeleteUser}
        btnLoading={deleteBtnLoading}
        error={
          <MyAlert
            show={error.show}
            onClose={() => setError({ ...error, show: false })}
            description={error.msg}
          />
        }
      />

      <EditUserModal
        userId={userIdEdit}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        defaultValues={editData}
      />
    </>
  )
}
