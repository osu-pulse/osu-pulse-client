import { createGlobalState } from '@vueuse/core'
import { axiosBase } from '@/core/utils/axios'

export const useHealthService = createGlobalState(() => ({
  health: () => axiosBase.get<void>('health'),
}))
