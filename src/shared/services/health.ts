import { createGlobalState } from '@vueuse/core'
import { useAxios } from '@vueuse/integrations/useAxios'
import { axiosBase } from '@/core/utils/axios'

export const useHealthService = createGlobalState(() => ({
  health: () => useAxios<void>('health', axiosBase),
}))
