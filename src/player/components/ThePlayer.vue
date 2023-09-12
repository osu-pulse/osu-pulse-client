<script lang="ts" setup>
import {
  breakpointsTailwind,
  useBreakpoints, useMediaQuery,
  useSwipe,
  useVModel,
  whenever,
} from '@vueuse/core'
import type { ComponentPublicInstance } from 'vue'
import { computed, ref, shallowRef } from 'vue'
import ThePlayerSound from '@/player/components/ThePlayerSound.vue'
import ThePlayerControl from '@/player/components/ThePlayerControl.vue'
import ThePlayerTimeline from '@/player/components/ThePlayerTimeline.vue'
import ThePlayerSettings from '@/player/components/ThePlayerSettings.vue'
import ThePlayerInfo from '@/player/components/ThePlayerInfo.vue'
import { usePlayerHotkeys } from '@/player/hooks/player-hotkeys'
import { usePlayerMedia } from '@/player/hooks/player-media'
import { useCurrentTrack } from '@/player/stores/current-track'
import { usePlayerFeedback } from '@/player/hooks/player-feedback'
import AudioVisualizer from '@/shared/components/AudioVisualizer.vue'
import { bound } from '@/shared/utils/bound'

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

const { lengthX, lengthY, isSwiping } = useSwipe(mobilePlayerInfoRef, { threshold: 0 })

const changeTrackThresholded = computed(() => Math.abs(lengthX.value) > 10)
const changeMaximizedThresholded = computed(() => Math.abs(lengthY.value) > 10)

const swipedX = ref(false)
const swipedY = ref(false)
whenever(() => !isSwiping.value, () => {
  swipedX.value = false
  swipedY.value = false
})

whenever(changeTrackThresholded, () => !swipedY.value && (swipedX.value = true))
whenever(changeMaximizedThresholded, () => !swipedX.value && (swipedY.value = true))

const changeTrackAvailable = computed(() => changeTrackThresholded.value && !swipedY.value && (lengthX.value < 0 ? hasNext.value : hasPrev.value))
const changeMaximizedAvailable = computed(() => changeMaximizedThresholded.value && !swipedX.value && (lengthY.value < 0 ? maximized.value : !maximized.value))

const { swipeStart, swipeEnd } = usePlayerFeedback()
const gestureActive = computed(() => () => changeTrackAvailable.value || changeMaximizedAvailable.value)
whenever(gestureActive, swipeStart)
whenever(() => !gestureActive.value, swipeEnd)

whenever(() => !isSwiping.value, () => {
  if (changeTrackAvailable.value)
    lengthX.value < 0 ? prev() : next()
  if (changeMaximizedAvailable.value)
    lengthY.value < 0 ? maximized.value = false : maximized.value = true
})

const offsetX = computed(() =>
  (changeTrackAvailable.value && isSwiping.value) ? bound(-lengthX.value, -50, 50) : 0,
)
const offsetY = computed(() =>
  (changeMaximizedAvailable.value && isSwiping.value) ? bound(-lengthY.value, -10, 10) : 0,
)

const hoverable = useMediaQuery('(hover: hover)')
function handleClickInfo() {
  if (!greaterSm.value && hoverable.value)
    maximized.value = !maximized.value
}
</script>

<template>
  <Transition mode="out-in">
    <div
      :key="greaterSm || maximized"
      class="player-component"
      :class="!greaterSm && { _minimized: !maximized }"
      :style="!greaterSm && { '--x': offsetX, '--y': offsetY }"
    >
      <ThePlayerInfo
        ref="playerInfoRef"
        class="info"
        :center="(!greaterLg && greaterSm) || (!greaterSm && maximized)"
        @click="handleClickInfo"
      />

      <div class="player" :class="{ _minimized: !greaterSm && !maximized }">
        <div v-show="greaterSm || maximized" class="main">
          <ThePlayerSound class="sound" />
          <ThePlayerSettings class="settings" />
        </div>

        <ThePlayerControl class="control" :mini="!greaterSm && !maximized" />

        <ThePlayerTimeline v-show="greaterSm || maximized" class="timeline" />

        <AudioVisualizer v-if="greaterSm || maximized" class="visualizer" :length="60" stoppable />
      </div>

      <AudioVisualizer v-if="!greaterSm && !maximized" class="visualizer" :length="12" vertical inverted stoppable />
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
      height: 20px;
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
    --x: 0;
    --y: 0;
    transform: translateX(calc(1px * var(--x))) translateY(calc(1px * var(--y)));
    transition: constants.$trn-fast-out;

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
