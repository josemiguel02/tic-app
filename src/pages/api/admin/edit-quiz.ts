import type { NextApiRequest, NextApiResponse } from 'next'
import { Examen } from '@/database'

export default function handlerEditQuiz(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return editQuiz(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function editQuiz(req: NextApiRequest, res: NextApiResponse) {
  const { id, data } = req.body

  try {
    await new Examen().update(id, data)
    return res.status(200).json({ msg: 'Examen editado correctamente' })
  } catch (error) {
    return res.status(400).json(error)
  }
}
