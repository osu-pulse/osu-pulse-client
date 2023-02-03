import type { UserUrl } from '~/shared/dto/user-url';
import { USER_URL } from '~/shared/dto/user-url';

export interface User {
  id: string;
  username: string;
  url: UserUrl;
}

export const USER = gql`
  fragment User on UserObject {
    id
    username
    url {
      ...UserUrl
    }
  }
  ${USER_URL}
`;
