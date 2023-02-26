import { createSharedComposable, tryOnMounted } from '@vueuse/core'
import { watch } from 'vue'
import { usePlayer } from '@/player/stores/player'
import { useCurrentTrack } from '@/player/stores/current-track'

export const usePlayerMedia = createSharedComposable(() => {
  const { track, audio, playing, progress, duration } = usePlayer()

  watch(track, () => {
    if (track.value) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.value.title,
        artist: track.value.artist,
        artwork: [
          { src: track.value.cover.normal, type: 'image/jpg' },
        ],
      })
    }
    else {
      navigator.mediaSession.metadata = null
    }
  })

  watch([track, playing], ([track, playing]) => {
    navigator.mediaSession.playbackState = !track ? 'none' : playing ? 'playing' : 'paused'
  })
  watch([progress, duration], ([progress, duration]) => {
    if (duration > 0) {
      navigator.mediaSession.setPositionState({
        position: progress,
        playbackRate: audio.playbackRate,
        duration,
      })
    }
    else {
      navigator.mediaSession.setPositionState(undefined)
    }
  })

  const { prev, next } = useCurrentTrack()
  tryOnMounted(() => {
    navigator.mediaSession.setActionHandler('play', () => playing.value = true)
    navigator.mediaSession.setActionHandler('pause', () => playing.value = false)
    navigator.mediaSession.setActionHandler('previoustrack', prev)
    navigator.mediaSession.setActionHandler('nexttrack', next)
    navigator.mediaSession.setActionHandler('seekto', ({ seekTime }) => progress.value = seekTime)
    navigator.mediaSession.setActionHandler('stop', () => track.value = undefined)
  })
})
