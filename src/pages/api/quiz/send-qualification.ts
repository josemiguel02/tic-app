
import { Usuario } from '@/database'
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handlerSendQualification(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return sendQualification(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function sendQualification(req: NextApiRequest, res: NextApiResponse) {
  const { id, finalScore } = req.body

  try {
    await new Usuario().update(id, {
      calificacion: finalScore,
      examen_terminado: 1,
      fecha_examen: new Date()
    })

    return res.status(200).json({ msg: 'Se ha agregado la calificacion correctamente', id  })
  } catch (error) {
    return res.status(404).json({ msg: error })
  }
}
