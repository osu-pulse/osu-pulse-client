import jwtDecode from 'jwt-decode'
import { computed, readonly, ref } from 'vue'
import {
  createGlobalState,
  createSharedComposable,
  useLocalStorage,
  whenever,
} from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { useAuthenticationService } from '@/auth/services/authentication'
import type { JwtPayload } from '@/auth/types/jwt-payload'
import { useOffline } from '@/core/stores/offline'
import { serializer } from '@/shared/utils/serializer'
import { omit } from '@/shared/utils/object'

const useAuthenticationState = createGlobalState(() => ({
  accessToken: ref<string>(),
  refreshToken: useLocalStorage<string | undefined>(
    'refresh-token',
    undefined,
    { serializer },
  ),
}))

export const useAuthentication = createSharedComposable(() => {
  const { accessToken, refreshToken } = useAuthenticationState()

  const authenticated = computed(() => refreshToken.value)

  function getToken(): Promise<string> {
    return new Promise((resolve) => {
      if (accessToken.value) {
        resolve(accessToken.value)
      }
      else {
        const stop = whenever(accessToken, (value) => {
          stop()
          resolve(value)
        })
      }
    })
  }

  function redirect() {
    window.location.href = `${import.meta.env.VITE_AUTH_URL}/authorize`
  }

  function schedule() {
    if (accessToken.value) {
      const { exp } = jwtDecode<JwtPayload>(accessToken.value)
      const time = (exp - new Date().getTime() / 1000 - 10) * 1000

      setTimeout(rotate, time)
    }
  }

  const authenticationService = useAuthenticationService()
  async function rotate() {
    if (refreshToken.value) {
      const { access_token, refresh_token }
        = await authenticationService.rotate(refreshToken.value)

      accessToken.value = access_token
      refreshToken.value = refresh_token

      schedule()
    }
  }

  const route = useRoute()
  const router = useRouter()

  function isUrlClaimable() {
    const params = new URLSearchParams(window.location.search)
    return params.has('access_token') && params.has('refresh_token')
  }
  async function claimUrl() {
    const params = new URLSearchParams(window.location.search)

    accessToken.value = params.get('access_token') as string
    refreshToken.value = params.get('refresh_token') as string

    await router.replace({
      query: omit(route.query, ['access_token', 'refresh_token']),
    })

    schedule()
  }

  async function login(): Promise<void> {
    if (authenticated.value)
      await rotate()
    else if (isUrlClaimable())
      await claimUrl()
    else
      redirect()
  }
  const { offline } = useOffline()
  whenever(() => !offline.value, login, { immediate: true })

  const onLogout = ref<void>()
  function logout(): void {
    refreshToken.value = undefined
    accessToken.value = undefined
    onLogout.value = undefined
    redirect()
  }

  return {
    authenticated,

    onLogout: readonly(onLogout),

    getToken,
    login,
    logout,
  }
})
