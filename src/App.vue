<script lang="ts" setup>
</script>

<template>
  <div class="app-component">
  </div>
</template>

<style lang="scss" scoped>
@use 'shared/styles/transitions';
@use 'shared/styles/constants';
@use 'shared/styles/mixins';

.app-component {
  flex: auto;
  overflow: auto;
}
</style>

<style lang="scss">
@use 'shared/styles/mixins';

@import 'core/styles/globals';
@import 'core/styles/fonts';
@import 'core/styles/overrides';

#app {
  @include mixins.size(fill);
  position: absolute;
  display: flex;
}
</style>
