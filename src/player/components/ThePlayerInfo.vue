<script lang="ts" setup>
import { computed, ref, shallowRef, watch } from 'vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { usePlayer } from '@/player/stores/player'

const props = defineProps<{
  center?: boolean
}>()

const { track } = usePlayer()

const { greater } = useBreakpoints(breakpointsTailwind)
const greaterLg = greater('lg')
const coverSrc = computed(() =>
  greaterLg.value ? track.value?.cover?.normal : track.value?.cover?.wide,
)

const coverLoaded = ref(false)
watch(coverSrc, () => (coverLoaded.value = false))
const coverRef = shallowRef<HTMLImageElement>()

function handleLoad(event: Event) {
  const target = event.target as HTMLImageElement
  if (target.src === coverRef.value?.src)
    coverLoaded.value = true
}
</script>

<template>
  <div class="player-info-component" :class="{ _center: props.center }">
    <div class="cover">
      <Transition mode="out-in">
        <img
          v-if="coverSrc"
          v-show="coverLoaded"
          ref="coverRef"
          :key="coverSrc"
          class="image"
          crossorigin="anonymous"
          :src="coverSrc"
          alt="cover"
          @load="handleLoad"
        >
      </Transition>
    </div>

    <div class="meta">
      <Transition mode="out-in">
        <span :key="track?.title" class="title">{{
          track?.title
        }}</span>
      </Transition>

      <Transition mode="out-in">
        <span :key="track?.artist" class="artist">{{
          track?.artist
        }}</span>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.player-info-component {
  position: relative;
  width: 450px;
  display: flex;
  transition: constants.$trn-normal-out;
  transition-property: width;

  .cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 80%;
    height: 100%;
    overflow: hidden;

    .image {
      @include mixins.size(fill);
      @include transitions.fade();
      z-index: 0;
      position: relative;
      object-fit: cover;
      object-position: center;
      pointer-events: none;

      &.v-enter-from {
        transform: scale(1.1);
      }
    }

    &::after {
      @include mixins.pseudo();
      z-index: 1;
      left: 0;
      background: linear-gradient(
          to right,
          transparent 0%,
          rgba(constants.$clr-background, 0.8) 60%,
          rgb(constants.$clr-background) 100%
      );
    }
  }

  .meta {
    z-index: 1;
    position: relative;
    flex: auto;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    gap: 10px;
    text-shadow: 0 0 5px rgba(constants.$clr-background, 0.3);

    .title,
    .artist {
      max-width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      user-select: text;
      -webkit-user-select: text;
    }

    .title {
      @include transitions.fade();
      font-size: 18px;
      font-weight: bold;

      &.v-enter-from {
        transform: translateY(-20px);
      }
    }

    .artist {
      @include transitions.fade();
      font-weight: lighter;

      &.v-enter-active {
        transition: constants.$trn-slow-out;
        transition-delay: 0.2s;
      }
    }
  }

  &._center {
    width: unset;

    .cover {
      width: 100%;

      &::after {
        left: 0;
        background: linear-gradient(
            to right,
            transparent 0%,
            rgba(constants.$clr-background, 0.8) 30%,
            rgba(constants.$clr-background, 0.8) 70%,
            transparent 100%
        );
      }

      &::before {
        @include mixins.pseudo();
        z-index: 1;
        background: linear-gradient(to top, rgb(constants.$clr-background) 0%, transparent 50%);
      }
    }

    .meta {
      margin: 0 auto;
      padding: 0;
      flex: none;
      width: 350px;
      height: 100%;
      justify-content: center;
      align-items: center;
    }
  }
}

@media (max-width: constants.$bpt-2xl) and (min-width: constants.$bpt-lg) {
  .player-info-component {
    width: 260px;

    .cover {
      width: 70%;

      &::after {
        background: linear-gradient(
            to right,
            transparent 0%,
            rgba(constants.$clr-background, 0.8) 50%,
            rgb(constants.$clr-background) 100%
        );
      }
    }
  }
}

@media (max-width: constants.$bpt-sm) {
  .player-info-component {
    &:not(._center) {
      .meta {
        width: 180px;
        gap: 3px;

        .title {
          font-size: 16px;
        }

        .artist {
          font-size: 14px;
        }
      }

      .cover {
        width: 60%;

        &::after {
          background: linear-gradient(
              to right,
              rgba(constants.$clr-background, 0.2) 0%,
              rgba(constants.$clr-background, 0.6) 40%,
              rgb(constants.$clr-background) 100%
          );
        }
      }
    }

    &._center {
      .meta {
        width: 300px;
      }

      .cover {
        &::after {
          left: 0;
          background: linear-gradient(
              to right,
              rgba(constants.$clr-background, 0.2) 0%,
              rgba(constants.$clr-background, 0.8) 20%,
              rgba(constants.$clr-background, 0.8) 80%,
              rgba(constants.$clr-background, 0.2) 100%
          );
        }
      }
    }
  }
}
</style>
