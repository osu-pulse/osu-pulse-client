import gql from 'graphql-tag'

export interface TrackUrl {
  audio?: string
  file: string
  map: string
  page: string
}

export const TRACK_URL = gql`
  fragment TrackUrl on TrackUrlObject {
    audio
    file
    map
    page
  }
`
