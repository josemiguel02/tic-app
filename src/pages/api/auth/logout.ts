import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '@/lib/jwt'

export default function handlerLogout(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return logout(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function logout(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies['auth-token']

  if (!token) {
    return res.status(401).json({ error: 'No se ha proporcionado ningún token' })
  }

  try {
    await verifyToken(token)
    return res.status(200).json({ msg: 'Ha cerrado sesión con éxito' })
  } catch (e) {
    return res.status(401).json({ error: 'Token de autorización no válido' })
  }
}
