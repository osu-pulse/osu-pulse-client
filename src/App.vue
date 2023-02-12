<script lang="ts" setup>
import { usePlayer } from '~/player/stores/player';
import { useQueue } from '~/shared/stores/queue';

const { authenticated } = useAuthentication();
const { loading, offline } = useOffline();
const ready = computed(
  () => !loading.value && (offline.value || authenticated.value),
);

const { track } = usePlayer();
const { queue } = useQueue();
let a = true;
watch(queue, () => {
  if (queue.value.length > 0 && a) {
    a = false;
    return (track.value = queue.value[0]);
  }
});
</script>

<template>
  <div class="app-component">
    <TheTitleBar v-if="platform === Platform.ELECTRON" class="title-bar" />

    <div class="window">
      <RouterView v-slot="{ Component }">
        <Transition mode="out-in">
          <div v-if="ready" class="body">
            <TheSideMenu class="side-menu" />

            <main class="main-section">
              <div class="page-container">
                <Transition mode="out-in">
                  <Component :is="Component" class="page" />
                </Transition>
              </div>

              <ThePlayer class="player"></ThePlayer>
            </main>

            <TheQueue class="queue"></TheQueue>
          </div>

          <TheIntroLoader v-else class="loader" />
        </Transition>
      </RouterView>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'shared/styles/transitions';
@use 'shared/styles/constants';
@use 'shared/styles/mixins';

.app-component {
  @include mixins.size(fill);
  flex: auto;
  display: flex;
  flex-direction: column;

  .title-bar {
    flex: none;
  }

  .window {
    flex: auto;
    overflow: hidden;
    display: flex;

    .body,
    .loader {
      @include transitions.fade();

      &.loader.v-leave-to {
        transform: scale(1.2);
      }
    }

    .loader {
      flex: auto;
    }

    .body {
      flex: auto;
      display: flex;
      gap: 10px;
      overflow: auto;
      background-color: constants.$clr-secondary;

      .side-menu {
        flex: none;
      }

      .main-section {
        display: flex;
        flex: auto;
        flex-direction: column;
        gap: 10px;

        .page-container {
          padding: 0 20px;
          overflow: auto;
          flex: auto;

          .page {
            @include transitions.fade();
          }
        }

        .player {
          margin-bottom: 10px;
        }
      }

      .queue {
      }
    }
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
