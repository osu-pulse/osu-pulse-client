<script setup lang="ts">
import ScaleLoader from 'vue-spinner/src/ScaleLoader.vue';
</script>

<template>
  <div class="intro-loader-component">
    <img class="icon" alt="logo" src="../../shared/assets/logo.webp" />

    <ScaleLoader margin="4px" color="#fa94b2" />
  </div>
</template>

<style scoped lang="scss">
@use 'src/shared/styles/constants';

.intro-loader-component {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
  background: radial-gradient(
    circle,
    #{constants.$clr-background} 50%,
    #{constants.$clr-osu} 150%
  );
}
</style>
