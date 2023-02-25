import { readonly, ref, shallowRef, watch } from 'vue'
import {
  createGlobalState,
  createSharedComposable,
  useEventListener, useLocalStorage,
  watchIgnorable,
} from '@vueuse/core'
import { calcBuffer } from '@/player/utils/audio'
import { useTracksService } from '@/shared/services/tracks'
import { useCurrentTrack } from '@/player/stores/current-track'
import { serializer } from '@/shared/utils/serializer'

const usePlayerState = createGlobalState(() => ({
  audio: shallowRef(new Audio()),
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

  const { currentTrack } = useCurrentTrack()

  // TODO: Вынести в хук с кэшами
  const tracksService = useTracksService()
  const { mutate: mutateCacheTrack } = tracksService.cacheTrack()
  async function cacheTrack(trackId: string) {
    if (currentTrack.value && !currentTrack.value.url.audio) {
      caching.value = true

      try {
        const result = await mutateCacheTrack({ trackId })
        const cachedTrack = result?.data?.cacheTrack

        if (cachedTrack && (!currentTrack || trackId === currentTrack.value?.id))
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
      if (currentTrack.value) {
        if (!value) {
          audio.value.pause()
          if (caching.value && currentTrack.value?.id)
            cancelCacheTrack(currentTrack.value.id)
        }
        else {
          if (currentTrack.value?.url?.audio)
            audio.value.play().catch(() => {})
          else void cacheTrack(currentTrack.value.id)
        }
      }
    },
    { immediate: true },
  )
  const { ignoreUpdates: ignoreProgressUpdates } = watchIgnorable(progress, value => (audio.value.currentTime = value), { immediate: true })
  const { ignoreUpdates: ignoreVolumeUpdates } = watchIgnorable(volume, value => (audio.value.volume = value), { immediate: true })
  const { ignoreUpdates: ignoreMuteUpdates } = watchIgnorable(muted, value => (audio.value.muted = value), { immediate: true })

  useEventListener(audio, 'canplay', () => {
    if (playing.value)
      audio.value.play().catch(() => {})
  })
  useEventListener(audio, 'play', () => ignorePlayingUpdates(() => (playing.value = true)))
  useEventListener(audio, 'pause', () => {
    if (audio.value.currentTime !== audio.value.duration)
      ignorePlayingUpdates(() => (playing.value = false))
  })
  useEventListener(audio, 'timeupdate', () => ignoreProgressUpdates(() => (progress.value = audio.value.currentTime)))
  useEventListener(audio, 'durationchange', () => (duration.value = audio.value.duration))
  useEventListener(audio, 'progress', () => (buffer.value = calcBuffer(audio.value.buffered, progress.value)))
  useEventListener(audio, 'volumechange', () => ignoreVolumeUpdates(() => ignoreMuteUpdates(() => {
    volume.value = audio.value.volume
    muted.value = audio.value.muted
  })))
  useEventListener(audio, 'ended', () => (ended.value = true))
  useEventListener(audio, 'playing', () => (ended.value = false))

  watch(currentTrack, (value, oldValue) => {
    ignoreProgressUpdates(() => (progress.value = 0))

    if (caching.value && oldValue)
      cancelCacheTrack(oldValue.id)

    audio.value.src = value?.url?.audio ?? ''
    audio.value.load()
    if (value && !value.url.audio && playing.value)
      void cacheTrack(value.id)
  })

  return {
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
