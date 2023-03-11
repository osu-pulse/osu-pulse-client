<script lang="ts" setup>
import TrackItem from '@/library/components/TrackItem.vue'
import { useMyTracks } from '@/library/stores/my-tracks'
import TheSearchTracksField from '@/library/components/TheSearchTracksField.vue'
import { useSearchTracks } from '@/library/stores/search-tracks'
import TheSearchTracksResults
  from '@/library/components/TheSearchTracksResults.vue'

const { tracks } = useMyTracks()

const { search } = useSearchTracks()
</script>

<template>
  <div class="library-view">
    <TheSearchTracksField class="search-field" />

    <Transition mode="out-in">
      <TheSearchTracksResults v-if="search" class="search-results" />

      <div v-else class="list">
        <TrackItem
          v-for="(track, index) in tracks"
          :key="track.id"
          :track="track"
          :order="index + 1"
          class="track-item"
        />
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use 'src/shared/styles/constants';
@use 'src/shared/styles/transitions';

.library-view {
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .search-field {
    margin: 0 10px;
  }

  .search-results, .list {
    @include transitions.fade();
    flex: 1;
  }

  .search-results {
    margin: 10px;
  }

  .list {
    position: relative;
    margin: 10px 0;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: auto;

    .track-item {
      flex: none;
    }
  }
}
</style>
