import type { TokenSetDto } from '~/auth/dto/token-set-dto';

export const useAuthenticationService = createGlobalState(() => ({
  async rotate(refreshToken: string): Promise<TokenSetDto> {
    return { access_token: '', refresh_token: '' };
  },
}));
