<script lang="ts" setup>
import { computed } from 'vue'
import SecondaryButton from '@/shared/components/SecondaryButton.vue'
import { RepeatMode } from '@/player/constants/repeat-mode'
import { useCurrentTrack } from '@/player/stores/current-track'

const { repeating, shuffling, toggleRepeating, toggleShuffling } = useCurrentTrack()

const repeatBtnIcon = computed(() =>
  repeating.value === RepeatMode.SINGLE ? 'repeat-1' : 'repeat',
)
</script>

<template>
  <div class="player-settings-component">
    <SecondaryButton :icon="repeatBtnIcon" :active="Boolean(repeating)" @click="toggleRepeating" />
    <SecondaryButton icon="shuffle" :active="shuffling" @click="toggleShuffling" />
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
