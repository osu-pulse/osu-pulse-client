import Axios from 'axios'
import { API_URL, AUTH_URL } from '@/shared/constants/url-config'
import { useAuthentication } from '@/auth/stores/authentication'

export const axiosBase = Axios.create({
  baseURL: API_URL,
})

export const axiosAuth = Axios.create({
  baseURL: AUTH_URL,
})

export const axiosApi = Axios.create({
  baseURL: API_URL,
})

axiosApi.interceptors.request.use(async (request) => {
  const { getToken } = useAuthentication()

  request.headers.set('Authorization', `Bearer ${await getToken()}`)

  return request
})
