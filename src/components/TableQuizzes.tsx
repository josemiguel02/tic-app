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
  useDisclosure
} from '@chakra-ui/react'
import { TbPencil } from 'react-icons/tb'
import { FiTrash2 } from 'react-icons/fi'
import { Dialog } from './Dialog'
import { quizApi } from '@/api/quiz-api'
import { useAdmin } from '@/hooks/useAdmin'
import { useAuth } from '@/hooks/useAuth'

const labels = [
  'Cargo',
  //  'Preguntas',
  'Opciones'
]

interface TableQuizzesProps {
  quizzes: IExamen[]
}

export const TableQuizzes: FCC<TableQuizzesProps> = ({ quizzes }) => {
  const [userId, setUserId] = useState<number | null>(null)
  const [btnLoading, setBtnLoading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { getQuizzes } = useAdmin()
  const { admin } = useAuth()

  const closeModal = () => {
    onClose()
    setBtnLoading(false)
  }

  const handleDeleteQuiz = async () => {
    setBtnLoading(true)

    try {
      await quizApi.post('/admin/delete-quiz', { id: userId })
      getQuizzes()
      closeModal()
    } catch (error) {
      console.error(error)
    } finally {
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
                if (label === 'Opciones' && admin?.role !== 'admin') {
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
            {quizzes.map(({ id, cargo, preguntas }) => (
              <Tr key={id}>
                <Td textTransform='capitalize'>{cargo}</Td>
                {/* <Td>{JSON.stringify(preguntas)}</Td> */}

                {admin?.role === 'admin' && (
                  <Td>
                    <Flex gap={4}>
                      {/* <IconButton
                        size='sm'
                        border='1px solid'
                        borderColor='orange.400'
                        color='orange.400'
                        rounded='full'
                        variant='ghost'
                        aria-label='Editar examen'
                        icon={<Icon as={TbPencil} boxSize={5} />}
                        _hover={{
                          bgColor: 'blackAlpha.200'
                        }}
                        _active={{
                          bgColor: 'blackAlpha.300'
                        }}
                      /> */}

                      <IconButton
                        size='sm'
                        border='1px solid red'
                        color='red'
                        rounded='full'
                        variant='ghost'
                        aria-label='Eliminar examen'
                        icon={<Icon as={FiTrash2} boxSize={5} />}
                        _hover={{
                          bgColor: 'blackAlpha.200'
                        }}
                        _active={{
                          bgColor: 'blackAlpha.300'
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
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Dialog
        title='Eliminar Examen'
        description='¿Está seguro? No puedes deshacer esta acción después.'
        btnText='Eliminar'
        btnVariant='danger'
        isOpen={isOpen}
        onClose={onClose}
        onAction={handleDeleteQuiz}
        btnLoading={btnLoading}
      />
    </>
  )
}
