import { readonly, shallowRef } from 'vue'
import {
  createGlobalState,
  createSharedComposable,
} from '@vueuse/core'
import type { Track } from '@/shared/dto/track'

const useLibraryState = createGlobalState(() => ({
  library: shallowRef<Track[]>([]),
}))

export const useLibrary = createSharedComposable(() => {
  const { library } = useLibraryState()

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
