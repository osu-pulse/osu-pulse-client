import { createSharedComposable, whenever } from '@vueuse/core'
import { useYandexMetrika } from 'yandex-metrika-vue3'
import { useUser } from '@/core/stores/user'

export const useMetrika = createSharedComposable(() => {
  const metrika = useYandexMetrika()
  const { user } = useUser()

  whenever(user, user => metrika.setUserID(user.id))
})
