import { readonly, ref } from 'vue'
import {
  createGlobalState,
  createSharedComposable,
  syncRefs, whenever,
} from '@vueuse/core'
import { useHealthService } from '@/shared/services/health'

const useOfflineState = createGlobalState(() => ({
  loading: ref(true),
  offline: ref(true),
}))

export const useOffline = createSharedComposable(() => {
  const { loading, offline } = useOfflineState()

  const healthService = useHealthService()
  const { error, response, isLoading } = healthService.health()
  syncRefs(isLoading, loading)
  whenever(response, () => offline.value = false)
  whenever(error, () => offline.value = true)

  return {
    offline: readonly(offline),
    loading: readonly(loading),
  }
})
