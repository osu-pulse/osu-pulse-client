<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'
import { RouterLink } from 'vue-router'
import BIcon from '@/shared/components/BIcon.vue'

const props = defineProps<{
  icon: string
  label?: string
  to?: RouteLocationRaw
  active?: boolean
}>()
</script>

<template>
  <Component
    :is="props.to ? RouterLink : 'button'"
    :to="props.to"
    class="secondary-panel-component"
    :class="{ _active: props.active }"
  >
    <BIcon :name="props.icon" class="icon" />
    <div v-if="props.label" class="label">
      {{ props.label }}
    </div>
  </Component>
</template>

<style lang="scss" scoped>
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.secondary-panel-component {
  padding: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 20px;
  border-radius: 10px;
  color: rgb(constants.$clr-text-inactive);
  transition: constants.$trn-normal-out;

  .icon,
  .label {
    transition: constants.$trn-normal-out;
  }

  .icon {
    font-size: 22px;
  }

  .label {
    font-size: 18px;
    font-weight: bold;
  }

  @mixin hovered {
      box-shadow: constants.$cmn-shadow-element;
      transform: scale(1.01);
      background: rgb(constants.$clr-secondary);
      transition: constants.$trn-fast-in;
      color: rgb(constants.$clr-text);

      .icon,
      .label {
        transition: constants.$trn-fast-in;
      }

      .icon {
        transform: scale(1.1);
      }
  }

  @media (hover: hover) {
    &:hover {
      @include hovered;
    }
  }

  @media (hover: none) {
    &:active {
      @include hovered;
    }
  }

  &._active {
    background-color: rgb(constants.$clr-primary);
    color: rgb(constants.$clr-background);

    .icon {
      transform: scale(1.1);
    }
  }
}
</style>
