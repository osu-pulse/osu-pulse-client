import {
  createGlobalState,
  createSharedComposable, tryOnMounted,
} from '@vueuse/core'
import { Metrika } from 'typescript-yandex-metrica'
import { useRouter } from 'vue-router'
import { metrikaId, webmasterId } from '@/core/constants/metrika'

const useMetrikaState = createGlobalState(() => ({
  metrica: new Metrika(metrikaId),
}))

export const useMetrika = createSharedComposable(() => {
  const { metrica } = useMetrikaState()

  const router = useRouter()
  tryOnMounted(() => {
    router.afterEach((to, from) => metrica.hit(to.path, { referer: from.path }))

    const meta = document.createElement('meta')
    meta.name = 'yandex-verification'
    meta.content = webmasterId
    document.head.append(meta)
  })
})
