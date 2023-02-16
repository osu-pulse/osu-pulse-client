import type { Serializer } from '@vueuse/core'

export const serializer: Serializer<any> = {
  read: (raw: string) => (raw !== 'undefined' ? JSON.parse(raw) : undefined),
  write: JSON.stringify,
}
