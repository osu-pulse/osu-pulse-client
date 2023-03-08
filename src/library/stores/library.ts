import { readonly, shallowRef } from 'vue'
import {
  createGlobalState,
  createSharedComposable, whenever,
} from '@vueuse/core'
import type { Track } from '@/shared/dto/track'
import { useTracksService } from '@/shared/services/tracks'

const useLibraryState = createGlobalState(() => ({
  library: shallowRef<Track[]>([]),
}))

export const useLibrary = createSharedComposable(() => {
  const { library } = useLibraryState()

  const tracksService = useTracksService()
  const { result } = tracksService.tracks()
  whenever(result, ({ tracks: { data } }) => library.value = data)

  function add(track: Track) {
    library.value = [...library.value, track]
  }

  function remove(trackId: string) {
    library.value = library.value.filter(({ id }) => id !== trackId)
  }

  return {
    library: readonly(library),

    add,
    remove,
  }
})
