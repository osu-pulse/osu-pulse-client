<script lang="ts" setup>
import {
  SwipeDirection,
  breakpointsTailwind,
  useBreakpoints,
  useSwipe,
  useVModel,
  whenever,
} from '@vueuse/core'
import type { ComponentPublicInstance } from 'vue'
import { computed, shallowRef } from 'vue'
import ThePlayerSound from '@/player/components/ThePlayerSound.vue'
import ThePlayerControl from '@/player/components/ThePlayerControl.vue'
import ThePlayerTimeline from '@/player/components/ThePlayerTimeline.vue'
import ThePlayerSettings from '@/player/components/ThePlayerSettings.vue'
import ThePlayerInfo from '@/player/components/ThePlayerInfo.vue'
import { usePlayerHotkeys } from '@/player/hooks/player-hotkeys'
import { usePlayerMedia } from '@/player/hooks/player-media'
import { useCurrentTrack } from '@/player/stores/current-track'
import { switchExec } from '@/shared/utils/switch'

const props = defineProps<{
  maximized?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:maximized', value: boolean): void
}>()

usePlayerMedia()
usePlayerHotkeys()

const maximized = useVModel(props, 'maximized', emits)

const { greater } = useBreakpoints(breakpointsTailwind)
const greaterLg = greater('lg')
const greaterSm = greater('sm')
whenever(greaterSm, () => maximized.value = false)

function handleMaximize() {
  if (!greaterSm.value)
    maximized.value = !maximized.value
}

const { hasPrev, hasNext, prev, next } = useCurrentTrack()
const playerInfoRef = shallowRef<ComponentPublicInstance>()
const { lengthX, isSwiping, direction } = useSwipe(
  () => (!greaterSm.value && maximized.value) && playerInfoRef.value?.$el,
  { threshold: 0 },
)

const swipeThreshold = 20
whenever(() => !isSwiping.value, () => {
  if (Math.abs(lengthX.value) > swipeThreshold) {
    switchExec(direction.value, {
      [SwipeDirection.LEFT]: next,
      [SwipeDirection.RIGHT]: prev,
    })
  }
})

const maxOffset = 40
const playerOffset = computed(() => {
  if (
    !isSwiping.value
    || (lengthX.value > 0 && !hasNext.value)
    || (lengthX.value < 0 && !hasPrev.value)
  )
    return 0
  else
    return Math.max(-maxOffset, Math.min(maxOffset, -lengthX.value))
})
</script>

<template>
  <div class="player-component">
    <div
      class="container"
      :class="{ _minimized: !maximized, _swiping: isSwiping }"
      :style="{ '--offset': `${playerOffset}px` }"
    >
      <ThePlayerInfo
        ref="playerInfoRef"
        class="info"
        :center="(!greaterLg && greaterSm) || (!greaterSm && maximized)"
        @click="handleMaximize"
      />
      <Transition mode="out-in">
        <div v-if="greaterSm" class="player">
          <div class="main">
            <ThePlayerSound class="sound" />
            <ThePlayerSettings class="settings" />
          </div>

          <ThePlayerControl class="control" />

          <ThePlayerTimeline class="timeline" />
        </div>

        <div v-else-if="maximized" class="player">
          <ThePlayerControl class="control" />

          <ThePlayerTimeline class="timeline" />

          <div class="main">
            <ThePlayerSound class="sound" />
            <ThePlayerSettings class="settings" />
          </div>
        </div>

        <div v-else class="player">
          <ThePlayerControl class="control" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.player-component {
  border-radius: constants.$cmn-border-radius;
  overflow: hidden;

  .container {
    min-width: max-content;
    display: flex;
    height: 100px;
    overflow: hidden;
    border-radius: constants.$cmn-border-radius;
    background-color: rgb(constants.$clr-background);
    box-shadow: constants.$cmn-shadow-block;
    transition: constants.$trn-normal-out;

    .info {
      overflow: hidden;
      margin-right: 20px;
    }

    .player {
      position: relative;
      flex: auto;
      padding: 10px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .control {
        z-index: 2;
        margin: 10px auto;
      }

      .main {
        z-index: 1;
        position: absolute;
        width: calc(100% - 20px);
        display: flex;
        justify-content: space-between;
      }
    }
  }
}

@media (max-width: constants.$bpt-lg) and (min-width: constants.$bpt-sm) {
  .player-component {
    .container {
      height: 200px;
      flex-direction: column;

      .info {
        flex: auto;
        margin: 0;
      }

      .player {
        padding: 10px 20px;
        flex: none;
        height: 100px;

        .main {
          width: calc(100% - 40px);
        }
      }
    }
  }
}

@media (max-width: constants.$bpt-sm) {
  .player-component {
    .container {
      .info {
        flex: 1 0;
      }

      .player {
        @include transitions.fade($leave: false);
        flex: none;

        &.v-leave-from {
          .timeline, .main {
            display: none;
          }
        }
      }

      &:not(._minimized) {
        --offset: 0px;
        height: 240px;
        flex-direction: column;
        transform: translateX(var(--offset));
        transition: constants.$trn-normal-out;

        &._swiping {
          transition: 0.05s;
        }

        .info {
          margin-right: 0;
        }

        .player {
          padding: 10px 20px;
          height: 130px;

          .control {
            margin: 0 auto;
          }

          .timeline {
            margin-bottom: 5px;
          }

          .main {
            position: unset;
            width: unset;

            .sound {
              width: 120px;
            }
          }
        }
      }

      &._minimized {
        height: 60px;
        flex-direction: row;

        .info {
          margin-right: 5px;
          width: unset;
        }

        .player {
          .control {
            margin: auto 0;
          }
        }
      }
    }
  }
}
</style>
