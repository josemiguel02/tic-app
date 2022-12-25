import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET_SEED!

export const signToken = (userPayload: IUser | IAdmin) => {
  if (!JWT_SECRET) {
    throw new Error('JWT Secret no está definido en las variables de entorno')
  }

  return jwt.sign(
    // payload
    userPayload,

    // secret seed
    JWT_SECRET,

    // options
    { expiresIn: '30d' }
  )
}

export const verifyToken = (token: string, jwtSecret = JWT_SECRET) => {
  if (!jwtSecret) {
    throw new Error('JWT Secret no está definido en las variables de entorno')
  }

  return new Promise<IUser | IAdmin>((resolve, reject) => {
    try {
      jwt.verify(token, jwtSecret, (err, payload) => {
        if (err) return reject('JWT no es válido')
        resolve(payload as IUser | IAdmin)
      })
    } catch (error) {
      reject('JWT no es válido')
    }
  })
}
