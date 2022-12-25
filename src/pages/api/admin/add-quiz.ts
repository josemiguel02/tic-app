import { Examen } from '@/database'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handlerAddQuiz(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return addQuiz(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function addQuiz(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body

  try {
    await new Examen().create(data)
    return res.status(200).json({ msg: 'Examen agregado correctamente'  })
  } catch (error) {
    return res.status(400).json(error)
  }
}
