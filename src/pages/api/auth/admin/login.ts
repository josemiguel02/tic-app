import type { NextApiRequest, NextApiResponse } from 'next'
import { Admin } from '@/database'
import { signToken } from '@/lib/jwt'

export default function handlerLoginAdmin(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return loginAdmin(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function loginAdmin(req: NextApiRequest, res: NextApiResponse) {
  const { identification = '', password = '' } = req.body

  try {
    if (!identification.trim() && !password.trim()) {
      throw 'No se han proporcionado las credenciales'
    }

    const admin = await new Admin().findByIdentification(identification)
    const { id, nombre, apellido, cedula, rol } = admin

    const adminData: IAdmin = {
      id,
      name: nombre,
      surname: apellido,
      identification: cedula,
      role: rol
    }

    if (cedula === identification && cedula === password) {
      const jwtToken = signToken(adminData)

      return res.status(200).json({
        msg: 'Inicio de sesión con éxito',
        token: jwtToken,
        user: adminData
      })
    }

  } catch (error) {
    return res.status(400).json({ msg: error })
  }

  return res.status(401).json({ msg: 'Cédula de identidad y/o contraseña no son válidos' })
}
