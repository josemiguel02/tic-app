import type { AdminState } from '.'

type AdminActionType =
  | { type: '[Admin] - Set Users'; payload: IUsuario[] }
  | { type: '[Admin] - Set Users Filtered'; payload: IUsuario[] }
  | { type: '[Admin] - Set Quizzes'; payload: IExamen[] }

export const AdminReducer = (state: AdminState, action: AdminActionType): AdminState => {
  switch (action.type) {
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
