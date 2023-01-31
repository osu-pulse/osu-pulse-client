import { useLocalStorage } from '@vueuse/core';
import { axios } from '~/auth/axios';

export const useAuthentication = {
  async login(userId: string) {
    const { data } = await axios.post<{
      accessToken: string;
      jeifjefj: string;
    }>('/login');
    return axios.post('/login', userId).then((result) =>
      useLocalStorage('access_token', result.data.access_token, {
        serializer,
      }),
    );
  },

  async logout() {
    return axios.post('/logout').then((result) => {
      localStorage.removeItem('access_token');
    });
  },
};
