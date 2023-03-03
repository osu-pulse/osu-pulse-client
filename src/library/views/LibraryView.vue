<script lang="ts" setup>
import Track from '@/shared/components/Track.vue'
import { useLibrary } from '@/library/stores/library'

const { library } = useLibrary()
</script>

<template>
  <div class="library-module">
    <div class="header">
      Library
    </div>

    <div class="list">
      <Track v-for="track in library" :key="track.id" :track="track" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.library-module {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;

}
</style>
