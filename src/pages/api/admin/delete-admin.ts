import type { NextApiRequest, NextApiResponse } from 'next'
import { Admin } from '@/database'

export default function handlerDeleteAdmin(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return deleteAdmin(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function deleteAdmin(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body

  try {
    await new Admin().delete(id)
    return res.status(200).json({ msg: 'Administrador eliminado correctamente' })
  } catch (error) {
    return res.status(400).json(error)
  }
}
