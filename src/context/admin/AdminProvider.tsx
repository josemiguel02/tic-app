import { ticApi } from '@/api/tic-api'
import { useReducer, useEffect } from 'react'
import AdminContext from './AdminContext'
import { AdminReducer } from './AdminReducer'
import { getAuthCookie } from '@/utils/cookies'

export interface AdminState {
  admins: IAdministrador[]
  adminsRoles: IRolesAdmin[]
  users: IUsuario[]
  quizzes: IExamen[]
  usersFiltered: IUsuario[]
}

const ADMIN_INITIAL_STATE: AdminState = {
  admins: [],
  adminsRoles: [],
  users: [],
  quizzes: [],
  usersFiltered: []
}

const AdminProvider: FCC = ({ children }) => {
  const [state, dispatch] = useReducer(AdminReducer, ADMIN_INITIAL_STATE)

  const getAdmins = async () => {
    if (!getAuthCookie()) {
      return
    }

    try {
      const { data } = await ticApi.get('/admin/get-admins')
      dispatch({ type: '[Admin] - Set Admins', payload: data })
    } catch (error) {
      dispatch({ type: '[Admin] - Set Admins', payload: [] })
    }
  }

  const getAdminsRoles = async () => {
    if (!getAuthCookie()) {
      return
    }

    try {
      const { data } = await ticApi.get('/admin/get-admins-roles')
      dispatch({ type: '[Admin] - Set Admins Roles', payload: data })
    } catch (error) {
      dispatch({ type: '[Admin] - Set Admins Roles', payload: [] })
    }
  }

  const getUsers = async () => {
    if (!getAuthCookie()) {
      return
    }

    try {
      const { data } = await ticApi.get('/admin/get-users')
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
    if (!getAuthCookie()) {
      return
    }

    try {
      const { data } = await ticApi.get('/admin/get-quizzes')
      dispatch({ type: '[Admin] - Set Quizzes', payload: data })
    } catch (error) {
      dispatch({ type: '[Admin] - Set Quizzes', payload: [] })
    }
  }

  useEffect(() => {
    getAdmins()
    getAdminsRoles()
    getUsers()
    getQuizzes()
  }, [])

  return (
    <AdminContext.Provider
      value={{
        ...state,
        // Methods
        getAdmins,
        getAdminsRoles,
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
