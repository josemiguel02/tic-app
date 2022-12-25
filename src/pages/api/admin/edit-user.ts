import type { NextApiRequest, NextApiResponse } from 'next'
import { Usuario } from '@/database'

export default function handlerEditUser(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return editUser(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function editUser(req: NextApiRequest, res: NextApiResponse) {
  const { id, datos } = req.body

  try {
    await new Usuario().update(id, datos)
    return res.status(200).json({ msg: 'Usuario editado correctamente' })
  } catch (error) {
    return res.status(400).json(error)
  }
}
