<script lang="ts" setup>
import MoonLoader from 'vue-spinner/src/MoonLoader.vue'
import {
  breakpointsTailwind, syncRefs,
  useBreakpoints,
  whenever,
} from '@vueuse/core'
import { computed, customRef, ref, shallowRef, watch } from 'vue'
import {
  BIconArrowRepeat,
  BIconPauseFill,
  BIconPlayFill,
  BIconShuffle,
  BIconSkipEndFill,
  BIconSkipStartFill,
  BIconThreeDotsVertical,
  BIconVolumeMute,
  BIconVolumeUp,
} from 'bootstrap-icons-vue'
import SliderRange from '@/shared/components/SliderRange.vue'
import { usePlayer } from '@/core/stores/player'
import { useQueue } from '@/core/stores/queue'
import { randomArrayElement } from '@/shared/utils/random'
import { useColors } from '@/core/stores/colors'

const {
  track,
  playing,
  muted,
  volume,
  caching,
  progress,
  duration,
  ended,
  buffer,
} = usePlayer()

const { greater } = useBreakpoints(breakpointsTailwind)
const coverSrc = computed(() =>
  greater('lg').value ? track.value?.cover?.normal : track.value?.cover?.wide,
)

const coverLoaded = ref(false)
watch(coverSrc, () => (coverLoaded.value = false))
const coverRef = shallowRef<HTMLImageElement>()

function handleLoad(event: Event) {
  const target = event.target as HTMLImageElement
  if (target.src === coverRef.value?.src)
    coverLoaded.value = true
}

const { accentImage } = useColors()
syncRefs(coverRef, accentImage)

const volumeIcon = computed(() =>
  muted.value ? BIconVolumeMute : BIconVolumeUp,
)

const volumeGain = ref(2)
// TODO: Remove
window.changeVolumeGain = (value: number) => (volumeGain.value = value)
const volumeScaled = customRef(() => ({
  get: () => volume.value ** (1 / volumeGain.value),
  set: value => (volume.value = value ** volumeGain.value),
}))

const playBtnIcon = computed(() =>
  playing.value ? BIconPauseFill : BIconPlayFill,
)

interface TimeSplit {
  h: string
  m: string
}

const progressSplit = computed<TimeSplit>(() => ({
  h: Math.floor(progress.value / 60).toString(),
  m: `0${Math.floor(progress.value % 60)}`.slice(-2),
}))

const durationSplit = computed<TimeSplit>(() => ({
  h: Math.floor(duration.value / 60).toString(),
  m: `0${Math.floor(duration.value % 60)}`.slice(-2),
}))

const progressScaled = customRef(() => ({
  get: () => duration.value > 0 ? progress.value / duration.value : 0,
  set: value => progress.value = duration.value * value,
}))

const progressChanging = ref(false)
const wasPlaying = ref(false)

function handleProgressChangeStart() {
  wasPlaying.value = playing.value
  playing.value = false
  progressChanging.value = true
}

function handleProgressChangeEnd() {
  playing.value = wasPlaying.value
  wasPlaying.value = false
  progressChanging.value = false
}

const bufferScaled = computed(() =>
  duration.value > 0 ? buffer.value / duration.value : 0,
)

const { queue } = useQueue()
const repeating = ref(false)
const shuffling = ref(false)

whenever(
  () => ended.value && playing.value && !progressChanging.value,
  () => repeating.value ? progress.value = 0 : next(),
)

const hasPrev = computed(() => {
  if (shuffling.value) {
    return true
  }
  else {
    const index = queue.value.findIndex(({ id }) => id === track.value?.id)
    return index > -1 && queue.value[index - 1]
  }
})
const hasNext = computed(() => {
  if (shuffling.value) {
    return true
  }
  else {
    const index = queue.value.findIndex(({ id }) => id === track.value?.id)
    return index > -1 && queue.value[index + 1]
  }
})

function next() {
  if (shuffling.value) {
    track.value = randomArrayElement(queue.value)
  }
  else {
    const index = queue.value.findIndex(({ id }) => id === track.value?.id)
    if (index > -1)
      track.value = queue.value[index + 1]
  }
}

