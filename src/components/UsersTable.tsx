import { useState } from 'react'
import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  TableContainer,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Icon,
  Input,
  IconButton,
  useToast,
  Badge
} from '@chakra-ui/react'
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  ColumnDef,
  SortingState,
  getSortedRowModel,
  createColumnHelper,
  getPaginationRowModel,
  getFilteredRowModel
} from '@tanstack/react-table'
import { EditUserModal, Dialog, MyAlert, FilterInput } from '.'
import { useAuth, useAdmin } from '@/hooks'
import { ticApi } from '@/api/tic-api'
import { AiOutlineCaretUp, AiOutlineCaretDown } from 'react-icons/ai'
import { FaSort } from 'react-icons/fa'
import { FiTrash2 } from 'react-icons/fi'
import { TbPencil } from 'react-icons/tb'
import {
  MdNavigateBefore,
  MdNavigateNext,
  MdLastPage,
  MdFirstPage
} from 'react-icons/md'

export type TableProps<Data extends object> = {
  data: Data[]
  columns: ColumnDef<Data, any>[]
}

function Table<Data extends object>({ data, columns }: TableProps<Data>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const { admin } = useAuth()
  const isAdmin = admin?.role === 'ADMIN'

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Filter
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
      columnVisibility: { 'options': isAdmin }
    },
    state: {
      sorting
    }
  })

  return (
    <>
      <TableContainer
        sx={{
          '&::-webkit-scrollbar': {
            h: '6px'
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
        <ChakraTable variant='striped' colorScheme='blackAlpha' size='sm'>
          <Thead bg='main'>
            {table.getHeaderGroups().map(headerGroup => (
              <Tr key={headerGroup.id} color='white'>
                {headerGroup.headers.map(header => {
                  const meta: any = header.column.columnDef.meta

                  return (
                    <Th
                      key={header.id}
                      color='inherit'
                      isNumeric={meta?.isNumeric}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          <Flex
                            mb={2}
                            gap={4}
                            align='center'
                            cursor={header.column.getCanSort() ? 'pointer' : ''}
                            userSelect={
                              header.column.getCanSort() ? 'none' : undefined
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}

                            <chakra.span>
                              {header.column.getIsSorted() ? (
                                header.column.getIsSorted() === 'desc' ? (
                                  <AiOutlineCaretDown aria-label='sorted descending' />
                                ) : (
                                  <AiOutlineCaretUp aria-label='sorted ascending' />
                                )
                              ) : header.column.getCanSort() ? (
                                <FaSort aria-label='sort' />
                              ) : null}
                            </chakra.span>
                          </Flex>
                        </>
                      )}

                      {header.column.getCanFilter() ? (
                        <div>
                          <FilterInput column={header.column} table={table} />
                        </div>
                      ) : null}
                    </Th>
                  )
                })}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map(row => (
              <Tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  const meta: any = cell.column.columnDef.meta

                  return (
                    <Td key={cell.id} isNumeric={meta?.isNumeric}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Td>
                  )
                })}
              </Tr>
            ))}
          </Tbody>
        </ChakraTable>
      </TableContainer>

      <Flex mt={5} justify='space-between' flexWrap='wrap' align='center'>
        <Flex gap={2}>
          <IconButton
            size='sm'
            bgColor='primary'
            rounded='full'
            aria-label='Go to first page'
            icon={<Icon as={MdFirstPage} boxSize={5} />}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          />

          <IconButton
            size='sm'
            bgColor='primary'
            rounded='full'
            aria-label='Go to previous page'
            icon={<Icon as={MdNavigateBefore} boxSize={5} />}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          />

          <IconButton
            size='sm'
            bgColor='primary'
            rounded='full'
            aria-label='Go to next page'
            icon={<Icon as={MdNavigateNext} boxSize={5} />}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          />

          <IconButton
            size='sm'
            bgColor='primary'
            rounded='full'
            aria-label='Go to last page'
            icon={<Icon as={MdLastPage} boxSize={5} />}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          />
        </Flex>

        <Flex flexDir='column' align='center'>
          <chakra.span fontSize='sm'>
            Página{' '}
            <chakra.span fontWeight='semibold'>
              {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount()}
            </chakra.span>
          </chakra.span>

          <FormControl display='flex' alignItems='center' gap={3}>
            <FormLabel m={0} fontSize='sm'>
              Ir a la Página:
            </FormLabel>

            <Input
              size='sm'
              type='number'
              rounded='md'
              maxW={14}
              focusBorderColor='primary'
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                table.setPageIndex(page)
              }}
            />
          </FormControl>
        </Flex>

        <FormControl display='flex' alignItems='center' gap={3} w='fit-content'>
          <FormLabel m={0} fontSize='sm'>
            Mostrar:
          </FormLabel>

          <Select
            size='sm'
            rounded='md'
            focusBorderColor='primary'
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
          >
            {[5, 10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </Select>
        </FormControl>
      </Flex>

      <div>{table.getCoreRowModel().rows.length} Registros</div>
    </>
  )
}

