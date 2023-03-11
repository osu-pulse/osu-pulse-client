import {
  createSharedComposable, useActiveElement,
  useMagicKeys,
  useTimeoutPoll,
  whenever,
} from '@vueuse/core'
import { computed } from 'vue'
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

  const activeElement = useActiveElement()
  const hotkeyDisabled = computed(() => activeElement.value?.tagName === 'INPUT' || activeElement.value?.tagName === 'TEXTAREA')

  function handle(fn: () => any) {
    return () => {
      if (!hotkeyDisabled.value)
        fn()
    }
  }

  whenever(keys.KeyM, handle(() => muted.value = !muted.value))
  whenever(keys.KeyS, handle(() => shuffling.value = !shuffling.value))
  whenever(keys.KeyR, handle(() => {
    if (!repeating.value)
      repeating.value = RepeatMode.LIST
    else if (repeating.value === RepeatMode.LIST)
      repeating.value = RepeatMode.SINGLE
    else if (repeating.value === RepeatMode.SINGLE)
      repeating.value = false
  }))
  whenever(keys.Space, handle(() => playing.value = !playing.value))

  const volumePeriod = 100
  const volumeDelta = 0.05
  const { resume: startDecreaseVolume, pause: stopDecreaseVolume } = useTimeoutPoll(
    () => { volume.value = Math.max(0, volume.value - volumeDelta) }, volumePeriod, { immediate: false },
  )
  const { resume: startIncreaseVolume, pause: stopIncreaseVolume } = useTimeoutPoll(
    () => { volume.value = Math.min(1, volume.value + volumeDelta) }, volumePeriod, { immediate: false },
  )
  whenever(keys.ArrowDown, handle(startDecreaseVolume))
  whenever(() => !keys.ArrowDown.value, handle(stopDecreaseVolume))
  whenever(keys.ArrowUp, handle(startIncreaseVolume))
  whenever(() => !keys.ArrowUp.value, handle(stopIncreaseVolume))

  const progressPeriod = 100
  const progressDelta = 5
  const { resume: startDecreaseProgress, pause: stopDecreaseProgress } = useTimeoutPoll(
    () => { progress.value = Math.max(0, progress.value - progressDelta) }, progressPeriod, { immediate: false },
  )
  const { resume: startIncreaseProgress, pause: stopIncreaseProgress } = useTimeoutPoll(
    () => { progress.value = Math.min(duration.value, progress.value + progressDelta) }, progressPeriod, { immediate: false },
  )
  whenever(keys.ArrowLeft, handle(startDecreaseProgress))
  whenever(() => !keys.ArrowLeft.value, handle(stopDecreaseProgress))
  whenever(keys.ArrowRight, handle(startIncreaseProgress))
  whenever(() => !keys.ArrowRight.value, handle(stopIncreaseProgress))

  whenever(keys['Shift + ArrowLeft'], handle(prev))
  whenever(keys['Shift + ArrowRight'], handle(next))
})
