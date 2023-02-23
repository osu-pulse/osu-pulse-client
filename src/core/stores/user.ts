import {
  createGlobalState,
  createSharedComposable,
  useLocalStorage,
  whenever,
} from '@vueuse/core'
import { readonly, watch } from 'vue'
import type { User } from '@/shared/dto/user'
import { useUsersService } from '@/shared/services/users'
import { useAuthentication } from '@/auth/stores/authentication'
import { serializer } from '@/shared/utils/serializer'

const useUserState = createGlobalState(() => ({
  user: useLocalStorage<User | undefined>('user', undefined, {
    serializer,
    shallow: true,
    writeDefaults: true,
  }),
}))

export const useUser = createSharedComposable(() => {
  const { user } = useUserState()

  const usersService = useUsersService()
  const { result } = usersService.me()
  whenever(result, (result) => (user.value = result.me), { immediate: true })

  const { onLogout } = useAuthentication()
  watch(onLogout, () => (user.value = undefined))

  return {
    user: readonly(user),
  }
})
