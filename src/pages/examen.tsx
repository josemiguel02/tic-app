import dynamic from 'next/dynamic'
import { CircularProgress } from '@chakra-ui/react'
import { UserLayout } from '@/layouts'
import Questions from '@/components/Questions'

// const Questions = dynamic(() => import('@/components/Questions'), {
//   loading: () => <CircularProgress isIndeterminate color='primary' />
// })

export { getServerSideProps } from '@/utils/user-middleware'

const ExamenPage = () => {
  return (
    <UserLayout title='Examen' timer>
      <Questions />
    </UserLayout>
  )
}

export default ExamenPage
