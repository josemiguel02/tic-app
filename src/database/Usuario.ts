import Database from './Database'

export class Usuario extends Database<IUsuario, IUsuario[]> {
  private _userTable = this._db('usuario')

  async findQuiz(id: number): Promise<IPreguntas[]> {
    try {
      const [user] = await this._userTable
        .join('examen', 'usuario.examen_id', 'examen.id')
        .where('usuario.id', id)
        .select(
          'examen.preguntas'
        )

      if (!user) {
        throw 'El usuario no está registrado'
      }

      if(!user.preguntas.length) {
        throw 'El usuario no tiene asignado un examen'
      }

      return user.preguntas
    } catch (error) {
      throw error
    }
  }

  async findMany(): Promise<IUsuario[]> {
    try {
      const users = await this._userTable
        .leftJoin('examen', 'usuario.examen_id', 'examen.id')
        .select(
          'usuario.id',
          'nombre',
          'apellido',
          'cedula',
          'direccion',
          'celular',
          'modelo',
          'operadora',
          'examen.cargo',
          'calificacion',
          'examen_terminado',
          'usuario.examen_id',
          'fecha_examen'
        )

      if (!users.length) {
        throw 'No hay usuarios registrados'
      }

      return users
    } catch (error) {
      throw error
    }
  }

  async findByIdentification(identification: string): Promise<IUsuario> {
    try {
      const [user] = await this._userTable
        .join('examen', 'usuario.examen_id', 'examen.id')
        .where('usuario.cedula', identification)
        .select(
          'usuario.id',
          'nombre',
          'apellido',
          'cedula',
          'direccion',
          'celular',
          'modelo',
          'operadora',
          'examen.cargo',
          'calificacion',
          'examen_terminado',
          'usuario.examen_id',
          'fecha_examen'
        )

      if (!user) {
        throw 'El usuario no está registrado'
      }

      return user
    } catch (error) {
      throw error
    }
  }

  async findByID(id: number): Promise<IUsuario> {
    try {
      const [user] = await this._userTable
        .join('examen', 'usuario.examen_id', 'examen.id')
        .where('usuario.id', id)
        .select(
          'usuario.id',
          'nombre',
          'apellido',
          'cedula',
          'direccion',
          'examen.cargo',
          'celular',
          'modelo',
          'operadora',
          'calificacion',
          'examen_terminado'
        )

      if (!user) {
        throw 'El usuario no está registrado'
      }

      return user
    } catch (error) {
      throw error
    }
  }

  async create(data: UsuarioDTO | UsuarioDTO[]) {
    try {
      const userAdded = await this._userTable.insert(data)

      if (!userAdded.length) {
        throw 'No se pudo agregar el usuario en la base de datos'
      }

      return userAdded
    } catch (error) {
      throw error
    }
  }

  async update(id: number, data: Partial<UsuarioDTO>) {
    try {
      await this._userTable.where('id', id).update(data)
    } catch (error) {
      throw error
    }
  }

  async delete(id: number) {
    try {
      await this._userTable.where('id', id).delete()
    } catch (error) {
      throw error
    }
  }
}