/* eslint-disable no-unused-vars */
import { FC, PropsWithChildren, Dispatch, SetStateAction } from 'react'

declare global {
  type FCC<P = {}> = FC<PropsWithChildren<P>>

  interface UserFormData {
    identification: string
    password: string
  }

  interface UserPayload {}

  interface IUser {
    id: number
    name: string
    surname: string
    identification: string
    position: string
    adress: string
    phoneNumber: string
    phoneModel: string
    phoneOperator: string
    qualification: number | null
    quizFinished: number
  }

  interface IAdmin extends Pick<IUser, 'id' | 'name' | 'surname' | 'identification'> {
    role: string
  }

  interface IOpciones {
    id: string
    nombre?: string
    img?: string
  }

  interface IPreguntas {
    id: string
    enunciado: string
    opciones: IOpciones[]
    puntaje: number
    respuesta?: number
    tipo: 'seleccion' | 'tipeo'
  }

  interface IAdministrador {
    id: number
    nombre: string
    apellido: string
    cedula: string
    rol: string
    rol_id: number
  }

  interface IRolesAdmin {
    id: number
    rol: string
  }

  interface IUsuario {
    id: number
    nombre: string
    apellido: string
    cedula: string
    direccion: string
    celular: string
    modelo: string
    operadora: string
    cargo: string
    calificacion: number | null
    examen_terminado: number
    examen_id: number
    fecha_examen: Date | null
  }

  interface IExamen {
    id: number
    cargo: string
    preguntas: IPreguntas[]
  }

  type UsuarioDTO = Omit<IUsuario, 'id' | 'cargo'> & {
    examen_id: number
  }

  type AdminDTO = Omit<IAdministrador, 'id' | 'rol'> & {
    rol_id: number
  }

  type ExamenDTO = Omit<IExamen, 'id'>

  type ReportType = {
    position: string
    quiz_status: 'TODOS' | 'APROBADOS' | 'REPROBADOS'| 'PENDIENTES'
    dateFrom: string
    dateTo: string
  }
}

export {}
