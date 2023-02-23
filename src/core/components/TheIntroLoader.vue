<script setup lang="ts">
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue'
</script>

<template>
  <div class="intro-loader-component">
    <img class="icon" alt="logo" src="../../shared/assets/logo.webp" />

    <ScaleLoader margin="4px" color="var(--color-osu)" />
  </div>
</template>

<style scoped lang="scss">
.intro-loader-component {
  --color-osu: #fa94b2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  background: radial-gradient(circle, white 50%, var(--color-osu) 100%);
}
</style>
