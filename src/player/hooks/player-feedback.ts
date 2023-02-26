import { createSharedComposable, useVibrate } from '@vueuse/core'

export const usePlayerFeedback = createSharedComposable(() => {
  const { vibrate, stop } = useVibrate()
  function createVibration(pattern: number | number[]) {
    return () => {
      stop()
      vibrate(pattern)
    }
  }

  return {
    play: createVibration(100),
    pause: createVibration([70, 20, 20]),
    mute: createVibration([20, 0, 20]),
    unmute: createVibration([70, 0, 70]),
    swipeStart: createVibration(70),
    swipeEnd: createVibration([20]),
    changeTrack: createVibration([60, 50, 10]),
    changeVolume: createVibration(13),
    boundVolume: createVibration(100),
    changeProgress: createVibration(13),
    boundProgress: createVibration(80),
  }
})
