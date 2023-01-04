import knex, { Knex } from 'knex'
import { dbConfig } from './db-config'

let cachedConnection:  Knex<any, unknown[]>

export const getDatabaseConnector = () => {
  if (cachedConnection) {
    console.log('Cached Connection')
    return cachedConnection
  }

  console.log('New Connection')
  const connection = knex(dbConfig)
  cachedConnection = connection
  return connection
}
