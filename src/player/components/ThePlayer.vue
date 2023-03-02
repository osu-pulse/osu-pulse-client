<script lang="ts" setup>
import {
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
import { usePlayerFeedback } from '@/player/hooks/player-feedback'

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
  lengthX,
  lengthY,
  isSwiping,
} = useSwipe(mobilePlayerInfoRef, { threshold: 0 })

const maximizeReady = computed(() => Math.abs(lengthY.value) > 40)
const changeTrackReady = computed(() => Math.abs(lengthX.value) > 30)
const changeTrackAvailable = computed(() => (lengthX.value > 0 && hasNext.value) || (lengthX.value < 0 && hasPrev.value))

const { swipeStart, swipeEnd } = usePlayerFeedback()
whenever(changeTrackReady, () => changeTrackAvailable.value && swipeStart())

whenever(() => !isSwiping.value, () => {
  if (maximizeReady.value) {
    maximized.value = lengthY.value > 0
  }
  else if (changeTrackReady.value && changeTrackAvailable.value) {
    lengthX.value > 0 ? next() : prev()
    swipeEnd()
  }
})

const offsetBound = 50
const playerOffset = computed(() =>
  (!greaterSm.value && isSwiping.value && changeTrackAvailable.value)
    ? Math.max(-offsetBound, Math.min(offsetBound, -lengthX.value))
    : 0,
)
</script>

<template>
  <Transition mode="out-in">
    <div
      :key="greaterSm || maximized"
      class="player-component"
      :class="!greaterSm && { _minimized: !maximized, _swiping: isSwiping }"
      :style="!greaterSm && { '--offset': `${playerOffset}px` }"
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
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.player-component {
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
    touch-action: none;
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

@media (max-width: constants.$bpt-lg) and (min-width: constants.$bpt-md) {
  .player-component {
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

@media (max-width: constants.$bpt-md) {
  .player-component {
    height: 240px;
    flex-direction: column;

    .info {
      margin-right: 0;
      flex: 1 0;
    }

    .player {
      flex: none;
      padding: 10px 20px;
      height: 130px;

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
    }
  }
}

@media (max-width: constants.$bpt-sm) {
  .player-component {
    @include transitions.fade($transition: constants.$trn-fast-out);
    --offset: 0px;
    transform: translateX(var(--offset));
    transition: constants.$trn-normal-out;

    &._swiping {
      transition: none;
    }

    &._minimized {
      height: 60px;
      flex-direction: row;

      .info {
        margin-right: 5px;
        width: unset;
      }

      .player {
        height: unset;

        .control {
          padding: 0;
          margin: auto 0;
        }
      }
    }
  }
}
</style>
