import type { NextApiRequest, NextApiResponse } from 'next'
import csv from 'csvtojson'
import { Usuario } from '@/database'

export default function handlerAddUsers(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'POST':
      return addUsers(req, res)

    default:
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}

async function addUsers(req: NextApiRequest, res: NextApiResponse) {
  const { csvString } = req.body

  try {
    const parseCSV: UsuarioDTO[] = await csv({ output: 'json', checkType: true }).fromString(csvString)
    await new Usuario().create(parseCSV)
    return res.status(200).json({ msg: 'Usuarios agregados correctamente' })
  } catch (error) {
    return res.status(400).json(error)
  }
}
