<template>
  <div class="intro-loader-component">
    <img class="icon" alt="logo" src="../../shared/assets/logo.webp">
  </div>
</template>

<style scoped lang="scss">
.intro-loader-component {
  --color-osu: #fa94b2;
  display: flex;
  background: radial-gradient(circle, white 50%, var(--color-osu) 100%);

  .icon {
    margin: auto;
  }
}
</style>
