import type { Ref } from 'vue'
import { createGlobalState } from '@vueuse/core'
import { useMutation, useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import type { TracksWithCursor } from '@/shared/dto/tracks-with-cursor'
import type { Track } from '@/shared/dto/track'
import { TRACKS_WITH_CURSOR } from '@/shared/dto/tracks-with-cursor'
import { TRACK } from '@/shared/dto/track'

export const useTracksService = createGlobalState(() => ({
  tracks: (
    search?: Ref<string | undefined>,
    cursor?: Ref<string | undefined>,
  ) =>
    useQuery<
      { tracks: TracksWithCursor },
      { search?: string; cursor?: string }
    >(
      gql`
        query tracks($search: String, $cursor: String) {
          tracks(search: $search, cursor: $cursor) {
            ...TracksWithCursor
          }
        }
        ${TRACKS_WITH_CURSOR}
      `,
      () => ({
        search: search?.value,
        cursor: cursor?.value,
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

  cacheTrack: () =>
    useMutation<{ cacheTrack: Track }, { trackId: string }>(
      gql`
        mutation cacheTrack($trackId: String!) {
          cacheTrack(trackId: $trackId) {
            ...Track
          }
        }
        ${TRACK}
      `,
    ),

  cancelCacheTrack: () =>
    useMutation<{ cancelCacheTrack: Track }, { trackId: string }>(
      gql`
        mutation cancelCacheTrack($trackId: String!) {
          cancelCacheTrack(trackId: $trackId) {
            ...Track
          }
        }
        ${TRACK}
      `,
    ),
}))
