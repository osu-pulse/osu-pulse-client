<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  breakpointsTailwind,
  useBreakpoints, useMediaQuery, useShare,
} from '@vueuse/core'
import type { Track } from '@/shared/dto/track'
import type { TimeSplit } from '@/shared/types/time-split'
import { usePlayer } from '@/player/stores/player'
import SecondaryButton from '@/shared/components/SecondaryButton.vue'
import IconButton from '@/shared/components/IconButton.vue'
import { useDownload } from '@/shared/hooks/download'
import { useMyTracks } from '@/library/stores/my-tracks'

const props = defineProps<{
  order: number
  track: Track
  inset?: boolean
}>()

const hoverable = useMediaQuery('(hover: hover)')
const hovered = ref(false)

const { track, playing } = usePlayer()
const active = computed(() => props.track.id === track.value?.id)

const duration = computed<TimeSplit>(() => ({
  h: Math.floor(props.track.duration / 60).toString(),
  m: `0${Math.floor(props.track.duration % 60)}`.slice(-2),
}))

const playBtnIcon = computed(() => (active.value && playing.value) ? 'pause-fill' : 'play-fill')

function handleClickPlay() {
  if (active.value) {
    playing.value = !playing.value
  }
  else {
    track.value = props.track
    playing.value = true
  }
}

function handleClick() {
  if (!hoverable.value)
    handleClickPlay()
}

const { has, add, remove } = useMyTracks()
async function handleToggleLibrary() {
  if (has(props.track.id))
    await remove(props.track.id)
  else
    await add(props.track)
}

const { start, progress } = useDownload(props.track.url.file, `${props.track.artist} - ${props.track.title}`)

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
    class="library-track-component"
    :class="{ _active: active, _inset: props.inset }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    @click="handleClick"
  >
    <div v-if="greaterLg" class="left-container">
      <Transition mode="out-in">
        <IconButton
          v-if="hoverable && hovered" class="play-btn" :icon="playBtnIcon"
          @click="handleClickPlay"
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
          <div v-if="!greaterLg" v-show="hoverable && hovered" class="overlay">
            <IconButton class="play-btn" :icon="playBtnIcon" @click="handleClickPlay" />
          </div>
        </Transition>
      </div>

      <div class="track">
        <span class="title">{{ props.track.title }}</span>
        <span class="artist">{{ props.track.artist }}</span>
      </div>
    </div>

    <Transition mode="out-in">
      <div v-if="hoverable && hovered" class="controls">
        <div v-if="greaterLg" class="main">
          <SecondaryButton :icon="has(props.track.id) ? 'trash' : 'plus-lg'" @click="handleToggleLibrary" />
          <SecondaryButton icon="download" :progress="progress" @click="start" />
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
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

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
      flex: 1;
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

  .time {
    &.v-leave-active {
      transition: none;
    }
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

  &._inset {
    border-radius: 0;

    .left-container {
      .play-btn {
        ::v-deep(.icon) {
          font-size: 28px;
        }
      }
    }

    .info {
      .cover-container {
        @include mixins.size(40px);
        border-radius: 50%;
      }

      .track {
        .title {
          font-size: 16px;
        }

        .artist {
          font-size: 14px;
        }
      }
    }
  }

  @media (hover: hover) {
    &:not(._inset):hover {
      background-color: rgb(constants.$clr-background);
      box-shadow: constants.$cmn-shadow-block;
      transition: constants.$trn-fast-out;

      .info {
        .cover-container {
          transition: constants.$trn-fast-out;
        }
      }

      &:not(._inset) {
        .info {
          .cover-container {
            border-radius: 0;
          }
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

    &._inset {
      .info {
        .track {
          gap: 3px;
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

    &._inset {
      .cover-container {
        .overlay {
          .play-btn {
            ::v-deep(.icon) {
              font-size: 26px;
            }
          }
        }
      ;
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
