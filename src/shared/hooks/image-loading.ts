import type { MaybeComputedRef } from '@vueuse/core'
import { resolveRef, resolveUnref, useEventListener } from '@vueuse/core'
import { readonly, ref, watch } from 'vue'

export const useImageLoading = (src: MaybeComputedRef<string | undefined>) => {
  const image = new Image()
  const loading = ref(false)

  watch(resolveRef(src), (src) => {
    loading.value = Boolean(src)
    image.src = src!
  }, { immediate: true })

  useEventListener(image, 'load', (event: Event) => {
    const target = event.target as HTMLImageElement
    if (target.src === resolveUnref(src))
      loading.value = false
  })

  return readonly(loading)
}
