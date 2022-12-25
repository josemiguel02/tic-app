import axios from 'axios'

export const quizApi = axios.create({
  baseURL: '/api'
})
