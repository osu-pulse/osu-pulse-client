<script lang="ts" setup></script>

<template>
  <div class="player-component">
    <div class="player-container"></div>
  </div>
</template>

<style lang="scss" scoped>
.player-component {
  height: 120px;
  background-color: #f4f5fe;
  border: 1px solid #9099e5;
  display: flex;
  justify-content: center;
  align-items: center;

  .player-container {
    background-color: white;
    width: 85%;
    height: 80%;
    border-radius: 10px;
  }
}
</style>
