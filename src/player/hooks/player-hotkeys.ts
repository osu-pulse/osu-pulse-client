import {
  createSharedComposable,
} from '@vueuse/core'
import { usePlayer } from '@/player/stores/player'
import { useCurrentTrack } from '@/player/stores/current-track'
import { useHotkey } from '@/shared/hooks/use-hotkey'

export const usePlayerHotkeys = createSharedComposable(() => {
  const { playing, muted, volume, progress, duration } = usePlayer()
  const { toggleShuffling, toggleRepeating, next, prev } = useCurrentTrack()

  const { handle } = useHotkey()

  handle('KeyM', () => muted.value = !muted.value)
  handle('KeyS', toggleShuffling)
  handle('KeyR', toggleRepeating)
  handle('KeyM', () => muted.value = !muted.value)
  handle('KeyM', () => muted.value = !muted.value)
  handle(['Space', 'KeyK'], () => playing.value = !playing.value)
  handle('ArrowDown', () => volume.value = Math.max(0, volume.value - 0.05), true)
  handle('ArrowUp', () => volume.value = Math.min(1, volume.value + 0.05), true)
  handle('ArrowLeft', () => progress.value = Math.max(0, progress.value - 5), true)
  handle('ArrowRight', () => progress.value = Math.min(duration.value, progress.value + 5), true)
  handle('Shift + ArrowLeft', prev)
  handle('Shift + ArrowRight', next)
})
