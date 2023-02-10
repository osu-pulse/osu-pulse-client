<script lang="ts" setup>
import TheTitlebar from '~/core/components/TheTitleBar.vue';

const { isAuthenticated, login } = useAuthentication();

const { isLoading, isOffline } = useOffline();
whenever(() => !isOffline.value, login, { immediate: true });
</script>

<template>
  <div class="app-component">
    <TheTitleBar v-if="platform === Platform.ELECTRON" class="title-bar" />

    <div class="window">
      <Transition mode="out-in">
        <div v-if="!isLoading && (isAuthenticated || isOffline)" class="body">
          <TheSideMenu class="side-menu" />

          <main class="main-section">
            <div class="page-container">
              <RouterView v-slot="{ Component }">
                <Transition mode="out-in">
                  <Component :is="Component" />
                </Transition>
              </RouterView>
            </div>

            <ThePlayer class="player"></ThePlayer>
          </main>

          <TheQueue class="queue"></TheQueue>
        </div>

        <PageLoader v-else class="loader" />
      </Transition>
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
    overflow: auto;
    display: flex;

    .body,
    .loader {
      @include transitions.fade();
    }

    .loader {
      margin: auto;
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
