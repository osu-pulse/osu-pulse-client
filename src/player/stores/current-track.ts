import {
  createGlobalState,
  createSharedComposable,
  useArrayMap, useLocalStorage,
  useRefHistory,
} from '@vueuse/core'
import type { ComputedRef } from 'vue'
import { computed, watch } from 'vue'
import { useQueue } from '@/core/stores/queue'
import { randomArrayElement } from '@/shared/utils/random'
import type { Track } from '@/shared/dto/track'
import { RepeatMode } from '@/player/constants/repeat-mode'
import { switchAssign } from '@/shared/utils/switch'
import { serializer } from '@/shared/utils/serializer'

const useCurrentTrackState = createGlobalState(() => ({
  currentTrackId: useLocalStorage<string | undefined>('current-track_track-id', undefined, { serializer, writeDefaults: true }),
  repeating: useLocalStorage<false | RepeatMode>('current-track_repeating', false, { serializer, writeDefaults: true }),
  shuffling: useLocalStorage<boolean>('current-track_shuffling', false, { serializer, writeDefaults: true }),
}))

export const useCurrentTrack = createSharedComposable(() => {
  const { currentTrackId, repeating, shuffling } = useCurrentTrackState()

  const { queue } = useQueue()
  const queueIds = useArrayMap(queue as ComputedRef<Track[]>, ({ id }) => id)
  const currentTrack = computed(() => queue.value.find(({ id }) => id === currentTrackId.value))

  const { undo, canUndo, clear } = useRefHistory(currentTrackId)
  watch(shuffling, clear)

  const hasPrev = computed(() => {
    if (!currentTrackId.value)
      return false
    if (repeating.value) {
      return switchAssign(repeating.value, {
        [RepeatMode.LIST]: true,
        [RepeatMode.SINGLE]: false,
      })
    }
    if (shuffling.value)
      return canUndo.value

    return queueIds.value.some(
      (id, index) => queueIds.value[index + 1] === currentTrackId.value,
    )
  })
  const hasNext = computed(() => {
    if (!currentTrackId.value)
      return false
    if (repeating.value) {
      return switchAssign(repeating.value, {
        [RepeatMode.LIST]: true,
        [RepeatMode.SINGLE]: false,
      })
    }
    if (shuffling.value)
      return queueIds.value.length > 1

    return queueIds.value.some(
      (id, index) => queueIds.value[index - 1] === currentTrackId.value,
    )
  })

  function next() {
    if (hasNext.value) {
      if (shuffling.value)
        currentTrackId.value = randomArrayElement(queueIds.value)
      else if (repeating.value === RepeatMode.LIST)
        currentTrackId.value = queueIds.value.find((id, index) => queueIds.value[index - 1] === currentTrackId.value) ?? queueIds.value[0]
      else if (!repeating.value)
        currentTrackId.value = queueIds.value.find((id, index) => queueIds.value[index - 1] === currentTrackId.value)
    }
  }

  function prev() {
    if (hasPrev.value) {
      if (shuffling.value)
        undo()
      else if (repeating.value === RepeatMode.LIST)
        currentTrackId.value = queueIds.value.find((id, index) => queueIds.value[index + 1] === currentTrackId.value) ?? queueIds.value.at(-1)
      else if (!repeating.value)
        currentTrackId.value = queueIds.value.find((id, index) => queueIds.value[index + 1] === currentTrackId.value)
    }
  }

  return {
    currentTrackId,
    currentTrack,
    repeating,
    shuffling,
    hasPrev,
    hasNext,

    next,
    prev,
  }
})
