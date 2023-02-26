<script lang="ts" setup>
import {
  breakpointsTailwind,
  tryOnMounted,
  useBreakpoints,
  watchOnce,
  whenever,
} from '@vueuse/core'
import { ref } from 'vue'
import { useQueue } from '@/core/stores/queue'
import { Platform, platform } from '@/shared/constants/platform'
import TheTitleBar from '@/core/components/TheTitleBar.vue'
import TheSideMenu from '@/core/components/TheSideMenu.vue'
import ThePlayer from '@/player/components/ThePlayer.vue'
import TheIntroLoader from '@/core/components/TheIntroLoader.vue'
import TheQueue from '@/core/components/TheQueue.vue'
import { useAuthentication } from '@/auth/stores/authentication'
import { useOffline } from '@/core/stores/offline'
import { useMetrika } from '@/core/hooks/metrika'
import { useCurrentTrack } from '@/player/stores/current-track'
import TheBottomMenu from '@/core/components/TheBottomMenu.vue'
import { usePlayer } from '@/player/stores/player'
import { useColors } from '@/core/stores/colors'

const { greater } = useBreakpoints(breakpointsTailwind)
const greaterSm = greater('sm')

useMetrika()
useColors()

const { check } = useOffline()
tryOnMounted(check)

const { authenticated } = useAuthentication()
const { loading } = useOffline()

const { queue } = useQueue()
const { trackId } = useCurrentTrack()
watchOnce(queue, () => (trackId.value = queue.value[0]?.id))

const { track } = usePlayer()

const menuShowed = ref(false)
whenever(greaterSm, () => menuShowed.value = false)

const playerMaximized = ref(false)

tryOnMounted(() => {
  // eslint-disable-next-line no-console
  console.clear()
  // eslint-disable-next-line no-console
  console.log('This app in the development state')
  // eslint-disable-next-line no-console
  console.log('GitHub organization: https://github.com/osu-pulse')
})
</script>

<template>
  <div class="app-component">
    <TheTitleBar v-if="platform === Platform.ELECTRON" class="title-bar" />

    <div class="window">
      <RouterView v-slot="{ Component }">
        <Transition v-if="greaterSm" mode="out-in">
          <TheIntroLoader v-if="!authenticated && loading" class="loader" />

          <div v-else class="body">
            <TheSideMenu class="side-menu" />

            <main class="main-section">
              <div class="page-container">
                <Transition mode="out-in">
                  <Component :is="Component" class="page" />
                </Transition>
              </div>

              <Transition>
                <ThePlayer v-if="track" class="player" />
              </Transition>
            </main>

            <TheQueue class="queue" />
          </div>
        </Transition>

        <Transition v-else mode="out-in">
          <TheIntroLoader v-if="!authenticated && loading" class="loader" />

          <div v-else class="body">
            <main class="main-section">
              <Transition mode="out-in">
                <TheSideMenu v-if="menuShowed" class="side-menu" />

                <div v-else class="page-container">
                  <Transition mode="out-in">
                    <Component :is="Component" class="page" />
                  </Transition>
                </div>
              </Transition>

              <Transition>
                <ThePlayer v-if="track" v-model:maximized="playerMaximized" class="player" />
              </Transition>
            </main>

            <TheBottomMenu v-model:menu-showed="menuShowed" class="bottom-menu" />
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
      background-color: rgb(constants.$clr-secondary);

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

            &.v-leave-active {
              transition: constants.$trn-fast-out;
            }
          }
        }

        .player {
          @include transitions.move($y: -10px);
          margin-bottom: 10px;
        }
      }

      .queue {
      }
    }
  }
}

@media (max-width: constants.$bpt-sm) {
  .app-component {
    .window {
      .body {
        flex-direction: column;
        gap: 0;

        .main-section {
          gap: 0;
          overflow: auto;

          .side-menu, .page-container {
            @include transitions.fade();

            &.v-leave-active {
              transition: constants.$trn-fast-out;
            }
          }

          .side-menu {
            margin: 10px;
            flex: auto;
            border-radius: constants.$cmn-border-radius;
            box-shadow: constants.$cmn-shadow-block;
          }

          .player {
            flex: none;
            margin: 0 10px 10px;
          }
        }

        .bottom-menu {
          flex: none;
        }
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
  --color-primary: 0, 0, 0;
  --color-secondary: 244, 245, 254;
  --color-background: 255, 255, 255;
  --color-text: 0, 0, 0;
  --color-text-inactive: 143, 145, 165;
  --color-accent: var(--color-primary);
}

#app {
  @include mixins.size(fill);
  position: absolute;
  display: flex;
}
</style>
