import Cookie from 'js-cookie'

const AUTH_COOKIE_KEY = 'auth-token'

export const getAuthCookie = () => Cookie.get(AUTH_COOKIE_KEY)

export const setAuthCookie = (token: string) => {
  Cookie.set(AUTH_COOKIE_KEY, token, {
    expires: 30,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  })
}

export const removeAuthCookie = () => {
  Cookie.remove(AUTH_COOKIE_KEY)
}
