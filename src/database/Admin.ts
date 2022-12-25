import Database from './Database'

export class Admin extends Database<IAdministrador, IAdministrador[]> {
  private _adminTable = this._db('admin')

  async findMany(): Promise<IAdministrador[]> {
    try {
      const admins = await this._adminTable
        .join('roles', 'admin.rol_id', 'roles.id')
        .select(
          'admin.id',
          'nombre',
          'apellido',
          'cedula',
          'roles.rol'
        )

      if (!admins.length) {
        throw 'No hay administradores registrados'
      }

      return admins
    } catch (error) {
      throw error
    }
  }

  async findByIdentification(identification: string): Promise<IAdministrador> {
    try {
      const [admin] = await this._adminTable
        .join('roles', 'admin.rol_id', 'roles.id')
        .where('admin.cedula', identification)
        .select(
          'admin.id',
          'nombre',
          'apellido',
          'cedula',
          'roles.rol'
        )

      if (!admin) {
        throw 'El administrador no está registrado'
      }

      return admin
    } catch (error) {
      throw error
    }
  }

  async findByID(id: number): Promise<IAdministrador> {
    try {
      const [admin] = await this._adminTable
        .join('roles', 'admin.rol_id', 'roles.id')
        .where('admin.id', id)
        .select(
          'admin.id',
          'nombre',
          'apellido',
          'cedula',
          'roles.rol'
        )

      if (!admin) {
        throw 'No existe un administrador registrado con dicho id'
      }

      return admin
    } catch (error) {
      throw error
    }
  }

  async create(data: AdminDTO | AdminDTO[]) {
    try {
      const adminAdded = await this._adminTable.insert(data)

      if (!adminAdded.length) {
        throw 'No se pudo agregar el admin en la base de datos'
      }

      return adminAdded
    } catch (error) {
      throw error
    }
  }

  async update(id: number, data: Partial<AdminDTO>) {
    try {
      const adminUpdated = await this._adminTable.where('id', id).update(data)
      console.log(adminUpdated)
    } catch (error) {
      throw error
    }
  }

  async delete(id: number) {
    try {
      const adminDeleted = await this._adminTable.where('id', id).delete()
      console.log(adminDeleted)
    } catch (error) {
      throw error
    }
  }
}
