import { createSharedComposable, tryOnMounted } from '@vueuse/core'
import { watch } from 'vue'
import { usePlayer } from '@/player/stores/player'
import { useCurrentTrack } from '@/player/stores/current-track'

export const usePlayerMedia = createSharedComposable(() => {
  const { track, audio, playing, progress, duration } = usePlayer()

  const { mediaSession } = navigator

  watch(track, () => {
    if (track.value) {
      mediaSession.metadata = new MediaMetadata({
        title: track.value.title,
        artist: track.value.artist,
        artwork: [96, 128, 192, 256, 384, 512].map(size => ({
          src: track.value!.cover.normal,
          sizes: `${size}x${size}`,
          type: 'image/jpeg',
        })),
      })
    }
    else {
      mediaSession.metadata = null
    }
  })

  watch([track, playing], ([track, playing]) => {
    mediaSession.playbackState = !track ? 'none' : playing ? 'playing' : 'paused'
  })
  watch([progress, duration], ([progress, duration]) => {
    if (duration > 0) {
      mediaSession.setPositionState({
        position: progress,
        playbackRate: audio.value.playbackRate,
        duration,
      })
    }
    else {
      mediaSession.setPositionState(undefined)
    }
  })

  const { prev, next } = useCurrentTrack()
  tryOnMounted(() => {
    mediaSession.setActionHandler('play', () => playing.value = true)
    mediaSession.setActionHandler('pause', () => playing.value = false)
    mediaSession.setActionHandler('previoustrack', prev)
    mediaSession.setActionHandler('nexttrack', next)
    mediaSession.setActionHandler('seekto', ({ seekTime }) => progress.value = seekTime)
    mediaSession.setActionHandler('stop', () => track.value = undefined)
  })
})
