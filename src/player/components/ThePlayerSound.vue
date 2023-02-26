<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import SliderRange from '@/player/components/SliderRange.vue'
import { usePlayer } from '@/player/stores/player'
import SecondaryButton from '@/shared/components/SecondaryButton.vue'
import { usePlayerFeedback } from '@/player/hooks/player-feedback'

const { muted, volume } = usePlayer()

const volumeIcon = computed(() => (muted.value ? 'volume-mute' : 'volume-up'))

const { changeVolume, boundVolume, mute, unmute } = usePlayerFeedback()

const prevVolume = ref(volume.value)
const step = 0.1
watch(volume, (volume) => {
  if (volume === 0 || volume === 1) {
    prevVolume.value = volume
    boundVolume()
  }
  else if (Math.abs(volume - prevVolume.value) >= step) {
    prevVolume.value = Math.round(volume / step) * step
    changeVolume()
  }
})

function handleChangeMuted() {
  muted.value = !muted.value
  muted.value ? mute() : unmute()
}
</script>

<template>
  <div class="player-sound-component">
    <SecondaryButton :icon="volumeIcon" @click="handleChangeMuted" />

    <SliderRange
      v-model:value="volume"
      :class="{ _collapsed: muted }" class="range"
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
