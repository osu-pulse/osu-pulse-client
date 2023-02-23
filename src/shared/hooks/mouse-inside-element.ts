import type { MaybeComputedRef } from '@vueuse/core'
import { useEventListener } from '@vueuse/core'
import { readonly, ref } from 'vue'

export const useMouseInsideElement = (target: MaybeComputedRef<EventTarget | null | undefined>) => {
  const inside = ref(false)

  useEventListener(target, 'mouseenter', () => inside.value = true)
  useEventListener(target, 'mouseleave', () => inside.value = false)

  return {
    inside: readonly(inside),
  }
}
