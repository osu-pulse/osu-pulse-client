import type { AxiosResponse } from 'axios';
import type { TokenSetDto } from '~/auth/dto/token-set-dto';
import type { RotateTokenDto } from '~/auth/dto/rotate-token';
import { AuthenticationError } from '~/auth/exceptions/authentication-exception';

export const useAuthenticationService = createGlobalState(() => ({
  async rotate(refreshToken: string): Promise<TokenSetDto> {
    try {
      const { data } = await axiosAuth.post<
        TokenSetDto,
        AxiosResponse<TokenSetDto>,
        RotateTokenDto
      >('token', { refresh_token: refreshToken });
      return data;
    } catch {
      throw new AuthenticationError();
    }
  },
}));