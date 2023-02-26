import {
  createSharedComposable,
  useEventListener,
  whenever,
} from '@vueuse/core'
import { useYandexMetrika } from 'yandex-metrika-vue3'
import { useUser } from '@/core/stores/user'

export const useMetrika = createSharedComposable(() => {
  const { user } = useUser()

  useEventListener(document.querySelector(
    'script[src="https://mc.yandex.ru/metrika/tag.js"]'),
  'load',
  () => {
    const metrika = useYandexMetrika()
    whenever(user, user => metrika.setUserID(user.id), { immediate: true })
  })
})
