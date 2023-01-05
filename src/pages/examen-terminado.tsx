import NextImage from 'next/image'
import dynamic from 'next/dynamic'
import { Flex, Box, CircularProgress } from '@chakra-ui/react'
import { UserLayout } from '@/layouts'

const QuizFinishMessage = dynamic(
  () => import('@/components/QuizFinishMessage'),
  {
    loading: () => <CircularProgress isIndeterminate color='primary' />,
    ssr: false
  }
)

const ExamenTerminadoPage = () => {
  return (
    <UserLayout title='Examen terminado'>
      <Flex flexDir='column' gap={5} mt={20} align='center'>
        <NextImage
          src='/static/img/quiz-finished.svg'
          width={300}
          height={300}
          alt='Quiz finished image'
          style={{ objectFit: 'cover' }}
        />

        <Box maxW='lg' textAlign='center' fontSize='xl'>
          <QuizFinishMessage />
        </Box>
      </Flex>
    </UserLayout>
  )
}

export default ExamenTerminadoPage
