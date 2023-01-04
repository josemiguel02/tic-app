import dynamic from 'next/dynamic'
import { CircularProgress } from '@chakra-ui/react'
import { UserLayout } from '@/layouts'

const Questions = dynamic(() => import('@/components/Questions'), {
  loading: () => <CircularProgress isIndeterminate color='primary' />,
  ssr: false
})

export { getServerSideProps } from '@/utils/user-middleware'

const ExamenPage = () => {
  return (
    <UserLayout title='Examen' timer>
      <Questions />
    </UserLayout>
  )
}

export default ExamenPage
