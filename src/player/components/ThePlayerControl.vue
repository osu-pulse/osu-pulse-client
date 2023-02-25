<script lang="ts" setup>
import { computed } from 'vue'
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'
import { usePlayer } from '@/player/stores/player'
import BIcon from '@/shared/components/BIcon.vue'
import { useCurrentTrack } from '@/player/stores/current-track'

const { track, playing, caching } = usePlayer()

const { hasPrev, hasNext, prev, next } = useCurrentTrack()

const playBtnIcon = computed(() => (playing.value ? 'pause-fill' : 'play-fill'))
</script>

<template>
  <div class="player-control-panel">
    <button
      class="button backward" :class="{ _disabled: !hasPrev }"
      @click="prev"
    >
      <BIcon name="skip-start-fill" class="icon" />
    </button>

    <button
      class="button play"
      :class="{ _disabled: !track }"
      @click="playing = !playing"
    >
      <Transition mode="out-in">
        <MoonLoader
          v-if="caching" size="30px" color="white"
          class="icon"
        />
        <BIcon v-else :key="playBtnIcon" :name="playBtnIcon" class="icon" />
      </Transition>
    </button>

    <button
      class="button forward" :class="{ _disabled: !hasNext }"
      @click="next"
    >
      <BIcon name="skip-end-fill" class="icon" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.player-control-panel {
  display: flex;
  align-items: center;
  gap: 10px;

  .button {
    cursor: pointer;
    transition: constants.$trn-normal-out;

    &._disabled {
      pointer-events: none;
      opacity: 0;
    }

    &.backward,
    &.forward {
      @mixin hovered {
        transform: scale(1.1);
        transition: constants.$trn-fast-out;
      }

      @media (hover: hover) {
        &:hover {
          @include hovered;
        }
      }

      .icon {
        color: rgb(constants.$clr-accent);
        font-size: 30px;
        transition: constants.$trn-fast-out;
      }
    }

    &.backward:active {
      .icon {
        transform: translateX(-5px);
      }
    }

    &.forward:active {
      .icon {
        transform: translateX(5px);
      }
    }

    &.play {
      @include mixins.size(40px);
      display: flex;
      background: rgb(constants.$clr-accent);
      border-radius: 100%;

      @mixin hovered {
        transform: scale(1.07);
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

      .icon {
        @include transitions.fade(constants.$trn-fast-out);
        margin: auto;
        font-size: 26px;
        color: rgb(constants.$clr-background);
      }
    }
  }
}
</style>