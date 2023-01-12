export const BASE_URL = import.meta.env.PROD
  ? `https://${window.location.host}`
  : import.meta.env.VITE_BASE_URL;

export const API_URL = import.meta.env.PROD
  ? `https://${window.location.host}/api`
  : import.meta.env.VITE_API_URL;
export const GQL_URL = import.meta.env.PROD
  ? `https://${window.location.host}/graphql`
  : import.meta.env.VITE_GQL_URL;

export const API_WS_URL = import.meta.env.PROD
  ? `wss://${window.location.host}/api`
  : import.meta.env.VITE_API_URL.replace(/^http/, 'ws');
export const GQL_WS_URL = import.meta.env.PROD
  ? `wss://${window.location.host}/graphql`
  : import.meta.env.VITE_GQL_URL.replace(/^http/, 'ws');
