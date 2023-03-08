<script lang="ts" setup>
import BIcon from '@/shared/components/BIcon.vue'

const props = defineProps<{
  icon: string
}>()
</script>

<template>
  <button class="icon-button-component">
    <Transition mode="out-in">
      <BIcon :key="props.icon" :name="props.icon" class="icon" />
    </Transition>
  </button>
</template>

<style lang="scss" scoped>
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.icon-button-component {
  padding: 2px 3px;
  border-radius: 7px;
  transition: constants.$trn-normal-out;
  cursor: pointer;

  .icon {
    @include transitions.fade();
    color: rgb(constants.$clr-primary);
    font-size: 40px;
    transform: translateY(2px);
    transition: constants.$trn-normal-out;
  }

  @mixin hovered {
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
    }
  }

  @media (hover: none) {
    &:active {
      @include hovered;
    }
  }
}
</style>
