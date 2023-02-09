const useOfflineState = createGlobalState(() => ({
  isHealthy: ref(false),
  isPending: ref(false),
  isOffline: ref(false),
}));

export const useOffline = createSharedComposable(() => {
  const { isHealthy, isPending, isOffline } = useOfflineState();

  watch(isHealthy, (isHealthy) => (isOffline.value = !isHealthy));

  const healthService = useHealthService();
  async function check() {
    try {
      isPending.value = true;
      await healthService.health();
      isHealthy.value = true;
    } catch {
      isHealthy.value = false;
    } finally {
      isPending.value = false;
    }
  }

  return {
    isOffline: readonly(isOffline),
    isHealthy: readonly(isHealthy),
    isPending: readonly(isPending),

    check,
  };
});
