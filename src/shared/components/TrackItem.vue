<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  breakpointsTailwind,
  useBreakpoints, useShare,
} from '@vueuse/core'
import type { Track } from '@/shared/dto/track'
import type { TimeSplit } from '@/shared/types/time-split'
import { usePlayer } from '@/player/stores/player'
import SecondaryButton from '@/shared/components/SecondaryButton.vue'
import IconButton from '@/shared/components/IconButton.vue'
import { download } from '@/player/utils/file'

const props = defineProps<{
  order: number
  track: Track
}>()

const hovered = ref(false)

const { track, playing } = usePlayer()
const active = computed(() => props.track.id === track.value?.id)

const duration = computed<TimeSplit>(() => ({
  h: Math.floor(props.track.duration / 60).toString(),
  m: `0${Math.floor(props.track.duration % 60)}`.slice(-2),
}))

const playBtnIcon = computed(() => (active.value && playing.value) ? 'pause-fill' : 'play-fill')

function handlePlay() {
  if (active.value) {
    playing.value = !playing.value
  }
  else {
    track.value = props.track
    playing.value = true
  }
}

async function handleDownload() {
  const name = `${props.track.artist} - ${props.track.title}`
  await download(props.track.url.file, name)
}

const { share } = useShare(() => ({
  title: 'Share track',
  text: `${props.track.artist} - ${props.track.title}`,
  url: `${location.origin}?trackId=${props.track.id}`,
}))

const { greater } = useBreakpoints(breakpointsTailwind)
const greaterLg = greater('lg')
</script>

<template>
  <div
    class="library-track-component" :class="{ _active: active }"
    @mouseenter="hovered = true" @mouseleave="hovered = false"
  >
    <div v-if="greaterLg" class="left-container">
      <Transition mode="out-in">
        <IconButton
          v-if="hovered" class="play-btn" :icon="playBtnIcon"
          @click="handlePlay"
        />
        <span v-else class="order">{{ props.order }}</span>
      </Transition>
    </div>

    <div class="info">
      <div class="cover-container">
        <img
          ref="coverRef" alt="cover" class="cover"
          :src="props.track.cover.small"
        >

        <Transition>
          <div v-if="!greaterLg" v-show="hovered" class="overlay">
            <IconButton
              class="play-btn" :icon="playBtnIcon"
              @click="handlePlay"
            />
          </div>
        </Transition>
      </div>

      <div class="track">
        <span class="title">{{ props.track.title }}</span>
        <span class="artist">{{ props.track.artist }}</span>
      </div>
    </div>

    <Transition mode="out-in">
      <div v-if="hovered" class="controls">
        <div v-if="greaterLg" class="main">
          <SecondaryButton icon="plus-lg" />
          <SecondaryButton icon="download" @click="handleDownload" />
          <SecondaryButton icon="share" @click="share" />
        </div>

        <SecondaryButton icon="three-dots-vertical" />
      </div>

      <div v-else class="time">
        {{ duration.h }}:{{ duration.m }}
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '../styles/mixins';
@use '../styles/constants';
@use '../styles/transitions';

.library-track-component {
  padding-right: 15px;
  display: flex;
  align-items: center;
  overflow: hidden;
  transition: constants.$trn-normal-out;
  border-radius: constants.$cmn-border-radius;

  .left-container {
    width: 60px;
    display: flex;

    .play-btn, .order {
      @include transitions.fade();
      margin: auto;
    }

    .play-btn {
      ::v-deep(.icon) {
        font-size: 34px;
      }
    }
  }

  .info {
    display: flex;
    align-items: center;

    .cover-container {
      @include mixins.size(55px);
      margin-right: 40px;
      overflow: hidden;
      border-radius: constants.$cmn-border-radius;
      transition: constants.$trn-normal-out;

      .cover {
        @include mixins.size(fill);
        object-fit: cover;
        object-position: center;
        pointer-events: none;
      }
    }

    .track {
      flex: auto;
      display: flex;
      align-items: center;
      gap: 10px;

      .title,
      .artist {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        user-select: text;
      }

      .title {
        width: 280px;
        font-size: 18px;
        font-weight: bold;
      }

      .artist {

        width: 180px;
        overflow: hidden;
      }
    }
  }

  .controls, .time {
    @include transitions.fade();
    margin-left: auto;
  }

  .controls {
    display: flex;
    gap: 20px;

    .main {
      display: flex;
      gap: 10px;
    }
  }

  &._active {
    .left-container {
      .play-btn {
        ::v-deep(.icon) {
          color: rgb(constants.$clr-accent);
        }
      }
    }
  }

  @media (hover: hover) {
    &:hover {
      background-color: rgb(constants.$clr-background);
      transform: scale(1.02);
      box-shadow: constants.$cmn-shadow-block;
      transition: constants.$trn-fast-out;

      .info {
        .cover-container {
          border-radius: 0;
          transition: constants.$trn-fast-out;
        }
      }
    }
  }
}

@media (max-width: constants.$bpt-2xl) {
  .library-track-component {
    .info {
      .cover-container {
        margin-right: 15px;
      }

      .track {
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-around;
        gap: 5px;

        .title, .artist {
          width: 200px;
        }
      }
    }
  }
}

@media (max-width: constants.$bpt-lg) {
  .library-track-component {
    .info {
      .cover-container {
        position: relative;

        .cover {
          transition: constants.$trn-normal-out
        }

        .overlay {
          @include transitions.fade();
          @include mixins.size(fill);
          top: 0;
          left: 0;
          position: absolute;
          display: flex;
          background: rgba(constants.$clr-background, 0.7);

          .play-btn {
            margin: auto;
          }
        }
      }
    }

    &._active {
      .cover-container {
        .overlay {
          .play-btn {
            ::v-deep(.icon) {
              color: rgb(constants.$clr-accent);
              filter: drop-shadow(0 0 4px rgba(constants.$clr-background, 0.8));
            }
          }
        }
      }
    }

    @media (hover: hover) {
      &:hover {
        .info {
          .cover-container {
            .cover {
              filter: blur(5px);
              transition: constants.$trn-fast-out
            }
          }
        }
      }
    }
  }
}
</style>
