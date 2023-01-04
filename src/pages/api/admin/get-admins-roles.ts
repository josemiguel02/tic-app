import type { NextApiRequest, NextApiResponse } from 'next'
import { Roles } from '@/database'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getAdminsRoles(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function getAdminsRoles(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies['auth-token']

  if (!token) {
    return res.status(400).json({ msg: 'No se ha proporcionado ningún token' })
  }

  try {
    const roles = await new Roles().findMany()
    return res.status(200).json(roles)
  } catch (error) {
    return res.status(404).json({ msg: error })
  }
}
