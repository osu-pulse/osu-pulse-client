<script lang="ts" setup>
import { computed, shallowRef } from 'vue'
import {
  breakpointsTailwind,
  syncRefs,
  useBreakpoints,
  useMouseInElement,
} from '@vueuse/core'
import BIcon from '@/shared/components/BIcon.vue'
import { useColors } from '@/core/stores/colors'
import { usePlayer } from '@/player/stores/player'
import { useCurrentTrack } from '@/player/stores/current-track'

const { currentTrack } = useCurrentTrack()
const { duration, playing } = usePlayer()

interface TimeSplit {
  h: string
  m: string
}
const durationSplit = computed<TimeSplit>(() => ({
  h: Math.floor(duration.value / 60).toString(),
  m: `0${Math.floor(duration.value % 60)}`.slice(-2),
}))

const listItem = shallowRef<HTMLDivElement>()
const { isOutside } = useMouseInElement(listItem)

const playBtnIcon = computed(() => playing.value ? 'pause-fill' : 'play-fill')

const coverRef = shallowRef<HTMLImageElement>()
const { accentImage } = useColors()
syncRefs(coverRef, accentImage)

const { greater } = useBreakpoints(breakpointsTailwind)
const isButtonShowed = computed(() =>
  greater('md').value,
)
const isWaveShowed = computed(() => greater('sm').value)
</script>

<template>
  <div ref="listItem" class="library-track-component">
    <div class="order">
      <Transition mode="out-in">
        <BIcon v-if="!isOutside" :name="playBtnIcon" class="icon" @click="playing = !playing" />
        <span v-else class="number">1</span>
      </Transition>
    </div>

    <div class="info">
      <img ref="coverRef" alt="cover" class="cover" :src="currentTrack?.cover?.normal">
      <div class="track">
        <span class="title">{{ currentTrack?.title }}</span>
        <span class="artist">{{ currentTrack?.artist }}</span>
      </div>
    </div>

    <div v-if="playing && isWaveShowed" class="wave">
      <span>я волна, новая волна</span>
    </div>

    <Transition mode="out-in">
      <div v-if="!isOutside" class="controls">
        <div v-if="isButtonShowed">
          <button class="button">
            <BIcon name="plus-lg" class="icon" />
          </button>
          <button class="button">
            <BIcon name="download" class="icon" />
          </button>
          <button class="button">
            <BIcon name="share" class="icon" />
          </button>
        </div>
        <button class="button">
          <BIcon class="icon" name="three-dots-vertical" />
        </button>
      </div>

      <div v-else class="time">
        {{ durationSplit.h }}:{{ durationSplit.m }}
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.library-track-component {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  transition: constants.$trn-slow-out;
  border-radius: constants.$cmn-border-radius;

  .order {
    @include transitions.fade();
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;

    .number {
    }

    .icon {
      @include transitions.fade();
      width: 40px;
      height: 40px;
      color: rgb(constants.$clr-accent);
      cursor: pointer;
    }
  }

  .info {
    display: flex;
    align-items: center;
    width: 500px;

    .cover {
      margin-right: 40px;
      width: 55px;
      height: 55px;
      transition: constants.$trn-slow-out;
      border-radius: constants.$cmn-border-radius;
    }

    .track {
      flex: auto;
      display: flex;
      align-items: center;

      .title {
        width: 300px;
        overflow: hidden;
        font-size: 20px;
        font-weight: bold;
      }

      .artist {
        overflow: hidden;
      }
    }
  }

  .wave {
    width: 200px;
    text-align: center;
    font-style: italic;
    overflow: hidden;
  }

  .controls {
    @include transitions.fade();
    margin-left: auto;
    display: flex;

    .button {
      padding: 2px 3px;
      border-radius: 7px;
      transition: constants.$trn-normal-out;
      cursor: pointer;
      margin-right: 15px;

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
  }

  .time {
    @include transitions.fade();
    flex: auto;
    text-align: end;
  }

  &:hover {
    background-color: rgb(constants.$clr-background);
    box-shadow: constants.$cmn-shadow-block;

    .info{
      .cover{
        transition: constants.$trn-slow-in;
        border-radius: 0;
      }
    }
  }
}

@media (max-width: constants.$bpt-lg){
  .library-track-component {
    .info {
      width: 250px;

      .cover {
        margin-right: 10px;
      }

      .track {
        flex-direction: column;
        align-items: flex-start;

        .title {
          width: 200px
        }
      }
    }
  }
}

@media (max-width: constants.$bpt-md){
  .library-track-component {
    gap: 5px;
    padding: 0;

    .info {
      .track {
        .title {
          //width: 200px;
        }
      }
    }

    .wave {
      width: 100px;
    }

    .controls {
      .button {
        margin-right: 10px;
      }
    }
  }
}
</style>
