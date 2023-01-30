export const useToken = {
  getLocalAccessToken() {
    return localStorage.getItem('access_token');
  },

  refreshToken() {},

  setTimer() {},
};
