<template>
  <div class="spinner-component">
    <div class="circle-container">
      <div class="circle-1" />
      <div class="circle-2" />
    </div>

    <div class="icon-container">
      <img class="icon" alt="logo" src="../assets/logo.webp" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'src/shared/styles/mixins';

@keyframes circle-scale {
  0%,
  100% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
}

.spinner-component {
  @include mixins.size(500px);
  position: relative;
  display: flex;

  .icon-container {
    @include mixins.size(fill);
    position: absolute;
    display: flex;

    .icon {
      margin: auto;
    }
  }

  .circle-1,
  .circle-2 {
    @include mixins.size(fill);
    position: absolute;
    top: 0;
    left: 0;
    background-color: #eb7898;
    border-radius: 50%;
    opacity: 0.6;
  }

  .circle-1 {
    animation: circle-scale 2s 1s infinite ease-in-out;
    animation-fill-mode: both;
  }
  .circle-2 {
    animation: circle-scale 2s 0s infinite ease-in-out;
    animation-fill-mode: both;
  }
}
</style>
