<script lang="ts" setup></script>

<template>
  <div class="queue-component">
    queue
  </div>
</template>

<style lang="scss" scoped>
@use '../../shared/styles/constants';

.queue-component {
  width: 350px;
  transition: constants.$trn-normal-out;
}

@media (max-width: constants.$bpt-2xl) and (min-width: constants.$bpt-lg) {
  .queue-component {
    width: 300px;
  }
}

@media (max-width: constants.$bpt-lg) {
  .queue-component {
    width: 250px;
  }
}

@media (max-width: constants.$bpt-sm) {
  .queue-component {
    width: unset;
  }
}
</style>
