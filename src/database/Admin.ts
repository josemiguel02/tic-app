// import Database from './Database'
import { getDatabaseConnector } from '@/utils/db-injector'

const db = getDatabaseConnector()

export class Admin {
  private _adminTable = db('admin')

  async findMany(): Promise<IAdministrador[]> {
    try {
      const admins = await this._adminTable
        .join('roles', 'admin.rol_id', 'roles.id')
        .select(
          'admin.id',
          'nombre',
          'apellido',
          'cedula',
          'roles.rol',
          'admin.rol_id'
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
      const admin = await this._adminTable
        .join('roles', 'admin.rol_id', 'roles.id')
        .where('admin.cedula', identification)
        .select(
          'admin.id',
          'nombre',
          'apellido',
          'cedula',
          'roles.rol'
        ).first()

      if (!admin) {
        throw 'El administrador no se encuentra registrado'
      }

      return admin
    } catch (error) {
      throw error
    }
  }

  async findByID(id: number): Promise<IAdministrador> {
    try {
      const admin = await this._adminTable
        .join('roles', 'admin.rol_id', 'roles.id')
        .where('admin.id', id)
        .select(
          'admin.id',
          'nombre',
          'apellido',
          'cedula',
          'roles.rol'
        ).first()

      if (!admin) {
        throw 'El administrador no se encuentra registrado'
      }

      return admin
    } catch (error) {
      throw error
    }
  }

  async create(data: AdminDTO) {
    try {
      const adminFound = await this._adminTable
        .where('cedula', data.cedula)
        .select('id')

      if (adminFound.length) {
        throw 'El administrador ya se encuentra registrado'
      }

      const adminAdded = await this._adminTable.insert(data)

      if (!adminAdded.length) {
        throw 'No se pudo agregar el administrador'
      }

      return adminAdded
    } catch (error) {
      throw error
    }
  }

  async update(id: number, data: Partial<AdminDTO>) {
    try {
      await this._adminTable.where('id', id).update(data)
    } catch (error) {
      throw 'No se pudo actualizar el administrador'
    }
  }

  async delete(id: number) {
    try {
      await this._adminTable.where('id', id).delete()
    } catch (error) {
      throw 'No se pudo eliminar el administrador'
    }
  }
}
