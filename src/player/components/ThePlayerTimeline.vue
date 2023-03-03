<script lang="ts" setup>
import { computed, customRef, ref, watch } from 'vue'
import SliderRange from '@/player/components/SliderRange.vue'
import { usePlayer } from '@/player/stores/player'
import { usePlayerFeedback } from '@/player/hooks/player-feedback'
import type { TimeSplit } from '@/shared/types/time-split'

const { track, playing, progress, duration, buffer } = usePlayer()

const progressSplit = computed<TimeSplit>(() => ({
  h: Math.floor(progress.value / 60).toString(),
  m: `0${Math.floor(progress.value % 60)}`.slice(-2),
}))
const durationSplit = computed<TimeSplit>(() => ({
  h: Math.floor(duration.value / 60).toString(),
  m: `0${Math.floor(duration.value % 60)}`.slice(-2),
}))

const bufferScaled = computed(() => (duration.value > 0 ? buffer.value / duration.value : 0))
const progressScaled = customRef(() => ({
  get: () => (duration.value > 0 ? progress.value / duration.value : 0),
  set: value => (progress.value = duration.value * value),
}))

const progressChanging = ref(false)
const wasPlaying = ref(false)

function handleProgressChangeStart() {
  wasPlaying.value = playing.value
  playing.value = false
  progressChanging.value = true
}

function handleProgressChangeEnd() {
  playing.value = wasPlaying.value
  wasPlaying.value = false
  progressChanging.value = false
}

const { changeProgress, boundProgress } = usePlayerFeedback()
const prevProgress = ref(progress.value)
const step = 10
watch(progress, (progress) => {
  if (progress === 0 || progress === duration.value) {
    prevProgress.value = progress
    boundProgress()
  }
  else if (Math.abs(progress - prevProgress.value) >= step) {
    prevProgress.value = Math.round(progress / step) * step
    changeProgress()
  }
})
</script>

<template>
  <div class="player-timeline-component">
    <div class="time-panel">
      <Transition mode="out-in">
        <div :key="track?.id" class="time left">
          {{ progressSplit.h }}:{{ progressSplit.m }}
        </div>
      </Transition>

      <Transition mode="out-in">
        <div :key="duration === 0" class="time right">
          {{ durationSplit.h }}:{{ durationSplit.m }}
        </div>
      </Transition>
    </div>

    <SliderRange
      v-model:value="progressScaled"
      :buffer="bufferScaled"
      class="range"
      wide
      @change-start="handleProgressChangeStart"
      @change-end="handleProgressChangeEnd"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.player-timeline-component {
  position: relative;
  display: flex;
  height: 20px;

  .time-panel {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none;
  }

  .time {
    @include transitions.fade();
    width: 40px;
    font-size: 15px;

    &.left {
      text-align: left;
    }

    &.right {
      text-align: right;
    }
  }

  .range {
    margin: auto 40px;
    flex: auto;
  }
}

@media (max-width: constants.$bpt-sm) {
  .player-timeline-component {
    .time-panel {
      bottom: 20px;
    }

    .range {
      margin: auto 0;
    }
  }
}
</style>
