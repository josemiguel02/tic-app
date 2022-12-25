import { createContext } from 'react'

interface AdminContextProps {
  users: IUsuario[]
  usersFiltered: IUsuario[]
  quizzes: IExamen[]
  getUsers: () => Promise<void>
  getQuizzes: () => Promise<void>
  setUsersFiltered: (usersFiltered: IUsuario[]) => void
  // addUser: (user: any) => Promise<any>
}

const AdminContext = createContext({} as AdminContextProps)

export default AdminContext
