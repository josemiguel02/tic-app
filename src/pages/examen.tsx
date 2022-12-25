import { Questions } from '@/components'
import { UserLayout } from '@/layouts'

export { getServerSideProps } from '@/utils/user-middleware'

const ExamenPage = () => {
  return (
    <UserLayout title='Examen' timer>
      <Questions />
    </UserLayout>
  )
}

export default ExamenPage
