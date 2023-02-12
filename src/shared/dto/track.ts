import type { TrackCover } from '~/shared/dto/track-cover';
import type { TrackUrl } from '~/shared/dto/track-url';

export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: TrackCover;
  url: TrackUrl;
}

export const TRACK = gql`
  fragment Track on TrackObject {
    id
    title
    artist
    cover {
      ...TrackCover
    }
    url {
      ...TrackUrl
    }
  }
  ${TRACK_COVER}
  ${TRACK_URL}
`;
