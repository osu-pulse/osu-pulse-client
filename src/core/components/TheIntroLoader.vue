<template>
  <div class="intro-loader-component">
    <img class="icon" alt="logo" src="@/shared/assets/logo.svg?url">
  </div>
</template>

<style scoped lang="scss">
@use '../../shared/styles/mixins';

.intro-loader-component {
  --color-osu: #fa94b2;
  display: flex;
  background: radial-gradient(circle, white 50%, var(--color-osu) 100%);

  .icon {
    @include mixins.size(100px);
    margin: auto;
  }
}
</style>
