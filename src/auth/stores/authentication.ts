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
    'authentication_refresh-token',
    undefined,
    { serializer },
  ),
}))

export const useAuthentication = createSharedComposable(() => {
  const { accessToken, refreshToken } = useAuthenticationState()

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
    const query = new URLSearchParams({
      redirect_url: location.origin,
    }).toString()
    window.location.href = `${import.meta.env.VITE_AUTH_URL}/authorize?${query}`
  }

  function schedule() {
    if (accessToken.value) {
      const { exp } = jwtDecode<JwtPayload>(accessToken.value)
      const time = (exp - new Date().getTime() / 1000 - 10) * 1000

      setTimeout(() => {
        void rotate()
      }, time)
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

  async function isUrlClaimable() {
    await router.isReady()
    return route.query.access_token && route.query.refresh_token
  }

  const authenticated = computed(() => refreshToken.value || isUrlClaimable())

  async function claimUrl() {
    await router.isReady()

    accessToken.value = route.query.access_token as string
    refreshToken.value = route.query.refresh_token as string

    await router.replace({
      query: omit(route.query, ['access_token', 'refresh_token', 'state']),
    })

    schedule()
  }

  async function login(): Promise<void> {
    if (await isUrlClaimable())
      await claimUrl()
    else if (refreshToken.value)
      await rotate()
    else redirect()
  }
  const { offline } = useOffline()
  whenever(() => !offline.value, login)

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
