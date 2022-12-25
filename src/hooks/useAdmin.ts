import { useContext } from 'react'
import AdminContext from '@/context/admin/AdminContext'

export const useAdmin = () => {
  const adminContext = useContext(AdminContext)

  return {
    ...adminContext
  }
}
