import type { NextApiRequest, NextApiResponse } from 'next'
import { Usuario } from '@/database'
import { signToken } from '@/lib/jwt'

export default function handlerLoginUser(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return loginUser(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function loginUser(req: NextApiRequest, res: NextApiResponse) {
  const { identification = '', password = '' } = req.body

  try {
    if (!identification.trim() && !password.trim()) {
      throw 'No se han proporcionado las credenciales'
    }

    const user = await new Usuario().findByIdentification(identification)
    const { id, nombre, apellido, cedula, cargo, direccion, celular, modelo, operadora, calificacion, examen_terminado } = user

    const userData: IUser = {
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

    if (cedula === identification && cedula === password) {
      const jwtToken = signToken(userData)

      return res.status(200).json({
        msg: 'Inicio de sesión con éxito',
        token: jwtToken,
        user: userData
      })
    }

  } catch (error) {
    return res.status(400).json({ msg: error })
  }

  return res.status(401).json({ msg: 'Cédula de identidad y/o contraseña no son válidos' })
}
