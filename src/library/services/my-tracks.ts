import type { Ref } from 'vue'
import { createGlobalState } from '@vueuse/core'
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import type { TracksWithCursor } from '@/shared/dto/tracks-with-cursor'
import type { Track } from '@/shared/dto/track'
import { TRACKS_WITH_CURSOR } from '@/shared/dto/tracks-with-cursor'
import { TRACK } from '@/shared/dto/track'

export const useMyTracksService = createGlobalState(() => ({
  myTracks: (
    search?: Ref<string | undefined>,
    cursor?: Ref<string | undefined>,
    limit?: number,
  ) =>
    useQuery<
      { myTracks: TracksWithCursor },
      { search?: string; cursor?: string; limit?: number }
    >(
      gql`
        query myTracks($search: String, $cursor: String, $limit: Int) {
          myTracks(search: $search, cursor: $cursor, limit: $limit) {
            ...TracksWithCursor
          }
        }
        ${TRACKS_WITH_CURSOR}
      `,
      () => ({
        search: search?.value,
        cursor: cursor?.value,
        limit,
      }),
    ),

  addMyTrack: () =>
    useMutation<{ addMyTrack: Track }, { trackId: string }>(
      gql`
        mutation addMyTrack($trackId: String!) {
          addMyTrack(trackId: $trackId) {
            ...Track
          }
        }
        ${TRACK}
      `,
    ),

  removeMyTrack: () =>
    useMutation<{ addMyTrack: Track }, { trackId: string }>(
      gql`
        mutation removeMyTrack($trackId: String!) {
          removeMyTrack(trackId: $trackId) {
            ...Track
          }
        }
        ${TRACK}
      `,
    ),
}))
