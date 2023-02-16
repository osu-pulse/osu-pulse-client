import { readonly, shallowRef } from 'vue'
import {
  createGlobalState,
  createSharedComposable,
  whenever,
} from '@vueuse/core'
import type { Track } from '@/shared/dto/track'
import { useTracksService } from '@/shared/services/tracks'

const useQueueState = createGlobalState(() => ({
  queue: shallowRef<Track[]>([]),
}))

export const useQueue = createSharedComposable(() => {
  const { queue } = useQueueState()

  const tracksService = useTracksService()
  const { result } = tracksService.tracks()
  whenever(result, ({ tracks }) => (queue.value = tracks.data))

  return {
    queue: readonly(queue),
  }
})
