import type { NextApiRequest, NextApiResponse } from 'next'
import { Admin } from '@/database'

export default function handlerAddAdmin(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return addAdmin(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function addAdmin(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body

  try {
    await new Admin().create(data)
    return res.status(200).json({ msg: 'Administrador agregado correctamente'  })
  } catch (error) {
    return res.status(400).json(error)
  }
}
