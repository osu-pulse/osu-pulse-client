<script lang="ts" setup>
import { computed } from 'vue'
import { useVisualization } from '@/shared/stores/visualization'
import { usePlayer } from '@/player/stores/player'

const props = withDefaults(defineProps<{
  length?: number
  vertical?: boolean
  origin?: 'start' | 'center' | 'end'
  inverted?: boolean
  stoppable?: boolean
}>(), {
  length: 5,
  vertical: false,
  origin: 'end',
  inverted: false,
  stoppable: false,
})

const { bins } = useVisualization()
const bars = computed(() => {
  const [from, to] = [0.1, 0.7].map(bound => bound * bins.value.length)
  const step = (to - from) / (props.length - 1)
  return Array.from(
    { length: props.length },
    (_, i) => bins.value[Math.floor(from + i * step)],
  )
})

const { playing } = usePlayer()
</script>

<template>
  <div
    class="audio-visualizer-component"
    :class="[`_${props.origin}`, {
      _vertical: props.vertical,
      _inverted: props.inverted,
      _stopped: props.stoppable && !playing,
    }]"
  >
    <div
      v-for="(value, index) in bars"
      :key="index"
      class="bar"
      :style="{ '--value': value }"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '../styles/mixins';
@use '../styles/constants';
@use '../styles/transitions';

.audio-visualizer-component {
  position: relative;
  display: flex;
  justify-content: space-between;

  .bar {
    --value: 0;
    position: relative;

    &::before, &::after {
      @include mixins.pseudo();
      background: rgb(constants.$clr-accent);
    }

    &::before {
      transition: constants.$trn-normal-out;
    }

    &::after {
      transition: 0.04s;
    }
  }

  &:not(._vertical) {
    .bar {
      width: 2px;

      &::before {
        height: 2px;
      }

      &::after {
        transform: scaleY(calc(100% * var(--value)));
      }
    }

    &._stopped {
      .bar {
        &::before {
          height: 0;
        }
      }
    }

    &._end {
      .bar {
        &::before {
          bottom: 0;
        }

        &::after {
          transform-origin: bottom;
        }
      }
    }

    &._center {
      .bar {
        &::before {
          top: 50%;
          transform: translateY(-50%);
        }

        &::after {
          transform-origin: center;
        }
      }
    }

    &._start {
      .bar {
        &::before {
          top: 0
        }

        &::after {
          transform-origin: top;
        }
      }
    }

    &:not(._inverted) {
      flex-direction: row;
    }

    &._inverted {
      flex-direction: row-reverse;
    }
  }

  &._vertical {
    .bar {
      height: 2px;

      &::before {
        width: 2px;
      }

      &::after {
        transform: scaleX(calc(100% * var(--value)));
      }
    }

    &._stopped {
      .bar {
        &::before {
          width: 0;
        }
      }
    }

    &._end {
      .bar {
        &::before {
          right: 0;
        }

        &::after {
          transform-origin: right;
        }
      }
    }

    &._center {
      .bar {
        &::before {
          left: 50%;
          transform: translateX(-50%);
        }

        &::after {
          transform-origin: center;
        }
      }
    }

    &._start {
      .bar {
        &::before {
          left: 0
        }

        &::after {
          transform-origin: left;
        }
      }
    }

    &:not(._inverted) {
      flex-direction: column;
    }

    &._inverted {
      flex-direction: column-reverse;
    }
  }
}
</style>
