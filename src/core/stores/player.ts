import { readonly, ref, shallowRef, watch } from 'vue'
import {
  createGlobalState,
  createSharedComposable,
  useEventListener,
  watchIgnorable,
} from '@vueuse/core'
import type { Track } from '@/shared/dto/track'
import { calcBuffer } from '@/core/utils/audio'
import { useTracksService } from '@/shared/services/tracks'

const usePlayerState = createGlobalState(() => ({
  track: shallowRef<Track>(),

  audio: shallowRef(new Audio()),
  caching: ref(false),

  playing: ref(false),
  progress: ref(0),
  buffer: ref(0),
  duration: ref(0),
  volume: ref(1),
  muted: ref(false),
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
  async function cacheTrack() {
    if (track.value && !track.value.url.audio) {
      caching.value = true
      const result = await mutateCacheTrack({
        trackId: track.value.id,
      })

      const cachedTrack = result?.data?.cacheTrack
      if (cachedTrack && cachedTrack.id === track.value?.id) {
        track.value = result?.data?.cacheTrack
        caching.value = false
      }
    }
  }

  const { ignoreUpdates: ignorePlayingUpdates } = watchIgnorable(
    playing,
    (value) => {
      if (!value)
        audio.value.pause()
      else if (track.value?.url?.audio)
        audio.value.play().catch(() => {})
      else
        void cacheTrack()
    },
    { immediate: true },
  )
  const { ignoreUpdates: ignoreProgressUpdates } = watchIgnorable(
    progress,
    value => audio.value.currentTime = value,
    { immediate: true },
  )
  const { ignoreUpdates: ignoreVolumeUpdates } = watchIgnorable(
    volume,
    value => audio.value.volume = value,
    { immediate: true },
  )
  const { ignoreUpdates: ignoreMuteUpdates } = watchIgnorable(
    muted,
    value => audio.value.muted = value,
    { immediate: true },
  )

  useEventListener(audio, 'canplay', () => {
    if (playing.value)
      audio.value.play().catch(() => {})
  })
  useEventListener(audio, 'play', () =>
    ignorePlayingUpdates(() => playing.value = true),
  )
  useEventListener(audio, 'pause', () => {
    if (audio.value.currentTime !== audio.value.duration)
      ignorePlayingUpdates(() => playing.value = false)
  })
  useEventListener(audio, 'timeupdate', () =>
    ignoreProgressUpdates(() => progress.value = audio.value.currentTime),
  )
  useEventListener(
    audio,
    'progress',
    () => buffer.value = calcBuffer(audio.value.buffered, progress.value),
  )
  useEventListener(
    audio,
    'durationchange',
    () => duration.value = isNaN(audio.value.duration) ? 0 : audio.value.duration,
  )
  useEventListener(audio, 'volumechange', () =>
    ignoreVolumeUpdates(() =>
      ignoreMuteUpdates(() => {
        volume.value = audio.value.volume
        muted.value = audio.value.muted
      }),
    ),
  )
  useEventListener(audio, 'ended', () => ended.value = true)
  useEventListener(audio, 'playing', () => ended.value = false)

  const { mutate: mutateCancelCacheTrack } = tracksService.cancelCacheTrack()
  watch(track, (value, oldValue) => {
    const oldId = oldValue?.id
    const id = value?.id
    if (oldId !== id) {
      ignoreProgressUpdates(() => (progress.value = 0))
      duration.value = 0

      if (caching.value) {
        caching.value = false

        if (oldId)
          void mutateCancelCacheTrack({ trackId: oldId })
      }
    }

    const src = value?.url?.audio
    if (src) {
      audio.value.src = src
    }
    else if (playing.value) {
      audio.value.src = ''
      void cacheTrack()
    }
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
