<script lang="ts" setup>
import { computed, customRef } from 'vue'
import SliderRange from '@/player/components/SliderRange.vue'
import { usePlayer } from '@/player/stores/player'
import SecondaryButton from '@/shared/components/SecondaryButton.vue'

const { muted, volume } = usePlayer()

const volumeIcon = computed(() => (muted.value ? 'volume-mute' : 'volume-up'))

const volumeScaled = customRef(() => ({
  get: () => volume.value ** 0.5,
  set: value => (volume.value = value ** 2),
}))
</script>

<template>
  <div class="player-sound-component">
    <SecondaryButton :icon="volumeIcon" @click="muted = !muted" />

    <SliderRange
      v-model:value="volumeScaled"
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
