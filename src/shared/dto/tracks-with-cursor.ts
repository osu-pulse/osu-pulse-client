import type { WithCursor } from '~/shared/types/with-cursor';
import type { Track } from '~/shared/dto/track';

export type TracksWithCursor = WithCursor<Track>;

export const TRACKS_WITH_CURSOR = gql`
  fragment TracksWithCursor on TracksWithCursorObject {
    data {
      ...Track
    }
    cursor
  }
  ${TRACK}
`;
