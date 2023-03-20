import {
  createSharedComposable,
  useActiveElement,
  useMagicKeys, useTimeoutPoll, whenever,
} from '@vueuse/core'
import { computed } from 'vue'

export const useHotkey = createSharedComposable(() => {
  const keys = useMagicKeys()

  const activeElement = useActiveElement()
  const activeTag = computed(() => activeElement.value?.tagName)
  const hotkeyDisabled = computed(() => activeTag.value === 'INPUT' || activeTag.value === 'TEXTAREA')

  function handle(hotkey: string | string[], fn: () => any, repeatable = false) {
    const watchable = () => (Array.isArray(hotkey) ? hotkey : [hotkey]).some(hotkey => keys[hotkey].value)
    const callback = () => {
      if (hotkey === 'Escape' || !hotkeyDisabled.value)
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
