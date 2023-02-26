import {
  createSharedComposable,
  useMagicKeys,
  useTimeoutPoll,
  whenever,
} from '@vueuse/core'
import { usePlayer } from '@/player/stores/player'
import { useCurrentTrack } from '@/player/stores/current-track'
import { RepeatMode } from '@/player/constants/repeat-mode'

export const usePlayerHotkeys = createSharedComposable(() => {
  const { playing, muted, volume, progress, duration } = usePlayer()
  const { shuffling, repeating, next, prev } = useCurrentTrack()

  const keys = useMagicKeys({
    passive: false,
    onEventFired: (event) => {
      if (event.code === 'Space')
        event.preventDefault()
    },
  })

  whenever(keys.KeyM, () => muted.value = !muted.value)
  whenever(keys.KeyS, () => shuffling.value = !shuffling.value)
  whenever(keys.KeyR, () => {
    if (!repeating.value)
      repeating.value = RepeatMode.LIST
    else if (repeating.value === RepeatMode.LIST)
      repeating.value = RepeatMode.SINGLE
    else if (repeating.value === RepeatMode.SINGLE)
      repeating.value = false
  })
  whenever(keys.Space, () => playing.value = !playing.value)

  const volumePeriod = 100
  const volumeDelta = 0.05
  const { resume: startDecreaseVolume, pause: stopDecreaseVolume } = useTimeoutPoll(
    () => { volume.value = Math.max(0, volume.value - volumeDelta) }, volumePeriod, { immediate: false },
  )
  const { resume: startIncreaseVolume, pause: stopIncreaseVolume } = useTimeoutPoll(
    () => { volume.value = Math.min(1, volume.value + volumeDelta) }, volumePeriod, { immediate: false },
  )
  whenever(keys.ArrowDown, startDecreaseVolume)
  whenever(() => !keys.ArrowDown.value, stopDecreaseVolume)
  whenever(keys.ArrowUp, startIncreaseVolume)
  whenever(() => !keys.ArrowUp.value, stopIncreaseVolume)

  const progressPeriod = 100
  const progressDelta = 5
  const { resume: startDecreaseProgress, pause: stopDecreaseProgress } = useTimeoutPoll(
    () => { progress.value = Math.max(0, progress.value - progressDelta) }, progressPeriod, { immediate: false },
  )
  const { resume: startIncreaseProgress, pause: stopIncreaseProgress } = useTimeoutPoll(
    () => { progress.value = Math.min(duration.value, progress.value + progressDelta) }, progressPeriod, { immediate: false },
  )
  whenever(keys.ArrowLeft, startDecreaseProgress)
  whenever(() => !keys.ArrowLeft.value, stopDecreaseProgress)
  whenever(keys.ArrowRight, startIncreaseProgress)
  whenever(() => !keys.ArrowRight.value, stopIncreaseProgress)

  whenever(keys['Shift + ArrowLeft'], prev)
  whenever(keys['Shift + ArrowRight'], next)
})
