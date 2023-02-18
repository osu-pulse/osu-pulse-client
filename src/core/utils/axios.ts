import Axios from 'axios'
import { useAuthentication } from '@/auth/stores/authentication'

export const axiosBase = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export const axiosAuth = Axios.create({
  baseURL: import.meta.env.VITE_AUTH_URL,
})

export const axiosApi = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

axiosApi.interceptors.request.use(async (request) => {
  const { getToken } = useAuthentication()

  request.headers.set('Authorization', `Bearer ${await getToken()}`)

  return request
})
