export interface TrackCover {
  small: string;
  normal: string;
  wide: string;
}

export const TRACK_COVER = gql`
  fragment TrackCover on TrackCoverObject {
    small
    normal
    wide
  }
`;
