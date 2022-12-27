import type { NextApiRequest, NextApiResponse } from 'next'
import { Admin } from '@/database'

export default function handlerEditAdmin(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return editAdmin(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function editAdmin(req: NextApiRequest, res: NextApiResponse) {
  const { id, data } = req.body

  try {
    await new Admin().update(id, data)
    return res.status(200).json({ msg: 'Administrador editado correctamente' })
  } catch (error) {
    return res.status(400).json(error)
  }
}
