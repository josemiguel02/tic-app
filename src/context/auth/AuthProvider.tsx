import { useEffect, useReducer } from 'react'
import Router from 'next/router'
import AuthContext from './AuthContext'
import { AuthReducer } from './AuthReducer'
import { quizApi } from '@/api/quiz-api'
import { getAuthCookie, setAuthCookie, removeAuthCookie } from '@/utils/cookies'

export interface IAuthState {
  isLoggedIn: boolean
  user?: IUser
  admin?: IAdmin
}

const AUTH_INITIAL_STATE: IAuthState = {
  isLoggedIn: false,
  user: undefined,
  admin: undefined
}

type LoginResponse = {
  msg: string
  token: string
  user: IUser | IAdmin
}

const AuthProvider: FCC = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, AUTH_INITIAL_STATE)

  const loginUser = async (credentials: UserFormData): Promise<{ isValidLoginUser: boolean, msg: string }> => {
    const result = { isValidLoginUser: false, msg: '' }

    try {
      const { data } = await quizApi.post<LoginResponse>('/auth/user/login', credentials)
      const { token, user } = data
      setAuthCookie(token)
      dispatch({ type: '[AUTH] - LOGIN', payload: user })
      result.isValidLoginUser = true
    } catch (error: any) {
      result.msg = error.response.data.msg
    }

    return result
  }

  const logout = async () => {
    try {
      await quizApi.post('/auth/logout')
      removeAuthCookie()
      Router.reload()
    } catch (e) {
      Router.reload()
    }
  }

  const checkToken = async () => {
    if (!getAuthCookie()) {
      return
    }

    try {
      const { data } = await quizApi.get<LoginResponse>('/auth/validate-token')
      const { token, user } = data
      setAuthCookie(token)
      dispatch({ type: '[AUTH] - LOGIN', payload: user })
    } catch (error) {
      removeAuthCookie()
    }
  }

  const loginAdmin = async (credentials: UserFormData): Promise<{ isValidLoginAdmin: boolean, msg: string }> => {
    const result = { isValidLoginAdmin: false, msg: '' }

    try {
      const { data } = await quizApi.post<LoginResponse>('/auth/admin/login', credentials)
      const { token, user } = data
      setAuthCookie(token)
      dispatch({ type: '[AUTH] - LOGIN', payload: user })
      result.isValidLoginAdmin = true
    } catch (error: any) {
      result.msg = error.response.data.msg
    }

    return result
  }

  useEffect(() => {
    checkToken()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...state,
        // Methods
        loginUser,
        loginAdmin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
