import Axios from 'axios';
import { useAuthentication } from '~/auth/stores/authentication';

export const axios = Axios.create({
  baseURL: API_URL,
});

const { accessToken } = useAuthentication();

axios.interceptors.request.use(async (request) => {
  const token = accessToken.value;
  request.headers = {
    ...request.headers,
    Authorization: `Bearer ${token}`,
  };
  return request;
});
