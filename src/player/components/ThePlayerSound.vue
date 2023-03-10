<script lang="ts" setup>
import { computed, ref } from 'vue'
import SliderRange from '@/player/components/SliderRange.vue'
import { usePlayer } from '@/player/stores/player'
import SecondaryButton from '@/shared/components/SecondaryButton.vue'
import { usePlayerFeedback } from '@/player/hooks/player-feedback'

const { muted, volume } = usePlayer()

const volumeIcon = computed(() => (muted.value ? 'volume-mute' : 'volume-up'))

const { changeVolume, boundVolume, mute, unmute } = usePlayerFeedback()

const prevValue = ref(volume.value)
const step = 0.1
function handleChange(value: number) {
  if (value === 0 || value === 1) {
    prevValue.value = value
    boundVolume()
  }
  else if (Math.abs(value - prevValue.value) >= step) {
    prevValue.value = Math.round(value / step) * step
    changeVolume()
  }
}

function handleChangeMuted() {
  muted.value = !muted.value
  muted.value ? mute() : unmute()
}
</script>

<template>
  <div class="player-sound-component">
    <SecondaryButton class="button" :icon="volumeIcon" @click="handleChangeMuted" />

    <SliderRange
      v-model:value="volume"
      :class="{ _collapsed: muted }" class="range"
      @change="handleChange"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.player-sound-component {
  width: 100px;
  display: flex;
  align-items: center;
  gap: 10px;

  .button {
    flex: none;
  }

  .range {
    width: 100%;
    transition: constants.$trn-normal-out;

    &._collapsed {
      width: 0;
      opacity: 0;
      pointer-events: none;
    }
  }
}
</style>
