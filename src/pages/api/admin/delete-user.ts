import type { NextApiRequest, NextApiResponse } from 'next'
import { Usuario } from '@/database'

export default function handlerDeleteUser(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return deleteUser(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function deleteUser(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body

  try {
    await new Usuario().delete(id)
    return res.status(200).json({ msg: 'Usuario eliminado correctamente' })
  } catch (error) {
    return res.status(400).json(error)
  }
}
