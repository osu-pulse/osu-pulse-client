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
  watch(track, track => image.src = track?.cover?.small ?? '')
  const contrast = computed(() => Color(`rgb(${background.value})`))
  const CONTRAST_LIMIT = 0.3
  const colorThief = new ColorThief()
  useEventListener(image, 'load', (event: Event) => {
    const target = event.target as HTMLImageElement

    if (target.src === image.src) {
      const raw = Color(colorThief.getColor(image, { colorType: 'hex' }))
      const delta = raw.contrast(contrast.value) / 21

      const normalized = delta < CONTRAST_LIMIT
        ? raw.negate().mix(contrast.value, CONTRAST_LIMIT - delta).negate()
        : raw

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
