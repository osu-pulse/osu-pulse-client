<script lang="ts" setup>
import { ref, shallowRef } from 'vue'
import { onClickOutside, whenever } from '@vueuse/core'
import TrackItem from '@/library/components/TrackItem.vue'
import { useSearchTracks } from '@/library/stores/search-tracks'
import { useDebounceRef } from '@/shared/hooks/debounce-ref'

const { search, library, global } = useSearchTracks()
const searchDebounced = useDebounceRef(search, { debounce: 200 })

const focused = ref(false)

const opened = ref(false)
whenever(() => focused.value || searchDebounced.value, () => opened.value = true)

const containerRef = shallowRef<HTMLDivElement>()
onClickOutside(containerRef, () => opened.value = false)
</script>

<template>
  <div class="search-tracks-results-component">
    <Transition>
      <div v-show="library.length" class="section">
        <h3 class="label">
          Library
        </h3>

        <div class="list">
          <TrackItem
            v-for="(track, index) in library"
            :key="track.id"
            :track="track"
            :order="index + 1"
            inset
            class="track-item"
          />
        </div>
      </div>
    </Transition>

    <Transition>
      <div v-show="global.length" class="section">
        <h3 class="label">
          Global
        </h3>

        <div class="list">
          <TrackItem
            v-for="(track, index) in global"
            :key="track.id"
            :track="track"
            :order="index + 1"
            inset
            class="track-item"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.search-tracks-results-component {
  @include transitions.fade();
  padding: 15px 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-radius: constants.$cmn-border-radius;
  background: rgb(constants.$clr-background);
  box-shadow: constants.$cmn-shadow-block;
  overflow: auto;

  .section {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .label {
      margin-left: 15px;
      font-weight: normal;
      color: rgb(constants.$clr-text-inactive);
      letter-spacing: 0.5px;
    }

    .list {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .track-item {
        flex: none;
      }
    }
  }
}

@media (max-width: constants.$bpt-lg) {
  .search-tracks-results-component {
    padding-left: 10px;
  }
}
</style>
