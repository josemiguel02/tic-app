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
import { Dialog, MyAlert, EditAdminModal, FilterInput } from '.'
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
      columnVisibility: { cedula: isAdmin, 'options': isAdmin }
    },
    state: {
      sorting
    }
  })

  return (
    <>
      <TableContainer
        mt={10}
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
                  return (
                    <Th key={header.id} color='inherit'>
                      {header.isPlaceholder ? null : (
                        <>
                          <Flex
                            mb={2}
                            gap={4}
                            align='center'
                            cursor={header.column.getCanSort() ? 'pointer' : ''}
                            userSelect={header.column.getCanSort() ? 'none' : undefined}
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
                  return (
                    <Td key={cell.id}>
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
            P??gina{' '}
            <chakra.span fontWeight='semibold'>
              {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount()}
            </chakra.span>
          </chakra.span>

          <FormControl display='flex' alignItems='center' gap={3}>
            <FormLabel m={0} fontSize='sm'>
              Ir a la P??gina:
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

const columnHelper = createColumnHelper<IAdministrador>()

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
  columnHelper.accessor('rol', {
    cell: info => <AdminRole role={info.getValue()} />,
    header: 'Rol'
  }),
  columnHelper.display({
    id: 'options',
    header: 'Opciones',
    cell: props => <ActionsBtns {...props.row.original} />,
    enableSorting: false,
    enableColumnFilter: false
  })
]

const AdminRole = ({ role }: { role: string }) => {
  const colors = ['yellow', 'red', 'purple']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  return (
    <Badge colorScheme={role === 'ADMIN' ? 'green' : randomColor}>{role}</Badge>
  )
}

const ActionsBtns: FCC<IAdministrador> = ({
  id,
  nombre,
  apellido,
  rol_id,
  cedula
}) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [adminIdEdit, setAdminIdEdit] = useState<number | null>(null)
  const [adminEditData, setAdminEditData] = useState({} as Partial<AdminDTO>)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [adminIdDelete, setAdminIdDelete] = useState<number | null>(null)
  const [deleteBtnLoading, setDeleteBtnLoading] = useState(false)

  const [error, setError] = useState({
    show: false,
    msg: ''
  })

  const { getAdmins } = useAdmin()
  const toast = useToast()

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false)
    setDeleteBtnLoading(false)
    setError({
      show: false,
      msg: ''
    })
  }

  const handleDeleteAdmin = async () => {
    setDeleteBtnLoading(true)

    try {
      const res = await ticApi.post('/admin/delete-admin', {
        id: adminIdDelete
      })
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
      <Flex gap={4}>
        <IconButton
          size='sm'
          color='orange.400'
          bgColor='#ED893630'
          rounded='full'
          variant='ghost'
          aria-label='Editar examen'
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
            setAdminEditData({ nombre, apellido, rol_id, cedula })
            setShowEditModal(true)
          }}
        />

        <IconButton
          size='sm'
          color='crimson'
          bgColor='#DC143C20'
          rounded='full'
          variant='ghost'
          aria-label='Eliminar examen'
          icon={<Icon as={FiTrash2} boxSize={5} />}
          transitionDuration='500ms'
          _hover={{
            bgColor: '#DC143C40'
          }}
          _active={{
            bgColor: '#DC143C50'
          }}
          onClick={() => {
            setAdminIdDelete(id)
            setShowDeleteDialog(true)
          }}
        />
      </Flex>

      <EditAdminModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        adminId={adminIdEdit!}
        editValues={adminEditData}
      />

      <Dialog
        title='Eliminar administrador'
        description='??Est?? seguro? No puedes deshacer esta acci??n despu??s.'
        btnText='Eliminar'
        btnVariant='danger'
        isOpen={showDeleteDialog}
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
    </>
  )
}

const AdminsTable = () => {
  const { admins } = useAdmin()
  return <Table columns={columns} data={admins} />
}

export default AdminsTable
