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
    .from(new Array(props.length).keys(),
      (i) => {
        const v = bins.value[Math.floor(from + i * step)] ?? 0
        return Math.min(1, v * (1 + (i / (props.length - 1)) * 0.6 - 0.2))
      },
    )
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
@use '../styles/mixins';
@use '../styles/constants';
@use '../styles/transitions';

.audio-visualizer-component {
  display: flex;
  justify-content: space-between;

  .bar {
    --value: 0;
    width: 2px;
    background: rgb(constants.$clr-accent);
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
