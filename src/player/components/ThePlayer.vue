<script lang="ts" setup>
import Loader from '~/player/assets/loader.svg?component';
import { usePlayer } from '~/player/stores/player';
import SliderRange from '~/player/components/SliderRange.vue';
import { useQueue } from '~/shared/stores/queue';

const { track, playing, muted, volume, caching, progress, duration } =
  usePlayer();

const coverSrc = computed(() => track.value?.cover.normal);

const volumeIcon = computed(() =>
  muted.value ? BIconVolumeMute : BIconVolumeUp,
);

const playBtnIcon = computed(() =>
  playing.value ? BIconPauseFill : BIconPlayFill,
);

interface TimeSplit {
  h: string;
  m: string;
}

const progressSplit = computed<TimeSplit>(() => ({
  h: Math.floor(progress.value / 60).toString(),
  m: `0${Math.floor(progress.value % 60)}`.slice(-2),
}));

const durationSplit = computed<TimeSplit>(() =>
  Number.isNaN(duration.value)
    ? { h: '-', m: '-' }
    : {
        h: Math.floor(duration.value / 60).toString(),
        m: `0${Math.floor(duration.value % 60)}`.slice(-2),
      },
);

const progressScaled = customRef(() => ({
  get: () =>
    Number.isNaN(duration.value) ? 0 : progress.value / duration.value,
  set: (value) => (progress.value = duration.value * value),
}));

const { queue } = useQueue();

const hasPrev = computed(() => {
  const index = queue.value.findIndex(({ id }) => id === track.value?.id);
  return index > -1 && queue.value[index - 1];
});
const hasNext = computed(() => {
  const index = queue.value.findIndex(({ id }) => id === track.value?.id);
  return index > -1 && queue.value[index + 1];
});

function next() {
  const index = queue.value.findIndex(({ id }) => id === track.value?.id);
  if (index > -1) {
    track.value = queue.value[index + 1];
  }
}
function prev() {
  const index = queue.value.findIndex(({ id }) => id === track.value?.id);
  if (index > -1) {
    track.value = queue.value[index - 1];
  }
}
</script>

