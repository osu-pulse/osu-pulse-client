<script lang="ts" setup></script>

<template>
  <div class="player-component">
    <div class="player-container"></div>
  </div>
</template>

<style lang="scss" scoped>
@use '../src/shared/styles/constants';

.player-component {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  background-color: constants.$clr-main-section;
  border: 1px solid #9099e5;

  .player-container {
    width: 85%;
    height: 80%;
    background-color: white;
    border-radius: 10px;
  }
}
</style>
