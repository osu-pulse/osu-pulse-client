<script lang="ts" setup>
import { tryOnMounted, watchOnce } from '@vueuse/core'
import { usePlayer } from '@/core/stores/player'
import { useQueue } from '@/core/stores/queue'
import { Platform, platform } from '@/shared/constants/platform'
import TheTitleBar from '@/core/components/TheTitleBar.vue'
import TheSideMenu from '@/core/components/TheSideMenu.vue'
import ThePlayer from '@/core/components/ThePlayer.vue'
import TheIntroLoader from '@/core/components/TheIntroLoader.vue'
import TheQueue from '@/core/components/TheQueue.vue'
import { useAuthentication } from '@/auth/stores/authentication'
import { useOffline } from '@/core/stores/offline'
import { useMetrika } from '@/core/stores/metrika'

useMetrika()

const { authenticated } = useAuthentication()
const { loading } = useOffline()

const { track } = usePlayer()
const { queue } = useQueue()
watchOnce(queue, () => track.value = queue.value[0])

tryOnMounted(() => {
  console.clear()
  console.log('This app in the development state')
  console.log('GitHub organization: https://github.com/osu-pulse')
})
</script>

<template>
  <div class="app-component">
    <TheTitleBar v-if="platform === Platform.ELECTRON" class="title-bar" />

    <div class="window">
      <RouterView v-slot="{ Component }">
        <Transition mode="out-in">
          <TheIntroLoader v-if="!authenticated && loading" class="loader" />

          <div v-else class="body">
            <TheSideMenu class="side-menu" />

            <main class="main-section">
              <div class="page-container">
                <Transition mode="out-in">
                  <Component :is="Component" class="page" />
                </Transition>
              </div>

              <ThePlayer class="player" />
            </main>

            <TheQueue class="queue" />
          </div>
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
            position: relative;
            display: flex;
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
  --color-text: #000000;
  --color-text-inactive: #8f91a5;
}

#app {
  @include mixins.size(fill);
  position: absolute;
  display: flex;
}
</style>
