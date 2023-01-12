import { breakpointsTailwind } from '@vueuse/core';

export const useMobile = createGlobalState(() => {
  const { smaller } = useBreakpoints(breakpointsTailwind);

  const breakpoint = ref<keyof typeof breakpointsTailwind>('sm');
  const size = computed(() => breakpointsTailwind[breakpoint.value]);

  const isMobile = smaller(breakpoint.value);

  return {
    breakpoint,
    size,
    isMobile,
  };
});
