import type { User } from '~/shared/dto/user';
import { USER } from '~/shared/dto/user';

export const useUsersService = createGlobalState(() => ({
  me: () =>
    useQuery<{ me: User }, Record<string, never>>(
      gql`
        query me {
          me {
            ...User
          }
        }
        ${USER}
      `,
    ),
}));