<template>
  <div class="player-component">
    <div class="info">
      <div class="cover">
        <Transition mode="out-in">
          <img
            v-if="coverSrc"
            :key="coverSrc"
            class="image"
            :src="coverSrc"
            alt="cover"
        /></Transition>
      </div>

      <div class="meta">
        <span class="title">{{ track?.title }}</span>
        <span class="artist">{{ track?.artist }}</span>
      </div>
    </div>

    <div class="player">
      <div class="controls">
        <div class="sound">
          <button class="button" @click="muted = !muted">
            <Transition mode="out-in">
              <Component :is="volumeIcon" class="icon" />
            </Transition>
          </button>

          <SliderRange
            v-model:value="volume"
            :class="{ _collapsed: muted }"
            class="range"
          />
        </div>

        <div class="main">
          <button
            class="button backward"
            :class="{ _disabled: !hasPrev }"
            @click="prev"
          >
            <BIconSkipStartFill class="icon" />
          </button>

          <button
            class="button play"
            :class="{ _disabled: caching }"
            @click="playing = !playing"
          >
            <Transition mode="out-in">
              <Loader v-if="caching" class="icon loader" />
              <Component :is="playBtnIcon" v-else class="icon play" />
            </Transition>
          </button>

          <button
            class="button forward"
            :class="{ _disabled: !hasNext }"
            @click="next"
          >
            <BIconSkipEndFill class="icon" />
          </button>
        </div>

        <div class="settings">
          <BIconArrowRepeat class="icon" />
          <BIconShuffle class="icon" />
          <BIconThreeDotsVertical class="icon" />
        </div>
      </div>

      <div class="timeline">
        <div class="time">{{ progressSplit.h }}:{{ progressSplit.m }}</div>
        <SliderRange v-model:value="progressScaled" class="range" wide />
        <div class="time">{{ durationSplit.h }}:{{ durationSplit.m }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.player-component {
  display: flex;
  height: 100px;
  overflow: hidden;
  border-radius: 10px;
  background-color: constants.$clr-background;
  box-shadow: constants.$cmn-shadow-block;

  .info {
    position: relative;
    margin-right: 20px;
    width: 300px;

    .cover {
      width: 70%;
      height: 100%;
      top: 0;
      left: 0;
      position: absolute;
      overflow: hidden;

      .image {
        @include mixins.size(fill);
        @include transitions.fade();
        object-fit: cover;
        object-position: center;

        &.v-enter-from {
          transform: scale(1.2);
        }
      }

      &::after {
        @include mixins.pseudo();
        left: 0;
        background: linear-gradient(
          to right,
          transparent,
          #{constants.$clr-background}
        );
      }

      &::before {
        @include mixins.pseudo();
        left: 20%;
        width: 80%;
        background: linear-gradient(
          to right,
          transparent,
          #{constants.$clr-background}
        );
      }
    }

    .meta {
      z-index: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      .title {
        margin: 27px 0 10px;
        font-size: 18px;
        font-weight: bold;
      }

      .artist {
        font-weight: lighter;
      }
    }
  }

  .player {
    margin: 0 10px;
    flex: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;

    .controls {
      padding: 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;

      .sound {
        width: 100px;
        display: flex;
        align-items: center;
        gap: 10px;

        .button {
          padding: 2px 3px;
          border-radius: 7px;
          transition: constants.$trn-normal-out;
          cursor: pointer;

          .icon {
            @include transitions.fade();
            color: constants.$clr-inactive;
            font-size: 20px;
            transition: constants.$trn-normal-out;
          }

          &:hover {
            background: constants.$clr-secondary;
            box-shadow: constants.$cmn-shadow-element;
            transform: scale(1.1);
            transition: constants.$trn-fast-out;

            .icon {
              color: constants.$clr-primary;
              transition: constants.$trn-fast-out;
            }
          }

          &:active {
            transform: scale(1);
            box-shadow: none;
          }
        }

        .range {
          width: 100%;
          transition: constants.$trn-normal-out;

          &._collapsed {
            width: 0;
            opacity: 0;
            pointer-events: none;
          }
        }
      }

      .main {
        display: flex;
        align-items: center;
        gap: 10px;
        color: constants.$clr-primary;

        .button {
          cursor: pointer;
          transition: constants.$trn-normal-out;

          &._disabled {
            opacity: 0.7;
            pointer-events: none;
          }

          &:hover {
            transform: scale(1.1);
            transition: constants.$trn-fast-out;
          }

          &.backward,
          &.forward {
            .icon {
              font-size: 30px;
              transition: constants.$trn-fast-out;
            }
          }

          &.backward:active {
            .icon {
              transform: translateX(-5px);
            }
          }

          &.forward:active {
            .icon {
              transform: translateX(5px);
            }
          }

          &.play {
            @include mixins.size(40px);
            display: flex;
            background: constants.$clr-primary;
            border-radius: 100%;

            &:active {
              transform: scale(1);
              box-shadow: none;
            }

            .icon {
              @include transitions.fade(constants.$trn-fast-out);
              margin: auto;
              font-size: 26px;
              color: constants.$clr-background;

              &.loader {
                stroke: white;
                stroke-width: 4;
                width: 30px;
              }
            }
          }
        }
      }

      .settings {
        display: flex;
        align-items: center;
        gap: 10px;

        .icon {
          padding: 5px;
          background-color: constants.$clr-secondary;
          border-radius: 8px;
          font-size: 27px;
          cursor: pointer;
        }
      }
    }

    .timeline {
      display: flex;
      gap: 10px;
      justify-content: space-between;
      align-items: center;

      .time {
        width: 40px;
        color: constants.$clr-primary;
        font-size: 15px;
        text-align: center;
      }

      .range {
        flex: auto;
      }
    }
  }

  @media (max-width: constants.$bpt-lg) {
    .info {
      width: 250px;
    }
  }
}
</style>
