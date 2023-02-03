import type { User } from '~/shared/dto/user';
import { useUsersService } from '~/shared/services/users';

const useUserState = createGlobalState(() => ({
  user: shallowRef<User>(),
}));

export const useUser = createSharedComposable(() => {
  const { user } = useUserState();

  const usersService = useUsersService();
  const { result } = usersService.me();
  whenever(result, (result) => (user.value = result.me));

  return {
    user: readonly(user),
  };
});
