export const BASE_URL = import.meta.env.PROD
  ? location.origin
  : import.meta.env.VITE_BASE_URL
export const API_URL = import.meta.env.PROD
  ? `${location.origin}/api`
  : import.meta.env.VITE_API_URL
export const GQL_URL = import.meta.env.PROD
  ? `${location.origin}/graphql`
  : import.meta.env.VITE_GQL_URL
export const API_WS_URL = import.meta.env.PROD
  ? location.origin.replace(/^http/, 'ws')
  : import.meta.env.VITE_API_URL.replace(/^http/, 'ws')
export const GQL_WS_URL = import.meta.env.PROD
  ? `${location.origin}/graphql`.replace(/^http/, 'ws')
  : import.meta.env.VITE_GQL_URL.replace(/^http/, 'ws')
export const AUTH_URL = import.meta.env.PROD
  ? `${location.origin}/auth`
  : import.meta.env.VITE_AUTH_URL
