<script lang="ts" setup></script>

<template>
  <div class="queue-component">queue</div>
</template>

<style lang="scss" scoped>
@use '../src/shared/styles/constants';

.queue-component {
  width: 20%;
  min-width: 150px;
  max-width: 250px;
  background-color: constants.$clr-main-section;
  border: 1px solid #6874dc;
}
</style>
