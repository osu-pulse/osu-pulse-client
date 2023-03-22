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
  const CONTRAST_LIMIT = 0.2
  function normalizeContrast(color: Color): Color {
    const backgroundContrast = (color.contrast(backgroundColor.value) - 1) / 20
    const primaryContrast = (color.contrast(primaryColor.value) - 1) / 20

    if (backgroundContrast < CONTRAST_LIMIT)
      return color.negate().mix(backgroundColor.value, CONTRAST_LIMIT - backgroundContrast).negate()
    else if (primaryContrast < CONTRAST_LIMIT)
      return color.negate().mix(primaryColor.value, CONTRAST_LIMIT - primaryContrast).negate()
    else
      return color
  }

  const SATURATION_LIMIT = 0.3
  function normalizeSaturation(color: Color): Color {
    const saturation = color.saturationl() / 100

    if (saturation < SATURATION_LIMIT)
      return color.saturate(SATURATION_LIMIT - saturation)
    else if (1 - saturation < SATURATION_LIMIT)
      return color.desaturate(SATURATION_LIMIT - (1 - saturation))
    else
      return color
  }

  const colorThief = new ColorThief()
  useEventListener(image, 'load', (event: Event) => {
    const target = event.target as HTMLImageElement

    if (target.src === image.src) {
      const color = Color(colorThief.getColor(image, { colorType: 'hex' }))
      const normalized = normalizeContrast(normalizeSaturation(color))
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
