<script lang="ts" setup>
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'
import BIcon from '@/shared/components/BIcon.vue'
import { useColors } from '@/themes/stores/colors'

const props = defineProps<{
  icon: string
  progress?: number
  active?: boolean
  loading?: boolean
}>()

const { primary } = useColors()
</script>

<template>
  <button
    class="secondary-button-component"
    :class="{
      _active: props.active,
      _progress: props.progress !== undefined,
    }"
    :style="{ ...(props.progress !== undefined && { '--progress': props.progress }) }"
  >
    <Transition mode="out-in">
      <MoonLoader v-if="props.loading" class="spinner" size="18px" :color="`rgb(${primary})`" />

      <BIcon v-else :key="props.icon" :name="props.icon" class="icon" />
    </Transition>
  </button>
</template>

<style lang="scss" scoped>
@use '../styles/mixins';
@use '../styles/constants';
@use '../styles/transitions';

.secondary-button-component {
  position: relative;
  padding: 2px 3px;
  border-radius: 7px;
  overflow: hidden;
  transition: constants.$trn-normal-out;
  cursor: pointer;

  &::before {
    @include mixins.pseudo();
    top: -2px;
    left: -3px;
    width: 0;
    height: calc(100% + 4px);
    background: constants.$clr-success;
    opacity: 0;
    transition: constants.$trn-normal-out;
  }

  .icon {
    @include transitions.fade();
    z-index: 2;
    position: relative;
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

  &._active {
    background: rgb(constants.$clr-primary);

    .icon {
      color: rgb(constants.$clr-background);
    }
  }

  &._progress {
    --progress: 0;

    &::before {
      width: calc(var(--progress) * 100% + var(--progress) * 6px);
      opacity: 0.5;
    }
  }
}
</style>
