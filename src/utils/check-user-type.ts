import { verifyToken } from '@/lib/jwt'
import { getAuthCookie } from './cookies'

const jwtSecret = process.env.NEXT_PUBLIC_JWT

const isAdmin = (user: IUser | IAdmin): boolean =>
  Object.hasOwn(user, 'role')

export const hasTokenAndIsAdmin = async (): Promise<boolean | undefined> => {
  const token = getAuthCookie()

  if (token) {
    const user = await verifyToken(token, jwtSecret)
    return !!token && isAdmin(user)
  }
}

export const hasTokenAndIsUser = async (): Promise<boolean | undefined> => {
  const token = getAuthCookie()

  if (token) {
    const user = await verifyToken(token, jwtSecret)
    return !!token && !isAdmin(user)
  }
}
