import { useContext } from 'react'
import AuthContext from '@/context/auth/AuthContext'

export const useAuth = () => {
  const authContext = useContext(AuthContext)

  return {
    ...authContext
  }
}
