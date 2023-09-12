import type { Ref } from 'vue'
import { createGlobalState } from '@vueuse/core'
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import type { Track } from '@/shared/dto/track'
import { TRACK } from '@/shared/dto/track'

export const useTracksService = createGlobalState(() => ({
  tracks: (
    search?: Ref<string | undefined>,
    limit?: Ref<number | undefined>,
    offset?: Ref<number | undefined>,
  ) =>
    useQuery<
      { tracks: Track[] },
      { search?: string; limit?: number; offset?: number }
    >(
      gql`
        query tracks($search: String, $limit: Int, $offset: Int) {
          tracks(search: $search, limit: $limit, offset: $offset) {
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

  track: (trackId: Ref<string | undefined>) =>
    useQuery<{ track: Track }, { trackId?: string }>(
      gql`
        query track($trackId: String!) {
          track(trackId: $trackId) {
            ...Track
          }
        }
        ${TRACK}
      `,
      () => ({
        trackId: trackId.value,
      }),
      () => ({
        enabled: Boolean(trackId.value),
      }),
    ),
}))
