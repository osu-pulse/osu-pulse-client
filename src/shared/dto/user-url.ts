import gql from 'graphql-tag'

export interface UserUrl {
  profile: string
  avatar: string
  cover: string
}

export const USER_URL = gql`
  fragment UserUrl on UserUrlObject {
    profile
    avatar
    cover
  }
`
