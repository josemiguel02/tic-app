import type { NextApiRequest, NextApiResponse } from 'next'
import { signToken, verifyToken } from '@/lib/jwt'
// import { isAdmin } from '@/utils/check-user-type'
import { Admin, Usuario } from '@/database'

export default function handlerValidateToken(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return validateToken(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function validateToken(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies['auth-token']

  if (!token) {
    return res.status(401).json({ msg: 'No se ha proporcionado ningún token' })
  }

  try {
    const user = await verifyToken(token)
    // #TODO: Verificar en la BD si se encuentra el usuario y luego responder con el token validado
    const admin = user as IAdmin
    if(admin?.role !== undefined) {
      const admin = await new Admin().findByID(user.id)
      const { id, nombre, apellido, cedula, rol } = admin

      const adminData: IAdmin = {
        id,
        name: nombre,
        surname: apellido,
        identification: cedula,
        role: rol
      }

      const jwtToken = signToken(adminData)

      return res.status(200).json({ msg: 'Token de autorización validado correctamente', token: jwtToken, user: adminData })
    }

    const usuario = await new Usuario().findByID(user.id)
    const { id, nombre, apellido, cedula, cargo, direccion, celular, modelo, operadora, calificacion, examen_terminado } = usuario

    const usuarioData: IUser = {
      id,
      name: nombre,
      surname: apellido,
      identification: cedula,
      position: cargo,
      adress: direccion,
      phoneNumber: celular,
      phoneModel: modelo,
      phoneOperator: operadora,
      qualification: calificacion,
      quizFinished: examen_terminado
    }

    const jwtToken = signToken(usuarioData)

    return res.status(200).json({ msg: 'Token de autorización validado correctamente', token: jwtToken, user: usuarioData })
  } catch (error) {
    return res.status(401).json(error)
  }
}
