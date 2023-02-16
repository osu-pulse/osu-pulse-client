import {
  createGlobalState,
  createSharedComposable, tryOnMounted,
  useCssVar,
} from '@vueuse/core'

const useColorsState = createGlobalState(() => ({
  primary: useCssVar('--color-primary'),
  secondary: useCssVar('--color-secondary'),
  background: useCssVar('--color-background'),
  text: useCssVar('--color-text', null),
  textInactive: useCssVar('--color-text-inactive'),
}))

export const useColors = createSharedComposable(() => {
  const colors = useColorsState()

  tryOnMounted(() => {
    colors.primary.value = '#000000'
    colors.secondary.value = '#f4f5fe'
    colors.background.value = '#ffffff'
    colors.text.value = '#000000'
    colors.textInactive.value = '#8f91a5'
  })

  return colors
})
