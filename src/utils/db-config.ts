export const dbConfig = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!) || 3306,
    user: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME!,
    pool: {
      min: 2,
      max: 40
    }
  }
}
