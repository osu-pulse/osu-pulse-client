<script lang="ts" setup>
import TrackItem from '@/shared/components/TrackItem.vue'
import { useLibrary } from '@/library/stores/library'

const { library } = useLibrary()
</script>

<template>
  <div class="library-module">
    <div class="header">
      Library
    </div>

    <div class="list">
      <TrackItem v-for="(track, index) in library" :key="track.id" class="track-item" :track="track" :order="index + 1" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.library-module {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;

  .list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
