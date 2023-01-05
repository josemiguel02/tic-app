import { getDatabaseConnector } from '@/utils/db-injector'

const db = getDatabaseConnector()

export class Roles {
  private _rolesTable = db('roles')

  async findMany(): Promise<IRolesAdmin[]> {
    try {
      const roles = await this._rolesTable.select('*')

      if (!roles.length) {
        throw 'No hay roles registrados'
      }

      return roles
    } catch (error) {
      throw error
    }
  }

}
