import { readonly, ref } from 'vue'
import { createGlobalState, createSharedComposable } from '@vueuse/core'
import { useHealthService } from '@/shared/services/health'

const useOfflineState = createGlobalState(() => ({
  loading: ref(true),
  offline: ref(true),
}))

export const useOffline = createSharedComposable(() => {
  const { loading, offline } = useOfflineState()

  const healthService = useHealthService()
  async function check() {
    try {
      await healthService.health()
      offline.value = false
    }
    catch {
      offline.value = true
    }
    finally {
      loading.value = false
    }
  }

  return {
    offline: readonly(offline),
    loading: readonly(loading),

    check,
  }
})
