import {
  createGlobalState,
  createSharedComposable, tryOnMounted,
  useCssVar,
  useEventListener,
} from '@vueuse/core'
import { computed, watch } from 'vue'
import Color from 'color'
import ColorThief from 'color-thief-ts'
import { usePlayer } from '@/player/stores/player'

const useColorsState = createGlobalState(() => ({
  image: new Image(100, 100),

  primary: useCssVar('--color-primary'),
  secondary: useCssVar('--color-secondary'),
  background: useCssVar('--color-background'),
  text: useCssVar('--color-text'),
  textInactive: useCssVar('--color-text-inactive'),
  accent: useCssVar('--color-accent'),
}))

export const useColors = createSharedComposable(() => {
  const {
    image,
    primary,
    secondary,
    background,
    text,
    textInactive,
    accent,
  } = useColorsState()

  tryOnMounted(() => image.crossOrigin = 'Anonymous')

  const { track } = usePlayer()
  watch(track, (track) => {
    accent.value = primary.value
    image.src = track?.cover?.list ?? ''
  }, { immediate: true })
  const backgroundColor = computed(() => Color(`rgb(${background.value})`))
  const primaryColor = computed(() => Color(`rgb(${primary.value})`))
  const CONTRAST_LIMIT = 0.3
  const colorThief = new ColorThief()
  useEventListener(image, 'load', (event: Event) => {
    const target = event.target as HTMLImageElement

    if (target.src === image.src) {
      const raw = Color(colorThief.getColor(image, { colorType: 'hex' }))
      const backgroundDelta = raw.contrast(backgroundColor.value) / 21
      const primaryDelta = raw.contrast(primaryColor.value) / 21

      let normalized

      if (backgroundDelta < CONTRAST_LIMIT)
        normalized = raw.negate().mix(backgroundColor.value, CONTRAST_LIMIT - backgroundDelta).negate()
      else if (primaryDelta < CONTRAST_LIMIT)
        normalized = raw.negate().mix(primaryColor.value, CONTRAST_LIMIT - primaryDelta).negate()
      else
        normalized = raw

      accent.value = normalized.rgb().array().join(', ')
    }
  })

  return {
    primary,
    secondary,
    background,
    text,
    textInactive,
  }
})
