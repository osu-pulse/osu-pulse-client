<script lang="ts" setup>
import {
  breakpointsTailwind,
  useBreakpoints,
  useVModel,
  whenever,
} from '@vueuse/core'
import { usePlayer } from '@/player/stores/player'
import { useCurrentTrack } from '@/player/stores/current-track'
import { RepeatMode } from '@/player/constants/repeat-mode'
import ThePlayerSound from '@/player/components/ThePlayerSound.vue'
import ThePlayerControl from '@/player/components/ThePlayerControl.vue'
import ThePlayerTimeline from '@/player/components/ThePlayerTimeline.vue'
import ThePlayerSettings from '@/player/components/ThePlayerSettings.vue'
import ThePlayerInfo from '@/player/components/ThePlayerInfo.vue'

const props = defineProps<{
  maximized?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:maximized', value: boolean): void
}>()

const maximized = useVModel(props, 'maximized', emits)

const { playing, progress, ended } = usePlayer()
const { repeating, hasNext, next } = useCurrentTrack()
whenever(
  () => ended.value && playing.value,
  () => {
    if (repeating.value === RepeatMode.SINGLE)
      progress.value = 0
    else if (hasNext.value)
      next()
    else playing.value = false
  },
)

const { greater } = useBreakpoints(breakpointsTailwind)
const greaterLg = greater('lg')
const greaterSm = greater('sm')
whenever(greaterSm, () => maximized.value = false)

function handleMaximize() {
  if (!greaterSm.value)
    maximized.value = !maximized.value
}
</script>

<template>
  <div class="player-component" :class="{ _minimized: !maximized }">
    <ThePlayerInfo
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
</template>

<style lang="scss" scoped>
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.player-component {
  min-width: max-content;
  display: flex;
  height: 100px;
  overflow: hidden;
  border-radius: 10px;
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
      margin: 10px auto;
    }

    .main {
      position: absolute;
      width: calc(100% - 20px);
      display: flex;
      justify-content: space-between;
    }
  }
}

@media (max-width: constants.$bpt-lg) and (min-width: constants.$bpt-sm) {
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

@media (max-width: constants.$bpt-sm) {
  .player-component {
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
      height: 240px;
      flex-direction: column;

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
</style>
