import { readonly } from 'vue'
import {
  createGlobalState,
  createSharedComposable,
  useLocalStorage,
  whenever,
} from '@vueuse/core'
import type { Track } from '@/shared/dto/track'
import { useMyTracksService } from '@/library/services/my-tracks'
import { serializer } from '@/shared/utils/serializer'

const useMyTracksState = createGlobalState(() => ({
  tracks: useLocalStorage<Track[]>('my-tracks_tracks', [], { serializer, shallow: true }),
}))

export const useMyTracks = createSharedComposable(() => {
  const { tracks } = useMyTracksState()

  const myTracksService = useMyTracksService()

  const { result } = myTracksService.myTracks()
  whenever(result, ({ myTracks }) => tracks.value = myTracks)

  function has(trackId: string): boolean {
    return tracks.value.some(({ id }) => id === trackId)
  }

  const { mutate: mutateAddMyTrack } = myTracksService.addMyTrack()
  async function add(track: Track) {
    tracks.value = [track, ...tracks.value]
    await mutateAddMyTrack({ trackId: track.id })
  }

  const { mutate: mutateRemoveMyTrack } = myTracksService.removeMyTrack()
  async function remove(trackId: string) {
    tracks.value = tracks.value.filter(({ id }) => id !== trackId)
    await mutateRemoveMyTrack({ trackId })
  }

  return {
    tracks: readonly(tracks),

    has,
    add,
    remove,
  }
})
