import { Examen } from '@/database'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handlerGetQuizzes(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getQuizzes(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function getQuizzes(req: NextApiRequest, res: NextApiResponse) {
  try {
    const quizzes = await new Examen().findMany()
    res.status(200).json(quizzes)
  } catch (error) {
    return res.status(400).json({ msg: error })
  }
}
