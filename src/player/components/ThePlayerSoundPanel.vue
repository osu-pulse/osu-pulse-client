<script lang="ts" setup>
import { computed, customRef } from 'vue'
import SliderRange from '@/player/components/SliderRange.vue'
import { usePlayer } from '@/player/stores/player'
import BIcon from '@/shared/components/BIcon.vue'

const { muted, volume } = usePlayer()

const volumeIcon = computed(() => (muted.value ? 'volume-mute' : 'volume-up'))

const volumeScaled = customRef(() => ({
  get: () => volume.value ** 0.5,
  set: value => (volume.value = value ** 2),
}))
</script>

<template>
  <div class="player-sound-panel-component">
    <button class="button" @click="muted = !muted">
      <Transition mode="out-in">
        <BIcon :key="volumeIcon" :name="volumeIcon" class="icon" />
      </Transition>
    </button>

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

.player-sound-panel-component {
  width: 100px;
  display: flex;
  align-items: center;
  gap: 10px;

  .button {
    padding: 2px 3px;
    border-radius: 7px;
    transition: constants.$trn-normal-out;
    cursor: pointer;

    .icon {
      @include transitions.fade();
      color: rgb(constants.$clr-text-inactive);
      font-size: 20px;
      transform: translateY(2px);
      transition: constants.$trn-normal-out;
    }

    @mixin hovered {
      background: rgb(constants.$clr-secondary);
      box-shadow: constants.$cmn-shadow-element;
      transform: scale(1.1);
      transition: constants.$trn-fast-out;

      .icon {
        color: rgb(constants.$clr-primary);
        transition: constants.$trn-fast-out;
      }
    }

    @media (hover: hover) {
      &:hover {
        @include hovered;
      }

      &:active {
        transform: scale(1);
        box-shadow: none;
      }
    }

    @media (hover: none) {
      &:active {
        @include hovered;
      }
    }
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
