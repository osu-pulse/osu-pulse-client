export interface TrackCover {
  small: string;
  normal: string;
}

export const TRACK_COVER = gql`
  fragment TrackCover on TrackCoverObject {
    small
    normal
  }
`;
