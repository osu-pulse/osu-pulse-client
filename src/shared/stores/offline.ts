const useOfflineState = createGlobalState(() => ({
  isHealthy: ref(false),
  isLoading: ref(true),
  isOffline: ref(true),
}));

export const useOffline = createSharedComposable(() => {
  const { isHealthy, isLoading, isOffline } = useOfflineState();

  watch(isHealthy, (isHealthy) => (isOffline.value = !isHealthy));

  const healthService = useHealthService();
  async function check() {
    try {
      await healthService.health();
      isHealthy.value = true;
    } catch {
      isHealthy.value = false;
    } finally {
      isLoading.value = false;
    }
  }
  tryOnMounted(check);

  return {
    isOffline: readonly(isOffline),
    isHealthy: readonly(isHealthy),
    isLoading: readonly(isLoading),
  };
});
