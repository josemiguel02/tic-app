import { serialize } from 'cookie'

export const serializeToken = (key: string, token: string|null, expires?: number) => {
  return serialize(key, token as string, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: expires ?? 1000 * 60 * 60 * 24 * 30,
    path: '/'
  })
}
