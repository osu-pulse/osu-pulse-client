<script lang="ts" setup>
import { computed } from 'vue'
import SecondaryButton from '@/shared/components/SecondaryButton.vue'
import { RepeatMode } from '@/player/constants/repeat-mode'
import { useCurrentTrack } from '@/player/stores/current-track'

const { repeating, shuffling } = useCurrentTrack()

const repeatBtnIcon = computed(() =>
  repeating.value === RepeatMode.SINGLE ? 'repeat-1' : 'repeat',
)

function handleChangeRepeat() {
  if (!repeating.value)
    repeating.value = RepeatMode.LIST
  else if (repeating.value === RepeatMode.LIST)
    repeating.value = RepeatMode.SINGLE
  else if (repeating.value === RepeatMode.SINGLE)
    repeating.value = false
}
</script>

<template>
  <div class="player-settings-component">
    <SecondaryButton :icon="repeatBtnIcon" :active="Boolean(repeating)" @click="handleChangeRepeat" />
    <SecondaryButton icon="shuffle" :active="shuffling" @click="shuffling = !shuffling" />
    <SecondaryButton icon="three-dots-vertical" />
  </div>
</template>

<style lang="scss" scoped>
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.player-settings-component {
  display: flex;
  gap: 10px;
}
</style>
