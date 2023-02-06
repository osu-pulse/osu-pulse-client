const useOfflineState = createGlobalState(() => ({
  isOffline: ref(false),
}));

export const useOffline = createSharedComposable(() => {
  const { isOffline } = useOfflineState();

  const online = useOnline();
  const { healthy } = useHealth();
  watch(
    [healthy, online],
    ([healthy, online]) => (isOffline.value = !(online && healthy)),
  );

  return {
    isOffline,
  };
});
