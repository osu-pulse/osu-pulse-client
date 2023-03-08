import { readonly, ref, watch } from 'vue'
import {
  createGlobalState,
  createSharedComposable,
  useEventListener, useLocalStorage,
  watchIgnorable,
} from '@vueuse/core'
import { calcBuffer } from '@/player/utils/audio'
import { useTracksService } from '@/shared/services/tracks'
import { serializer } from '@/shared/utils/serializer'
import type { Track } from '@/shared/dto/track'

const usePlayerState = createGlobalState(() => ({
  track: useLocalStorage<Track | undefined>('player_track', undefined, { serializer, writeDefaults: true, shallow: true }),

  audio: new Audio(),
  caching: ref(false),

  playing: ref(false),
  progress: useLocalStorage<number>('player_progress', 0, { serializer, writeDefaults: true }),
  buffer: ref(0),
  duration: useLocalStorage<number>('player_duration', 0, { serializer, writeDefaults: true }),
  volume: useLocalStorage<number>('player_volume', 1, { serializer, writeDefaults: true }),
  muted: useLocalStorage<boolean>('player_muted', false, { serializer, writeDefaults: true }),
  ended: ref(false),
}))

export const usePlayer = createSharedComposable(() => {
  const {
    track,
    audio,
    playing,
    caching,
    progress,
    buffer,
    duration,
    volume,
    muted,
    ended,
  } = usePlayerState()

  // TODO: Вынести в хук с кэшами
  const tracksService = useTracksService()
  const { mutate: mutateCacheTrack } = tracksService.cacheTrack()
  async function cacheTrack(trackId: string) {
    if (track.value && !track.value.url.audio) {
      caching.value = true

      try {
        const result = await mutateCacheTrack({ trackId })
        const cachedTrack = result?.data?.cacheTrack

        if (cachedTrack && (!track || trackId === track.value?.id))
          caching.value = false
      }
      catch {}
    }
  }
  const { mutate: mutateCancelCacheTrack } = tracksService.cancelCacheTrack()
  function cancelCacheTrack(trackId: string) {
    caching.value = false
    void mutateCancelCacheTrack({ trackId })
  }

  const { ignoreUpdates: ignorePlayingUpdates } = watchIgnorable(
    playing,
    (value) => {
      if (track.value) {
        if (!value) {
          audio.pause()
          if (caching.value && track.value?.id)
            cancelCacheTrack(track.value.id)
        }
        else if (track.value?.url?.audio) {
          audio.play().catch(() => {})
        }
        else {
          void cacheTrack(track.value.id)
        }
      }
    },
    { immediate: true },
  )
  const { ignoreUpdates: ignoreProgressUpdates } = watchIgnorable(progress, value => (audio.currentTime = value), { immediate: true })
  const { ignoreUpdates: ignoreVolumeUpdates } = watchIgnorable(volume, value => (audio.volume = value ** 2), { immediate: true })
  const { ignoreUpdates: ignoreMuteUpdates } = watchIgnorable(muted, value => (audio.muted = value), { immediate: true })

  useEventListener(audio, 'canplay', () => {
    if (playing.value)
      audio.play().catch(() => {})
  })
  useEventListener(audio, 'play', () => ignorePlayingUpdates(() => (playing.value = true)))
  useEventListener(audio, 'pause', () => {
    if (audio.currentTime !== audio.duration)
      ignorePlayingUpdates(() => (playing.value = false))
  })
  useEventListener(audio, 'timeupdate', () => ignoreProgressUpdates(() => (progress.value = audio.currentTime)))
  useEventListener(audio, 'durationchange', () => (duration.value = audio.duration))
  useEventListener(audio, 'progress', () => (buffer.value = calcBuffer(audio.buffered, progress.value)))
  useEventListener(audio, 'volumechange', () => ignoreVolumeUpdates(() => ignoreMuteUpdates(() => {
    volume.value = audio.volume ** 0.5
    muted.value = audio.muted
  })))
  useEventListener(audio, 'ended', () => (ended.value = true))
  useEventListener(audio, 'playing', () => (ended.value = false))

  watch(track, (value, oldValue) => {
    progress.value = 0
    duration.value = 0

    if (caching.value && oldValue)
      cancelCacheTrack(oldValue.id)

    audio.src = value?.url?.audio ?? ''
    audio.load()
    if (value && !value.url.audio && playing.value)
      void cacheTrack(value.id)
  })

  return {
    track,

    audio: readonly(audio),
    caching: readonly(caching),

    playing,
    progress,
    volume,
    muted,
    buffer: readonly(buffer),
    duration: readonly(duration),
    ended: readonly(ended),
  }
})
