import { readonly, shallowRef } from 'vue'
import { createGlobalState, createSharedComposable } from '@vueuse/core'
import type { Track } from '@/shared/dto/track'

const useQueueState = createGlobalState(() => ({
  queue: shallowRef<Track[]>([]),
}))

export const useQueue = createSharedComposable(() => {
  const { queue } = useQueueState()

  function append(track: Track) {
    queue.value = [...queue.value, track]
  }

  function remove(trackId: string) {
    queue.value = queue.value.filter(({ id }) => id !== trackId)
  }

  return {
    queue: readonly(queue),

    append,
    remove,
  }
})
