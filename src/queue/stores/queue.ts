import { readonly, shallowRef } from 'vue'
import {
  createGlobalState,
  createSharedComposable, whenever,
} from '@vueuse/core'
import type { Track } from '@/shared/dto/track'
import { useTracksService } from '@/shared/services/tracks'

const useQueueState = createGlobalState(() => ({
  queue: shallowRef<Track[]>([]),
}))

export const useQueue = createSharedComposable(() => {
  const { queue } = useQueueState()

  // TODO: Удалить
  const tracksService = useTracksService()
  const { result } = tracksService.tracks()
  whenever(
    result,
    () => queue.value = result.value?.tracks.data ?? [],
  )

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
