<script lang="ts" setup>
import { computed } from 'vue'
import { useVisualization } from '@/shared/stores/visualization'

const props = withDefaults(defineProps<{
  bounds?: [number, number]
  length?: number
  vertical?: boolean
}>(), {
  bounds: [0.1, 0.7] as any,
  length: 5,
  vertical: false,
})

const { bins } = useVisualization()

const bars = computed(() => {
  const [from, to] = props.bounds!.map(bound => bound * bins.value.length)
  const step = (to - from) / (props.length - 1)
  return Array
    .from({ length: props.length })
    .map((value, index) => bins.value[Math.floor(from + index * step)] ?? 0)
    .map((value, index, array) => {
      const x = index / (array.length - 1)
      return Math.min(1, value * (1 + x * 0.6 - 0.2))
    })
})
</script>

<template>
  <div ref="rootRef" class="audio-visualizer-component" :class="{ _vertical: vertical }">
    <div
      v-for="(value, index) in bars" :key="index" class="bar"
      :style="{ '--value': value }"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.audio-visualizer-component {
  display: flex;
  justify-content: space-between;

  .bar {
    --value: 0;
    width: 2px;
    background: rgb(constants.$clr-accent);
    border-radius: 3px 3px 0 0;
    transform: scaleY(var(--value));
    transform-origin: bottom;
    transition: 0.04s;
  }

  &._vertical {
    flex-direction: column;

    .bar {
      width: unset;
      height: 2px;
      transform: scaleX(var(--value));
      transform-origin: left;
    }
  }
}
</style>
