import type { NextApiRequest, NextApiResponse } from 'next'
import { Usuario } from '@/database'

export default function handlerAddUser(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return addUser(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function addUser(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body

  try {
    await new Usuario().create(data)
    return res.status(200).json({ msg: 'Usuario agregado correctamente' })
  } catch (error) {
    return res.status(400).json(error)
  }
}
