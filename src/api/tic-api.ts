import axios from 'axios'

export const ticApi = axios.create({
  baseURL: '/api'
})
