import type { NextApiRequest, NextApiResponse } from 'next'
import { Examen } from '@/database'

export default function handlerDeleteQuiz(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return deleteQuiz(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function deleteQuiz(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body

  try {
    await new Examen().delete(id)
    return res.status(200).json({ msg: 'Examen eliminado correctamente' })
  } catch (error) {
    return res.status(400).json(error)
  }
}
