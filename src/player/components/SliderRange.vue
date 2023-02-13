<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    value: number;
    buffer?: number;
    wide?: boolean;
  }>(),
  {
    wide: false,
  },
);

const emits = defineEmits<{
  (e: 'update:value', value: number): void;
  (e: 'changeStart'): void;
  (e: 'changeEnd'): void;
}>();

const value = useVModel(props, 'value', emits);

const changing = ref(false);
watch(changing, (value) => (value ? emits('changeStart') : emits('changeEnd')));
const { pressed } = useMousePressed();
whenever(
  () => !pressed.value,
  () => (changing.value = false),
);

const trackRef = shallowRef<HTMLDivElement>();
const { x } = useMouse();
function change() {
  if (trackRef.value) {
    const { left, right } = trackRef.value.getBoundingClientRect();
    const newValue = (x.value - left) / (right - left);
    value.value = Math.max(0, Math.min(1, newValue));
  }
}
watch(x, () => {
  if (changing.value) {
    change();
  }
});
whenever(changing, change);
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
      @mousedown.prevent="changing = true"
    />

    <div
      class="thumb"
      :class="{ _wide: props.wide }"
      :style="{ '--offset': `${value * 100}%` }"
      @mousedown.prevent="changing = true"
    />
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:math';
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.range-component {
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
    background: constants.$clr-inactive;
    border-radius: 10px;
    transform: scaleY(0.5);
    transition: constants.$trn-normal-out;
    cursor: pointer;

    &::before,
    &::after {
      @include mixins.pseudo();
      background: constants.$clr-primary;
      transition: constants.$trn-normal-out;
    }

    &::before {
      width: var(--buffer);
      opacity: 0.3;
    }

    &::after {
      width: var(--value);
    }
  }

  .thumb {
    $size: 7px;
    @include mixins.size($size * 2);
    --offset: 0%;
    position: absolute;
    display: flex;
    left: calc(var(--offset) - #{$size});
    background: constants.$clr-primary;
    border-radius: $size;
    transform: scale(0);
    transition: constants.$trn-normal-out;
    cursor: pointer;

    &._wide {
      width: $size * 3;
      left: calc(var(--offset) - #{$size * 1.5});
    }

    &::after {
      @include mixins.pseudo();
      background: constants.$clr-background;
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

  &:hover,
  &._changing {
    .track {
      transform: scaleY(1);
    }

    .thumb {
      transform: scale(1);
    }
  }

  &._changing {
    .track,
    .track::after,
    .thumb {
      transition: none;
    }

    .thumb::after {
      transform: scale(0.3);
      opacity: 1;
    }
  }
}
</style>
