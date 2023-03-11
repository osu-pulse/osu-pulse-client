import {
  createGlobalState,
  createSharedComposable, syncRefs,
  useArrayMap, useLocalStorage,
  useRefHistory, whenever,
} from '@vueuse/core'
import type { ComputedRef } from 'vue'
import { computed, watch } from 'vue'

import { useQueue } from '@/queue/stores/queue'
import { randomArrayElement } from '@/shared/utils/random'
import type { Track } from '@/shared/dto/track'
import { RepeatMode } from '@/player/constants/repeat-mode'
import { switchAssign } from '@/shared/utils/switch'
import { serializer } from '@/shared/utils/serializer'
import { usePlayer } from '@/player/stores/player'

const useCurrentTrackState = createGlobalState(() => ({
  trackId: useLocalStorage<string | undefined>('current-track_track-id', undefined, { serializer, writeDefaults: true }),
  repeating: useLocalStorage<false | RepeatMode>('current-track_repeating', false, { serializer, writeDefaults: true }),
  shuffling: useLocalStorage<boolean>('current-track_shuffling', false, { serializer, writeDefaults: true }),
}))

export const useCurrentTrack = createSharedComposable(() => {
  const { trackId, repeating, shuffling } = useCurrentTrackState()

  const { queue } = useQueue()
  const queueIds = useArrayMap(queue as ComputedRef<Track[]>, ({ id }) => id)
  const currentTrack = computed(() => queue.value.find(({ id }) => id === trackId.value))

  const { undo, canUndo, clear } = useRefHistory(trackId)
  watch(shuffling, clear)

  const hasPrev = computed(() => {
    if (!trackId.value)
      return false
    if (repeating.value) {
      return switchAssign(repeating.value, {
        [RepeatMode.LIST]: queueIds.value.length > 1,
        [RepeatMode.SINGLE]: false,
      })
    }
    if (shuffling.value)
      return canUndo.value

    return queueIds.value.some(
      (id, index) => queueIds.value[index + 1] === trackId.value,
    )
  })
  const hasNext = computed(() => {
    if (!trackId.value)
      return false
    if (repeating.value) {
      return switchAssign(repeating.value, {
        [RepeatMode.LIST]: queueIds.value.length > 1,
        [RepeatMode.SINGLE]: false,
      })
    }
    if (shuffling.value)
      return queueIds.value.length > 1

    return queueIds.value.some(
      (id, index) => queueIds.value[index - 1] === trackId.value,
    )
  })

  function next() {
    if (hasNext.value) {
      if (shuffling.value)
        trackId.value = randomArrayElement(queueIds.value)
      else if (repeating.value === RepeatMode.LIST)
        trackId.value = queueIds.value.find((id, index) => queueIds.value[index - 1] === trackId.value) ?? queueIds.value[0]
      else if (!repeating.value)
        trackId.value = queueIds.value.find((id, index) => queueIds.value[index - 1] === trackId.value)
    }
  }

  function prev() {
    if (hasPrev.value) {
      if (shuffling.value)
        undo()
      else if (repeating.value === RepeatMode.LIST)
        trackId.value = queueIds.value.find((id, index) => queueIds.value[index + 1] === trackId.value) ?? queueIds.value.at(-1)
      else if (!repeating.value)
        trackId.value = queueIds.value.find((id, index) => queueIds.value[index + 1] === trackId.value)
    }
  }

  const { track, playing, progress, ended } = usePlayer()
  syncRefs(currentTrack, track, { immediate: false })
  whenever(
    () => ended.value && playing.value,
    () => {
      if (repeating.value === RepeatMode.SINGLE)
        progress.value = 0
      else if (hasNext.value)
        next()
      else playing.value = false
    },
  )

  return {
    trackId,
    repeating,
    shuffling,
    hasPrev,
    hasNext,

    next,
    prev,
  }
})
