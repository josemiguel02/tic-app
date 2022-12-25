/* eslint-disable no-unused-vars */
import React from 'react'

interface IAuthContext {
  isLoggedIn: boolean
  user?: IUser
  admin?: IAdmin
  loginUser: (credentials: UserFormData) => Promise<{
    isValidLoginUser: boolean;
    msg: string;
}>
  loginAdmin: (credentials: UserFormData) => Promise<{
    isValidLoginAdmin: boolean;
    msg: string;
  }>
  logout: () => void
}

const AuthContext = React.createContext({} as IAuthContext)

export default AuthContext
