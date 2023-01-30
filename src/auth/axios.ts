import Axios from 'axios';
import { useLocalStorage } from '@vueuse/core';
import { useToken } from '~/auth/token';

export const axios = Axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

axios.interceptors.request.use((config) => {
  const token = useToken.getLocalAccessToken();
  if (token) {
    config.headers!.authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (config) => {
    return config;
  },
  (error) => {
    if (error.response.data.message === 'Token has expired') {
      const token = useToken.getLocalAccessToken();
      return axios
        .post(
          '/refresh',
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        )
        .then((result) => {
          const newToken = result.data.access_token;
          useLocalStorage('access_token', newToken);
          error.config.headers.authorization = `Bearer ${newToken}`;
        });
    }
  },
);
