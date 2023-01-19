<script lang="ts" setup>
import TheSideMenu from '~/core/components/TheSideMenu.vue';
import TheQueue from '~/core/components/TheQueue.vue';
</script>

<template>
  <div class="app">
    <TheSideMenu class="side-menu" />

    <div class="main-section">
      <div class="page-container">
        <RouterView v-slot="{ Component }">
          <Transition mode="out-in">
            <Component :is="Component" />
          </Transition>
        </RouterView>
      </div>

      <ThePlayer class="player"></ThePlayer>
    </div>

    <TheQueue class="queue"></TheQueue>
  </div>
</template>

<style lang="scss" scoped>
@use 'shared/styles/transitions';
@use 'shared/styles/constants';
@use 'shared/styles/mixins';

.app {
  flex: auto;
  display: flex;
  gap: 10px;
  overflow: auto;
  background-color: constants.$clr-secondary;

  .side-menu {
  }

  .main-section {
    display: flex;
    flex: auto;
    flex-direction: column;

    .page-container {
      overflow: auto;
      flex: auto;
    }

    .player {
    }
  }

  .queue {
  }
}
</style>

<style lang="scss">
@use 'shared/styles/mixins';

@import 'core/styles/globals';
@import 'core/styles/fonts';

:root {
  --color-primary: #000000;
  --color-secondary: #f4f5fe;
  --color-background: #ffffff;
  --color-text-inactive: #8f91a5;
}

#app {
  @include mixins.size(fill);
  position: absolute;
  display: flex;
}
</style>
