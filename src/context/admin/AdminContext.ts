/* eslint-disable no-unused-vars */
import { createContext } from 'react'

interface AdminContextProps {
  admins: IAdministrador[]
  adminsRoles: IRolesAdmin[]
  users: IUsuario[]
  quizzes: IExamen[]
  usersFiltered: IUsuario[]
  getAdmins: () => Promise<void>
  getAdminsRoles: () => Promise<void>
  getUsers: () => Promise<void>
  getQuizzes: () => Promise<void>
  setUsersFiltered: (usersFiltered: IUsuario[]) => void
}

const AdminContext = createContext({} as AdminContextProps)

export default AdminContext
