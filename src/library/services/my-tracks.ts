import type { Ref } from 'vue'
import { createGlobalState } from '@vueuse/core'
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import type { Track } from '@/shared/dto/track'
import { TRACK } from '@/shared/dto/track'

export const useMyTracksService = createGlobalState(() => ({
  myTracks: (
    search?: Ref<string | undefined>,
    limit?: Ref<number | undefined>,
    offset?: Ref<number | undefined>,
  ) =>
    useQuery<
      { myTracks: Track[] },
      { search?: string; limit?: number; offset?: number }
    >(
      gql`
        query myTracks($search: String, $limit: Int, $offset: Int) {
          myTracks(search: $search, limit: $limit, offset: $offset) {
            ...Track
          }
        }
        ${TRACK}
      `,
      () => ({
        search: search?.value,
        limit: limit?.value,
        offset: offset?.value,
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
