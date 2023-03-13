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
import { computed, shallowRef, watch } from 'vue'
import ThePlayerSound from '@/player/components/ThePlayerSound.vue'
import ThePlayerControl from '@/player/components/ThePlayerControl.vue'
import ThePlayerTimeline from '@/player/components/ThePlayerTimeline.vue'
import ThePlayerSettings from '@/player/components/ThePlayerSettings.vue'
import ThePlayerInfo from '@/player/components/ThePlayerInfo.vue'
import { usePlayerHotkeys } from '@/player/hooks/player-hotkeys'
import { usePlayerMedia } from '@/player/hooks/player-media'
import { useCurrentTrack } from '@/player/stores/current-track'
import { usePlayerFeedback } from '@/player/hooks/player-feedback'
import { switchAssign, switchExec } from '@/shared/utils/switch'
import AudioVisualizer from '@/shared/components/AudioVisualizer.vue'

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

const { hasPrev, hasNext, prev, next } = useCurrentTrack()
const playerInfoRef = shallowRef<ComponentPublicInstance>()
const mobilePlayerInfoRef = computed(() => !greaterSm.value && playerInfoRef.value?.$el)

const {
  direction,
  isSwiping,
} = useSwipe(mobilePlayerInfoRef, { threshold: 30 })

const changeTrackAvailable = computed(() => switchAssign(direction.value, {
  [SwipeDirection.LEFT]: hasNext.value,
  [SwipeDirection.RIGHT]: hasPrev.value,
}, false))
const changeMaximizedAvailable = computed(() => switchAssign(direction.value, {
  [SwipeDirection.UP]: !maximized.value,
  [SwipeDirection.DOWN]: maximized.value,
}, false))

const { swipeStart, swipeEnd } = usePlayerFeedback()
watch([isSwiping, direction], () => {
  if (isSwiping.value) {
    if (changeMaximizedAvailable.value || changeTrackAvailable.value)
      swipeStart()
  }
  else {
    if (changeMaximizedAvailable.value || changeTrackAvailable.value)
      swipeEnd()
  }
})

whenever(() => !isSwiping.value, () => {
  if (changeTrackAvailable.value) {
    switchExec(direction.value, {
      [SwipeDirection.LEFT]: next,
      [SwipeDirection.RIGHT]: prev,
    })
  }
  if (changeMaximizedAvailable.value) {
    switchExec(direction.value, {
      [SwipeDirection.UP]: () => maximized.value = true,
      [SwipeDirection.DOWN]: () => maximized.value = false,
    })
  }
})
</script>

<template>
  <Transition mode="out-in">
    <div
      :key="greaterSm || maximized"
      class="player-component"
      :class="!greaterSm && {
        _minimized: !maximized,
        ...(isSwiping && {
          ...(changeTrackAvailable && {
            _left: direction === SwipeDirection.LEFT,
            _right: direction === SwipeDirection.RIGHT,
          }),
          ...(changeMaximizedAvailable && {
            _up: direction === SwipeDirection.UP,
            _down: direction === SwipeDirection.DOWN,
          }),
        }),
      }"
    >
      <ThePlayerInfo
        ref="playerInfoRef"
        class="info"
        :center="(!greaterLg && greaterSm) || (!greaterSm && maximized)"
        @click="maximized = !maximized"
      />

      <div class="player" :class="{ _minimized: !greaterSm && !maximized }">
        <div v-show="greaterSm || maximized" class="main">
          <ThePlayerSound class="sound" />
          <ThePlayerSettings class="settings" />
        </div>

        <ThePlayerControl class="control" :mini="!greaterSm && !maximized" />

        <ThePlayerTimeline v-show="greaterSm || maximized" class="timeline" />

        <AudioVisualizer v-if="greaterSm || maximized" class="visualizer" :length="60" />
      </div>

      <AudioVisualizer v-if="!greaterSm && !maximized" class="visualizer" :length="12" vertical />
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.player-component {
  display: flex;
  overflow: hidden;
  border-radius: constants.$cmn-border-radius;
  background-color: rgb(constants.$clr-background);
  box-shadow: constants.$cmn-shadow-block;
  transition: constants.$trn-normal-out;

  .info {
    margin-right: 20px;
    touch-action: none;
  }

  .player {
    position: relative;
    flex: 1;
    padding: 10px 10px 20px;
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

    .timeline {
      z-index: 1;
    }

    .visualizer {
      z-index: 0;
      position: absolute;
      bottom: 0;
      left: 50px;
      height: 25px;
      width: calc(100% - 100px);
      pointer-events: none;
    }
  }
}

@media (max-width: constants.$bpt-lg) and (min-width: constants.$bpt-md) {
  .player-component {
    flex-direction: column;

    .info {
      height: 120px;
      flex: none;
      margin: 0;
    }

    .player {
      padding: 10px 20px 20px;
      flex: none;
      height: unset;

      .main {
        width: calc(100% - 40px);
      }
    }
  }
}

@media (max-width: constants.$bpt-md) {
  .player-component {
    flex-direction: column;

    .info {
      margin-right: 0;
      height: 100px;
    }

    .player {
      padding: 10px 20px 20px;
      flex: none;
      height: 140px;

      .control {
        order: 1;
        margin: 0 auto;
      }

      .timeline {
        order: 2;
        margin-bottom: 5px;
      }

      .main {
        order: 3;
        position: unset;
        width: unset;

        .sound {
          width: 120px;
        }
      }

      .visualizer {
        left: 20px;
        width: calc(100% - 40px);
      }
    }
  }
}

@media (max-width: constants.$bpt-sm) {
  .player-component {
    @include transitions.fade($transition-enter: constants.$trn-fast-out);
    transition: constants.$trn-fast-out;

    &._left {
      transform: translateX(-30px);
    }

    &._right {
      transform: translateX(30px);
    }

    &._up {
      transform: translateY(-20px);
    }

    &._down {
      transform: translateY(20px);
    }

    &._minimized {
      position: relative;
      height: 60px;
      flex-direction: row;

      .visualizer {
        z-index: 2;
        position: absolute;
        right: 0;
        top: 5px;
        width: 25px;
        transform: rotate(180deg);
        height: calc(100% - 10px);
      }

      .info {
        margin-right: 5px;
        flex: 1;
        height: unset;
        width: unset;
      }

      .player {
        flex: 0;
        height: unset;
        padding: 10px 20px 10px 10px;

        .control {
          padding: 0;
          margin: auto 0;
        }
      }
    }
  }
}
</style>
