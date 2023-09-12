<script lang="ts" setup>
import { computed, customRef, ref } from 'vue'
import { audioTime } from '@/shared/utils/audio-tools'
import SliderRange from '@/player/components/SliderRange.vue'
import { usePlayer } from '@/player/stores/player'
import { usePlayerFeedback } from '@/player/hooks/player-feedback'

const { track, playing, progress, duration, buffer } = usePlayer()

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
const prevValue = ref(progress.value)
const step = 10
function handleChange(value: number) {
  const newProgress = value * duration.value
  if (newProgress === 0 || newProgress === duration.value) {
    prevValue.value = newProgress
    boundProgress()
  }
  else if (Math.abs(newProgress - prevValue.value) >= step) {
    prevValue.value = Math.round(newProgress / step) * step
    changeProgress()
  }
}
</script>

<template>
  <div class="player-timeline-component">
    <div class="time-panel">
      <Transition mode="out-in">
        <div :key="track?.id" class="time left">
          {{ audioTime(progress) }}
        </div>
      </Transition>

      <Transition mode="out-in">
        <div :key="duration === 0" class="time right">
          {{ audioTime(duration) }}
        </div>
      </Transition>
    </div>

    <SliderRange
      v-model:value="progressScaled"
      :buffer="bufferScaled"
      class="range"
      wide
      @change="handleChange"
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
    flex: 1;
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
