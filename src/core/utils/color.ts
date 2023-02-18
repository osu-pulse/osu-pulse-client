import Color from 'color'
import ColorThief from 'color-thief-ts'

const CONTRAST_LIMIT = 0.3
const colorThief = new ColorThief()

export function getAccent(image: HTMLImageElement, background: string): string {
  const contrast = Color(background)

  const accent = Color(colorThief.getColor(image, { colorType: 'hex' }))

  const delta = accent.contrast(contrast) / 21

  if (delta > CONTRAST_LIMIT) {
    return accent.hex()
  }
  else {
    const weight = CONTRAST_LIMIT - delta
    return accent.negate().mix(contrast, weight).negate().hex()
  }
}
