import gql from 'graphql-tag'

export interface TrackCover {
  list: string
  list2x: string
  wide: string
  wide2x: string
}

export const TRACK_COVER = gql`
  fragment TrackCover on TrackCoverObject {
    list
    list2x
    wide
    wide2x
  }
`