function prev() {
  if (shuffling.value) {
    track.value = randomArrayElement(queue.value)
  }
  else {
    const index = queue.value.findIndex(({ id }) => id === track.value?.id)
    if (index > -1)
      track.value = queue.value[index - 1]
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
          <span :key="track?.title" class="title">{{ track?.title }}</span>
        </Transition>

        <Transition mode="out-in">
          <span :key="track?.artist" class="artist">{{ track?.artist }}</span>
        </Transition>
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
            v-model:value="volumeScaled"
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
            :class="{ _disabled: !track }"
            @click="playing = !playing"
          >
            <Transition mode="out-in">
              <MoonLoader
                v-if="caching" size="30px" color="white"
                class="icon"
              />
              <Component :is="playBtnIcon" v-else class="icon" />
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
          <button
            class="button"
            :class="{ _turned: repeating }"
            @click="repeating = !repeating"
          >
            <BIconArrowRepeat class="icon" />
          </button>

          <button
            class="button"
            :class="{ _turned: shuffling }"
            @click="shuffling = !shuffling"
          >
            <BIconShuffle class="icon" />
          </button>

          <button class="button">
            <BIconThreeDotsVertical class="icon" />
          </button>
        </div>
      </div>
      <div class="timeline">
        <div class="time">
          {{ progressSplit.h }}:{{ progressSplit.m }}
        </div>
        <SliderRange
          v-model:value="progressScaled"
          :buffer="bufferScaled"
          class="range"
          wide
          @change-start="handleProgressChangeStart"
          @change-end="handleProgressChangeEnd"
        />
        <div class="time">
          {{ durationSplit.h }}:{{ durationSplit.m }}
        </div>
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
  background-color: rgb(constants.$clr-background);
  box-shadow: constants.$cmn-shadow-block;
  transition: constants.$trn-normal-out;

  .info {
    position: relative;
    margin-right: 20px;
    width: 450px;
    transition: constants.$trn-normal-out;

    .cover {
      width: 80%;
      height: 100%;
      top: 0;
      left: 0;
      position: absolute;
      overflow: hidden;

      .image {
        @include mixins.size(fill);
        @include transitions.fade($transition: constants.$trn-normal-out);
        z-index: 0;
        position: relative;
        object-fit: cover;
        object-position: center;

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
      margin-top: 27px;
      padding-left: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 10px;

      .title,
      .artist {
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .title {
        @include transitions.fade($transition: constants.$trn-normal-out);
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
  }

  .player {
    padding: 10px;
    flex: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .controls {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
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
            color: rgb(constants.$clr-text-inactive);
            font-size: 20px;
            transform: translateY(2px);
            transition: constants.$trn-normal-out;
          }

          &:hover {
            background: rgb(constants.$clr-secondary);
            box-shadow: constants.$cmn-shadow-element;
            transform: scale(1.1);
            transition: constants.$trn-fast-out;

            .icon {
              color: rgb(constants.$clr-primary);
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
        --color: rgb(constants.$clr-primary);
        padding-top: 10px;
        display: flex;
        align-items: center;
        gap: 10px;

        .button {
          cursor: pointer;
          transition: constants.$trn-normal-out;

          &._disabled {
            pointer-events: none;
            opacity: 0;
          }

          &:hover {
            transform: scale(1.1);
            transition: constants.$trn-fast-out;
          }

          &.backward,
          &.forward {

            .icon {
              color: rgb(constants.$clr-accent);
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
            background: rgb(constants.$clr-accent);;
            border-radius: 100%;

            &:hover {
              transform: scale(1.07);
            }

            &:active {
              transform: scale(1);
              box-shadow: none;
            }

            .icon {
              @include transitions.fade(constants.$trn-fast-out);
              margin: auto;
              font-size: 26px;
              color: rgb(constants.$clr-background);
            }
          }
        }
      }

      .settings {
        display: flex;
        gap: 10px;

        .button {
          padding: 2px 3px;
          border-radius: 7px;
          transition: constants.$trn-normal-out;
          cursor: pointer;

          .icon {
            @include transitions.fade();
            color: rgb(constants.$clr-text-inactive);
            font-size: 20px;
            transform: translateY(2px);
            transition: constants.$trn-normal-out;
          }

          &:hover {
            background: rgb(constants.$clr-secondary);
            box-shadow: constants.$cmn-shadow-element;
            transform: scale(1.1);
            transition: constants.$trn-fast-out;

            .icon {
              color: rgb(constants.$clr-primary);
              transition: constants.$trn-fast-out;
            }
          }

          &:active {
            transform: scale(1);
            box-shadow: none;
          }

          &._turned {
            background: rgb(constants.$clr-primary);

            .icon {
              color: rgb(constants.$clr-background);
            }
          }
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
        font-size: 15px;
        text-align: center;
      }

      .range {
        flex: auto;
      }
    }
  }
}

@media (max-width: constants.$bpt-xxl) {
  .player-component {
    .info {
      width: 300px;

      .cover {
        width: 60%;

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
}

@media (max-width: constants.$bpt-lg) {
  .player-component {
    height: 200px;
    flex-direction: column;

    .info {
      margin: 0;
      flex: auto;
      width: unset;

      .cover {
        width: 100%;

        &::after {
          left: 0;
          opacity: 0.8;
          background: linear-gradient(
              to right,
              transparent 0%,
              rgb(constants.$clr-background) 30%,
              rgb(constants.$clr-background) 70%,
              transparent 100%
          );
        }

        &::before {
          @include mixins.pseudo();
          z-index: 1;
          background: linear-gradient(
              to top,
              rgb(constants.$clr-background) 0%,
              transparent 50%
          );
        }
      }

      .meta {
        margin: 0 auto;
        padding: 0;
        width: 300px;
        height: 100%;
        justify-content: center;
        align-items: center;
      }
    }

    .player {
      flex: none;
      height: 100px;

      .controls {
        align-items: center;
      }
    }
  }
}
</style>
