import Axios from 'axios';

export const axiosBase = Axios.create({
  baseURL: API_URL,
});

export const axiosAuth = Axios.create({
  baseURL: AUTH_URL,
});

export const axiosApi = Axios.create({
  baseURL: API_URL,
});

axiosApi.interceptors.request.use(async (request) => {
  const { getToken } = useAuthentication();

  request.headers = {
    ...request.headers,
    Authorization: `Bearer ${await getToken()}`,
  };
  return request;
});
