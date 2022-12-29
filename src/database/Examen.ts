import Database from './Database'

export class Examen extends Database<IExamen, IExamen[]> {
  private _quizTable = this._db('examen')

  async findMany() {
    try {
      const quizzes = await this._quizTable.select('*')

      if (!quizzes.length) {
        throw 'No hay exámenes registrados'
      }

      return quizzes
    } catch (error) {
      throw error
    }
  }

  async create(data: ExamenDTO) {
    try {
      await this._quizTable.insert(data)
    } catch (error) {
      throw 'No se pudo agregar el examen'
    }
  }

  async update(id: number, data: Partial<ExamenDTO>) {
    try {
      await this._quizTable.where('id', id).update(data)
    } catch (error) {
      throw 'No se pudo actualizar el examen'
    }
  }

  async delete(id: number) {
    try {
      await this._quizTable.where('id', id).delete()
    } catch (error) {
      throw 'No se pudo eliminar el examen'
    }
  }
}
