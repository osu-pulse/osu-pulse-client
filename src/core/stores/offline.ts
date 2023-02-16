import { readonly, ref, watch } from 'vue'
import {
  createGlobalState,
  createSharedComposable,
  tryOnMounted,
} from '@vueuse/core'
import { useHealthService } from '@/shared/services/health'

const useOfflineState = createGlobalState(() => ({
  healthy: ref(false),
  loading: ref(true),
  offline: ref(true),
}))

export const useOffline = createSharedComposable(() => {
  const { healthy, loading, offline } = useOfflineState()

  watch(healthy, healthy => (offline.value = !healthy))

  const healthService = useHealthService()
  async function check() {
    try {
      await healthService.health()
      healthy.value = true
    }
    catch {
      healthy.value = false
    }
    finally {
      loading.value = false
    }
  }
  tryOnMounted(() => {
    void check()
  })

  return {
    offline: readonly(offline),
    healthy: readonly(healthy),
    loading: readonly(loading),
  }
})
