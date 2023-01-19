<script lang="ts" setup>
import TheSideMenu from '~/core/components/TheSideMenu.vue';
import TheQueue from '~/core/components/TheQueue.vue';
</script>

<template>
  <div class="app-component">
    <TheSideMenu class="side-menu" />

    <div class="main-section">
      <div class="page-outer">
        <router-view v-slot="{ Component }">
          <Transition mode="out-in">
            <Component :is="Component" />
          </Transition>
        </router-view>
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
  gap: 10px;
  overflow: auto;
  background-color: constants.$clr-main-section;

  .side-menu {
  }

  .main-section {
    display: flex;
    flex: auto;
    flex-direction: column;

    .page-outer {
      flex: auto;
      background-color: constants.$clr-main-section;
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
