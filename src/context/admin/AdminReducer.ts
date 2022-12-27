import type { AdminState } from '.'

type AdminActionType =
  | { type: '[Admin] - Set Admins'; payload: IAdministrador[] }
  | { type: '[Admin] - Set Admins Roles'; payload: IRolesAdmin[] }
  | { type: '[Admin] - Set Users'; payload: IUsuario[] }
  | { type: '[Admin] - Set Users Filtered'; payload: IUsuario[] }
  | { type: '[Admin] - Set Quizzes'; payload: IExamen[] }

export const AdminReducer = (state: AdminState, action: AdminActionType): AdminState => {
  switch (action.type) {
    case '[Admin] - Set Admins':
      return {
        ...state,
        admins: action.payload
      }

    case '[Admin] - Set Admins Roles':
      return {
        ...state,
        adminsRoles: action.payload
      }

    case '[Admin] - Set Users':
      return {
        ...state,
        users: action.payload
      }

    case '[Admin] - Set Users Filtered':
      return {
        ...state,
        usersFiltered: action.payload
      }

    case '[Admin] - Set Quizzes':
      return {
        ...state,
        quizzes: action.payload
      }

    default:
      return state
  }
}
