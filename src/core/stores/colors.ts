import {
  createGlobalState,
  createSharedComposable,
  useCssVar, useEventListener,
} from '@vueuse/core'
import { computed, shallowRef, watch } from 'vue'
import Color from 'color'
import ColorThief from 'color-thief-ts'

const useColorsState = createGlobalState(() => ({
  primary: useCssVar('--color-primary'),
  secondary: useCssVar('--color-secondary'),
  background: useCssVar('--color-background'),
  text: useCssVar('--color-text'),
  textInactive: useCssVar('--color-text-inactive'),
  accent: useCssVar('--color-accent'),
  accentImage: shallowRef<HTMLImageElement>(),
}))

export const useColors = createSharedComposable(() => {
  const { primary, secondary, background, text, textInactive, accent, accentImage } = useColorsState()

  watch(accentImage, () => accent.value = primary.value)
  const contrast = computed(() => Color(`rgb(${background.value})`))

  const CONTRAST_LIMIT = 0.3
  const colorThief = new ColorThief()
  useEventListener(accentImage, 'load', (event: Event) => {
    const target = event.target as HTMLImageElement

    if (target.src === accentImage.value?.src) {
      const raw = Color(colorThief.getColor(accentImage.value, { colorType: 'hex' }))
      const delta = raw.contrast(contrast.value) / 21

      let normalized: Color
      if (delta > CONTRAST_LIMIT) {
        normalized = raw
      }
      else {
        const weight = CONTRAST_LIMIT - delta
        normalized = raw.negate().mix(contrast.value, weight).negate()
      }
      accent.value = normalized.rgb().array().join(', ')
    }
  })

  return {
    primary,
    secondary,
    background,
    text,
    textInactive,
    accentImage,
  }
})
