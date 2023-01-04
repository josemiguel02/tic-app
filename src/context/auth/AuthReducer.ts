import type { IAuthState } from './AuthProvider'
// import { isAdmin } from '@/utils/check-user-type'

type AuthActionType =
  | { type: '[AUTH] - LOGIN'; payload: IUser | IAdmin }
  | { type: '[AUTH] - LOGOUT' }

export const AuthReducer = (state: IAuthState, action: AuthActionType): IAuthState => {

  switch (action.type) {
    case '[AUTH] - LOGIN':
      const admin = action.payload as IAdmin
      if (admin?.role !== undefined) {
        return {
          ...state,
          isLoggedIn: true,
          admin: action.payload as IAdmin
        }
      }

      return {
        ...state,
        isLoggedIn: true,
        user: action.payload as IUser
      }

    case '[AUTH] - LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        user: undefined
      }

    default:
      return state
  }
}
