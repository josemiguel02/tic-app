import { GetServerSideProps } from 'next'
import { verifyToken } from '@/lib/jwt'
// import { isAdmin } from './check-user-type'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies['auth-token']

  if (token) {
    try {
      const user = await verifyToken(token)
      const admin = user as IAdmin
      if (admin?.role !== undefined) {
        return {
          redirect: {
            destination: '/dashboard',
            permanent: false
          }
        }
      }

      const usuario = user as IUser
      if (Boolean(usuario.quizFinished)) {
        return {
          redirect: {
            destination: '/examen-terminado',
            permanent: false
          }
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
