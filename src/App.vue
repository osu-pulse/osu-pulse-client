<script lang="ts" setup>
import TheSideMenu from '~/core/components/TheSideMenu.vue';
import TheQueue from '~/core/components/TheQueue.vue';
</script>

<template>
  <div class="app-component">
    <TheSideMenu class="side-menu" />

    <div class="body">
      <div class="page-outer">
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

.app-component {
  flex: auto;
  display: flex;
  overflow: auto;
  background-color: #f4f5fe;

  .side-menu {
  }

  .body {
    display: flex;
    flex: auto;
    flex-direction: column;
    border-radius: 20px;

    .page-outer {
      flex: auto;
      background-color: #f4f5fe;
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
@import 'core/styles/overrides';

#app {
  @include mixins.size(fill);
  position: absolute;
  display: flex;
}
</style>
