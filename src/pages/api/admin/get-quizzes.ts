import type { NextApiRequest, NextApiResponse } from 'next'
import { Examen } from '@/database'
import { verifyToken } from '@/lib/jwt'
// import { isAdmin } from '@/utils/check-user-type'

export default function handlerGetQuizzes(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getQuizzes(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function getQuizzes(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies['auth-token']

  if (!token) {
    return res.status(400).json({ msg: 'No se ha proporcionado ningún token' })
  }

  try {
    const quizzes = await new Examen().findMany()
    return res.status(200).json(quizzes)
    // return res.status(401).json({ msg: 'No estás autorizado para acceder a este contenido' })
  } catch (error) {
    return res.status(400).json({ msg: error })
  }
}
