<script lang="ts" setup>
import {
  breakpointsTailwind,
  tryOnMounted,
  useBreakpoints,
  useLocalStorage,
  whenever,
} from '@vueuse/core'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Platform, platform } from '@/shared/constants/platform'
import TheTitleBar from '@/core/components/TheTitleBar.vue'
import TheSideMenu from '@/core/components/TheSideMenu.vue'
import ThePlayer from '@/player/components/ThePlayer.vue'
import TheIntroLoader from '@/core/components/TheIntroLoader.vue'
import TheQueue from '@/queue/components/TheQueue.vue'
import { useAuthentication } from '@/auth/stores/authentication'
import { useOffline } from '@/core/stores/offline'
import { useMetrika } from '@/core/hooks/metrika'
import TheBottomMenu from '@/core/components/TheBottomMenu.vue'
import { usePlayer } from '@/player/stores/player'
import { useColors } from '@/themes/stores/colors'
import { useUrlTrack } from '@/player/hooks/url-track'
import { serializer } from '@/shared/utils/serializer'

const { greater } = useBreakpoints(breakpointsTailwind)
const greaterSm = greater('sm')

useMetrika()
useColors()
useUrlTrack()

const { authenticated } = useAuthentication()
const { loading } = useOffline()

const { track } = usePlayer()

const menuShowed = ref(false)
whenever(greaterSm, () => menuShowed.value = false)

const playerMaximized = ref(false)
whenever(playerMaximized, () => menuShowed.value = false)
whenever(menuShowed, () => playerMaximized.value = false)
const route = useRoute()
watch(route, () => playerMaximized.value = false)

const devHint = useLocalStorage('app_dev-hint', true, { serializer })
tryOnMounted(() => {
  if (import.meta.env.PROD && devHint.value) {
    // eslint-disable-next-line no-alert
    alert(
      'This site is in the developing state. '
      + 'Contact us: https://github.com/osu-pulse',
    )
    devHint.value = false
  }

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
                <TheQueue v-if="playerMaximized" class="queue" />

                <TheSideMenu v-else-if="menuShowed" class="side-menu" />

                <div v-else class="page-container">
                  <Transition mode="out-in">
                    <Component :is="Component" class="page" />
                  </Transition>
                </div>
              </Transition>

              <ThePlayer v-if="track" v-model:maximized="playerMaximized" class="player" />
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
  flex: 1;
  display: flex;
  flex-direction: column;

  .title-bar {
    flex: none;
  }

  .window {
    flex: 1;
    display: flex;
    overflow: hidden;

    .body,
    .loader {
      @include transitions.fade();

      &.loader.v-leave-to {
        transform: scale(1.2);
      }
    }

    .loader {
      flex: 1;
    }

    .body {
      flex: 1;
      display: flex;
      background-color: rgb(constants.$clr-secondary);
      overflow: hidden;

      .main-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .page-container {
          flex: 1;
          display: flex;
          overflow: hidden;

          .page {
            @include transitions.fade();
            flex: 1;
          }
        }

        .player {
          margin: 0 10px 10px 10px;
        }
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
          .queue, .side-menu, .page-container {
            @include transitions.fade();
          }

          .queue, .side-menu {
            margin: 10px;
            flex: 1;
            border-radius: constants.$cmn-border-radius;
            box-shadow: constants.$cmn-shadow-block;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
@use 'shared/styles/mixins';

@import 'core/styles/globals';
@import 'core/styles/typography';

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
