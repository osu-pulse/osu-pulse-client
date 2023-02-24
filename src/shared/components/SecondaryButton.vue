<script lang="ts" setup>
import BIcon from '@/shared/components/BIcon.vue'

const props = defineProps<{
  icon: string
  active?: boolean
}>()
</script>

<template>
  <button class="secondary-button-component" :class="{ _active: props.active }">
    <Transition mode="out-in">
      <BIcon :key="props.icon" :name="props.icon" class="icon" />
    </Transition>
  </button>
</template>

<style lang="scss" scoped>
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.secondary-button-component {
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

  &._active {
    background: rgb(constants.$clr-primary);

    .icon {
      color: rgb(constants.$clr-background);
    }
  }
}
</style>
