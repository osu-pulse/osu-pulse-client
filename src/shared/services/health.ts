export const useHealthService = createGlobalState(() => ({
  health: () => axiosBase.get<void>('health'),
}));
