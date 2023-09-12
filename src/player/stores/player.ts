import { readonly, ref, shallowReadonly, shallowRef, watch } from 'vue'
import {
  createGlobalState,
  createSharedComposable, syncRefs,
  tryOnMounted,
  useEventListener,
  useLocalStorage,
  watchIgnorable,
} from '@vueuse/core'
import { calcBuffer } from '@/player/utils/audio'
import { serializer } from '@/shared/utils/serializer'
import type { Track } from '@/shared/dto/track'

const usePlayerState = createGlobalState(() => ({
  audio: shallowRef(new Audio()),

  track: useLocalStorage<Track | undefined>('player_track', undefined, { serializer, writeDefaults: true, shallow: true }),

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
    track,
    playing,
    progress,
    buffer,
    duration,
    volume,
    muted,
    ended,
  } = usePlayerState()

  tryOnMounted(() => audio.value.crossOrigin = 'anonymous')

  const { ignoreUpdates: ignorePlayingUpdates } = watchIgnorable(
    playing,
    value => value ? audio.value.play() : audio.value.pause(),
    { immediate: true },
  )
  const { ignoreUpdates: ignoreProgressUpdates } = watchIgnorable(progress, value => (audio.value.currentTime = value), { immediate: true })
  const { ignoreUpdates: ignoreVolumeUpdates } = watchIgnorable(volume, value => (audio.value.volume = value ** 2), { immediate: true })
  const { ignoreUpdates: ignoreMuteUpdates } = watchIgnorable(muted, value => (audio.value.muted = value), { immediate: true })

  useEventListener(audio, 'canplay', () => {
    if (playing.value)
      audio.value.play().catch(() => {})
  })
  useEventListener(audio, 'play', () => ignorePlayingUpdates(() => (playing.value = true)))
  useEventListener(audio, 'pause', () => ignorePlayingUpdates(() => {
    if (progress.value !== duration.value)
      playing.value = false
  }))
  useEventListener(audio, 'timeupdate', () => ignoreProgressUpdates(() => (progress.value = audio.value.currentTime)))
  useEventListener(audio, 'durationchange', () => (duration.value = audio.value.duration))
  useEventListener(audio, 'progress', () => (buffer.value = calcBuffer(audio.value.buffered, progress.value)))
  useEventListener(audio, 'volumechange', () => ignoreVolumeUpdates(() => ignoreMuteUpdates(() => {
    volume.value = audio.value.volume ** 0.5
    muted.value = audio.value.muted
  })))

  syncRefs(() => playing.value && duration.value && progress.value === duration.value, ended)

  watch(track, () => {
    progress.value = 0
    duration.value = 0
    buffer.value = 0

    if (track.value)
      audio.value.src = track.value.url.audio
  }, { immediate: true })

  return {
    audio: shallowReadonly(audio),

    track,

    playing,
    progress,
    volume,
    muted,
    buffer: readonly(buffer),
    duration: readonly(duration),
    ended: readonly(ended),
  }
})
