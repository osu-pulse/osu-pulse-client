import {
  createSharedComposable,
  useActiveElement,
  useMagicKeys, useTimeoutPoll, whenever,
} from '@vueuse/core'
import { computed } from 'vue'

export const useHotkey = createSharedComposable(() => {
  const activeElement = useActiveElement()
  const activeTag = computed(() => activeElement.value?.tagName)
  const inputActive = computed(() => activeTag.value === 'INPUT' || activeTag.value === 'TEXTAREA')

  whenever(
    () => !inputActive.value && activeTag.value !== 'BODY',
    () => activeElement.value?.blur(),
  )

  const keys = useMagicKeys({
    passive: false,
    onEventFired: event => (
      event.code === 'Space'
      && !inputActive.value
      && event.preventDefault()
    ),
  })

  function handle(hotkey: string | string[], fn: () => any, repeatable = false) {
    const watchable = () => (Array.isArray(hotkey) ? hotkey : [hotkey]).some(hotkey => keys[hotkey].value)
    const callback = () => {
      if (hotkey === 'Escape' || !inputActive.value)
        fn()
    }

    if (repeatable) {
      const { resume, pause } = useTimeoutPoll(callback, 100, { immediate: false })
      whenever(() => watchable(), resume)
      whenever(() => !watchable(), pause)
    }
    else {
      whenever(watchable, callback)
    }
  }

  return {
    handle,
  }
})
