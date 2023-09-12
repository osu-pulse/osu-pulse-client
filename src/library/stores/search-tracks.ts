import { computed, readonly, ref, shallowRef } from 'vue'
import {
  createGlobalState,
  createSharedComposable,
  whenever,
} from '@vueuse/core'
import type { Track } from '@/shared/dto/track'
import { useTracksService } from '@/shared/services/tracks'
import { useMyTracksService } from '@/library/services/my-tracks'

const useSearchTracksState = createGlobalState(() => ({
  search: ref(''),
  library: shallowRef<Track[]>([]),
  global: shallowRef<Track[]>([]),
}))

export const useSearchTracks = createSharedComposable(() => {
  const { search, global, library } = useSearchTracksState()

  whenever(() => search.value === '', () => {
    library.value = []
    global.value = []
  })

  const limit = ref(20)

  const myTracksService = useMyTracksService()
  const { result: resultMyTracks, loading: loadingMyTracks } = myTracksService.myTracks(search, limit)
  whenever(
    () => resultMyTracks.value && search.value !== '',
    () => library.value = resultMyTracks.value?.myTracks ?? [],
  )

  const tracksService = useTracksService()
  const { result: resultTracks, loading: loadingTracks } = tracksService.tracks(search, limit)
  whenever(
    () => resultTracks.value && search.value !== '',
    () => global.value = resultTracks.value?.tracks ?? [],
  )

  const loading = computed(() => loadingMyTracks.value || loadingTracks.value)

  return {
    search,
    library: readonly(library),
    global: readonly(global),
    loading,
  }
})
