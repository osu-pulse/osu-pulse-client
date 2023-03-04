<script lang="ts" setup>
import { ref, shallowRef, watch, watchEffect } from 'vue'
import {
  useMouseInElement,
  useMousePressed,
  useVModel,
  whenever,
} from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    value: number
    buffer?: number
    wide?: boolean
  }>(),
  {
    wide: false,
  },
)

const emits = defineEmits<{
  (e: 'update:value', value: number): void
  (e: 'changeStart', value: number): void
  (e: 'changeEnd', value: number): void
}>()

const value = useVModel(props, 'value', emits)

const changing = ref(false)
watch(changing, (changing) => {
  if (changing)
    emits('changeStart', value.value)
  else
    emits('changeEnd', value.value)
})
const { pressed } = useMousePressed()
whenever(
  () => !pressed.value,
  () => (changing.value = false),
)

const trackRef = shallowRef<HTMLDivElement>()
const { elementX, elementWidth } = useMouseInElement(trackRef)
watchEffect(() => {
  const rel = elementX.value / elementWidth.value
  if (changing.value)
    value.value = Math.max(0, Math.min(1, rel))
})
</script>

<template>
  <div class="range-component" :class="{ _changing: changing }">
    <div
      ref="trackRef"
      class="track"
      :style="{
        '--value': `${value * 100}%`,
        '--buffer': `${props.buffer * 100}%`,
      }"
      @mousedown="changing = true"
      @touchstart="changing = true"
    />

    <div
      class="thumb"
      :class="{ _wide: props.wide }"
      :style="{ '--offset': `${value * 100}%` }"
      @mousedown="changing = true"
      @touchstart="changing = true"
    />
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:math';
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.range-component {
  touch-action: none;
  position: relative;
  display: flex;
  align-items: center;

  .track {
    @include mixins.size(fill);
    --value: 0%;
    --buffer: 0%;
    position: relative;
    height: 6px;
    overflow: hidden;
    background: rgb(constants.$clr-text-inactive);
    border-radius: 10px;
    transform: scaleY(0.5);
    transition: constants.$trn-normal-out;
    cursor: pointer;

    &::before,
    &::after {
      @include mixins.pseudo();
      background: rgb(constants.$clr-primary);
      transition: constants.$trn-normal-out;
    }

    &::before {
      width: var(--buffer);
      opacity: 0.2;
    }

    &::after {
      width: var(--value);
    }
  }

  .thumb {
    $size: 7px;
    @include mixins.size($size * 2);
    --offset-x: 0%;
    position: absolute;
    display: flex;
    left: calc(var(--offset-x) - #{$size});
    background: rgb(constants.$clr-primary);
    border-radius: $size;
    transform: scale(0);
    transition: constants.$trn-normal-out;
    cursor: pointer;

    &._wide {
      width: $size * 3;
      left: calc(var(--offset-x) - #{$size * 1.5});
    }

    &::after {
      @include mixins.pseudo();
      background: rgb(constants.$clr-background);
      border-radius: $size;
      transform: scale(0);
      opacity: 0;
      transition: constants.$trn-normal-out;
    }

    &:hover {
      &::after {
        transform: scale(0.6);
        opacity: 1;
      }
    }
  }

  @mixin hovered {
    .track {
      transform: scaleY(1);
    }

    .thumb {
      transform: scale(1);
    }
  }

  @media (hover: hover) {
    &:hover {
      @include hovered;
    }
  }

  &._changing {
    @include hovered;

    .track::after {
      transition: width 0s;
    }

    .thumb {
      transition: left 0s;
    }

    .thumb::after {
      transform: scale(0.3);
      opacity: 1;
    }
  }
}
</style>
