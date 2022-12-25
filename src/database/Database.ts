import knex, { type Knex } from 'knex'

export default class Database<T extends {} = any, R = any[]> {
  private _dbClient: string
  private _host: string
  private _port: number
  private _user: string
  private _password: string
  private _dbName: string
  protected _db: Knex<T, R[]>

  constructor() {
    this._dbClient = 'mysql2'
    this._host = process.env.DB_HOST!
    this._port = 3306
    this._user = process.env.DB_USER!
    this._password = process.env.DB_PASS!
    this._dbName = process.env.DB_NAME!
    this._db = this.createConnection()
  }

  createConnection() {
    return knex<T, R[]>({
      client: this._dbClient,
      connection: {
        host: this._host,
        port: this._port,
        user: this._user,
        password: this._password,
        database: this._dbName
      }
    })
  }
}
