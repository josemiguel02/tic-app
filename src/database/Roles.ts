import Database from './Database'

export class Roles extends Database<IRolesAdmin, IRolesAdmin[]> {
  private _rolesTable = this._db('roles')

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
