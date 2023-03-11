import type { Ref } from 'vue'
import { ref } from 'vue'
import type { WatchDebouncedOptions } from '@vueuse/core'
import { syncRefs, watchDebounced } from '@vueuse/core'

export function useDebounceRef<T>(
  target: Ref<T>,
  options?: WatchDebouncedOptions<true>,
): Ref<T> {
  const source = ref(target.value) as Ref<T>
  watchDebounced(source, value => (target.value = value), options)
  syncRefs(target, source)
  return source
}
