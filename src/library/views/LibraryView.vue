<script lang="ts" setup>
import TheLibraryTrack from '@/library/components/TheLibraryTrack.vue'
</script>

<template>
  <div class="library-module">
    <div class="header">
      Library
    </div>
    <TheLibraryTrack />
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
