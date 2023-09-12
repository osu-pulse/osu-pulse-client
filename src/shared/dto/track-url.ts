import gql from 'graphql-tag'

export interface TrackUrl {
  audio: string
  map: string
  page: string
}

export const TRACK_URL = gql`
  fragment TrackUrl on TrackUrlObject {
    audio
    map
    page
  }
`
