import type { NextApiRequest, NextApiResponse } from 'next'
import { Usuario } from '@/database'
import { verifyToken } from '@/lib/jwt'
// import { isAdmin } from '@/utils/check-user-type'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getQuestions(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function getQuestions(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies['auth-token']

  if (!token) {
    return res.status(400).json({ msg: 'No se ha proporcionado ningún token' })
  }

  try {
    const user = await verifyToken(token)

    // if (!isAdmin(user)) {
    // }

    const preguntas = await new Usuario().findQuiz(user.id)
    return res.status(200).json(preguntas)
    // return res.status(401).json({ msg: 'No estas autorizado para acceder a este contenido' })
  } catch (error) {
    return res.status(404).json({ msg: error })
  }
}
