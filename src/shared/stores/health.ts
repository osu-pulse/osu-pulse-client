const useHealthState = createGlobalState(() => ({
  healthy: ref(true),
}));

export const useHealth = createSharedComposable(() => {
  const { healthy } = useHealthState();

  const healthService = useHealthService();
  const { result, error } = healthService.health();
  whenever(result, () => (healthy.value = true));
  whenever(error, () => (healthy.value = false));

  return {
    healthy: readonly(healthy),
  };
});
