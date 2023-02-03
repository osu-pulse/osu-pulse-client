import Axios from 'axios';

export const axiosAuth = Axios.create({
  baseURL: AUTH_URL,
});

export const axiosApi = Axios.create({
  baseURL: API_URL,
});

axiosApi.interceptors.request.use(async (request) => {
  const { accessToken } = useAuthentication();

  const token = accessToken.value;
  request.headers = {
    ...request.headers,
    Authorization: `Bearer ${token}`,
  };
  return request;
});
