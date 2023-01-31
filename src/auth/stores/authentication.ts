import { useAuthenticationService } from '~/auth/services/authentication';
import type { TokenSetDto } from '~/auth/dto/token-set-dto';

const useAuthenticationState = createGlobalState(() => ({
  accessToken: ref<string>(),
  refreshToken: useLocalStorage<string>('refresh-token', null, { serializer }),
}));

export const useAuthentication = createSharedComposable(() => {
  const { accessToken, refreshToken } = useAuthenticationState();

  function redirect() {
    // TODO: Перенаправить
  }

  function schedule() {
    const timeout = 123; // TODO: Вставлять время из access token
    setTimeout(rotate, timeout);
  }

  const authenticationService = useAuthenticationService();
  async function rotate() {
    const { access_token, refresh_token } = await authenticationService.rotate(
      'sioeffshef',
    );
    // TODO: Что-то с ними сделать
  }

  const route = useRoute();
  const router = useRouter();
  async function claimUrl() {
    const { access_token, refresh_token } = route.query;
    // TODO: Что-то с ними сделать

    await router.replace({
      query: omit(route.query, ['access_token', 'refresh_token']),
    });
  }

  async function auth(): Promise<void> {
    // TODO: Алгоритм
  }

  return {
    accessToken: readonly(accessToken),
    refreshToken: readonly(refreshToken),

    auth,
  };
});
