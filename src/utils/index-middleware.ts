import { GetServerSideProps } from 'next'
import { verifyToken } from '@/lib/jwt'
import { isAdmin } from './check-user-type'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies['auth-token']

  if (token) {
    try {
      const user = await verifyToken(token)

      if (isAdmin(user)) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false
          }
        }
      }

      return {
        redirect: {
          destination: '/inicio',
          permanent: false
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    props: {}
  }
}
