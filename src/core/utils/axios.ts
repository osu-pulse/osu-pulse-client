import Axios from 'axios';
import { getToken } from '@baloise/vue-keycloak';

export const axios = Axios.create({
  baseURL: API_URL,
});

axios.interceptors.request.use(async (request) => {
  const token = await getToken();
  request.headers = {
    ...request.headers,
    Authorization: `Bearer ${token}`,
  };
  return request;
});