const columnHelper = createColumnHelper<IUsuario>()

const columns = [
  columnHelper.accessor('nombre', {
    cell: info => info.getValue(),
    header: 'Nombres'
  }),
  columnHelper.accessor('apellido', {
    cell: info => info.getValue(),
    header: 'Apellidos'
  }),
  columnHelper.accessor('cedula', {
    cell: info => info.getValue(),
    header: 'Cedula'
  }),
  columnHelper.accessor('cargo', {
    cell: info => info.getValue(),
    header: 'Cargo'
  }),
  columnHelper.accessor('direccion', {
    cell: info => info.getValue(),
    header: 'Direccion'
  }),
  columnHelper.accessor('celular', {
    cell: info => info.getValue(),
    header: 'Celular'
  }),
  columnHelper.accessor('modelo', {
    cell: info => info.getValue(),
    header: 'Modelo'
  }),
  columnHelper.accessor('operadora', {
    cell: info => info.getValue(),
    header: 'Operadora'
  }),
  columnHelper.accessor('calificacion', {
    cell: info => info.getValue() ?? 'null',
    header: 'Calificacion',
    meta: {
      isNumeric: true
    }
  }),
  columnHelper.accessor('examen_terminado', {
    cell: info => <QuizStatus quizStatus={info.getValue()} />,
    header: 'Estado Examen',
    enableSorting: false,
    enableColumnFilter: false
  }),
  columnHelper.display({
    id: 'options',
    header: 'Opciones',
    cell: props => <ActionsBtns {...props.row.original} />,
    enableSorting: false,
    enableColumnFilter: false
  })
]

const QuizStatus = ({ quizStatus }: { quizStatus: number }) => {
  const status = Boolean(quizStatus) ? 'Terminado' : 'Pendiente'
  const statusColor = Boolean(quizStatus) ? 'green' : 'orange'

  return <Badge colorScheme={statusColor}>{status}</Badge>
}

const ActionsBtns: FCC<IUsuario> = props => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [userIdEdit, setUserIdEdit] = useState<number | null>(null)
  const [editData, setEditData] = useState({} as Partial<UsuarioDTO>)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [userIdDelete, setUserIdDelete] = useState<number | null>(null)
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false)

  const [error, setError] = useState({
    show: false,
    msg: ''
  })

  const { getUsers } = useAdmin()
  const toast = useToast()

  const {
    id,
    nombre,
    apellido,
    cedula,
    examen_id,
    direccion,
    celular,
    modelo,
    operadora
  } = props

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false)
    setDeleteBtnLoading(false)
    setError({
      show: false,
      msg: ''
    })
  }

  const handleDeleteUser = async () => {
    setDeleteBtnLoading(true)

    try {
      const res = await ticApi.post('/admin/delete-user', { id: userIdDelete })
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
      <Flex gap={4}>
        <IconButton
          size='sm'
          color='orange.400'
          bgColor='#ED893630'
          rounded='full'
          variant='ghost'
          aria-label='Editar usuario'
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
            setUserIdDelete(id)
            setShowDeleteDialog(true)
          }}
        />
      </Flex>

      <EditUserModal
        userId={userIdEdit}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        defaultValues={editData}
      />

      <Dialog
        title='Eliminar Usuario'
        description='¿Está seguro? No puedes deshacer esta acción después.'
        btnText='Eliminar'
        btnVariant='danger'
        isOpen={showDeleteDialog}
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
    </>
  )
}

const UsersTable = () => {
  const { usersFiltered } = useAdmin()
  return <Table columns={columns} data={usersFiltered} />
}

export default UsersTable
