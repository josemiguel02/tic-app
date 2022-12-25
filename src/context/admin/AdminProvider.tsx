import { quizApi } from '@/api/quiz-api'
import { hasTokenAndIsAdmin } from '@/utils/check-user-type'
import { useReducer, useEffect } from 'react'
import AdminContext from './AdminContext'
import { AdminReducer } from './AdminReducer'

export interface AdminState {
  users: IUsuario[]
  quizzes: IExamen[]
  usersFiltered: IUsuario[]
}

const ADMIN_INITIAL_STATE: AdminState = {
  users: [],
  quizzes: [],
  usersFiltered: []
}

const AdminProvider: FCC = ({ children }) => {
  const [state, dispatch] = useReducer(AdminReducer, ADMIN_INITIAL_STATE)

  const getUsers = async () => {
    const isValidAdmin = await hasTokenAndIsAdmin()
    if (!isValidAdmin) {
      return
    }

    try {
      const { data } = await quizApi.get('/admin/get-users')
      dispatch({ type: '[Admin] - Set Users', payload: data })
      dispatch({ type: '[Admin] - Set Users Filtered', payload: data })
    } catch (error) {
      dispatch({ type: '[Admin] - Set Users', payload: [] })
      dispatch({ type: '[Admin] - Set Users Filtered', payload: [] })
    }
  }

  const setUsersFiltered = (usersFiltered: IUsuario[]) => {
    dispatch({ type: '[Admin] - Set Users Filtered', payload: usersFiltered })
  }

  const getQuizzes = async () => {
    const isValidAdmin = await hasTokenAndIsAdmin()
    if (!isValidAdmin) {
      return
    }

    try {
      const { data } = await quizApi.get('/admin/get-quizzes')
      dispatch({ type: '[Admin] - Set Quizzes', payload: data })
    } catch (error) {
      dispatch({ type: '[Admin] - Set Quizzes', payload: [] })
    }
  }

  useEffect(() => {
    getUsers()
    getQuizzes()
  }, [])

  return (
    <AdminContext.Provider
      value={{
        ...state,
        // Methods
        getUsers,
        getQuizzes,
        setUsersFiltered
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export default AdminProvider
