<script lang="ts" setup>
import { computed } from 'vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useRoute } from 'vue-router'
import EmptyAvatarUrl from '../../shared/assets/empty-avatar.webp?url'
import type { SideMenuItem } from '@/core/types/side-menu-item'
import { useUser } from '@/core/stores/user'
import { useOffline } from '@/core/stores/offline'
import { RouteName } from '@/shared/constants/route-name'
import { usePlayer } from '@/player/stores/player'
import BIcon from '@/shared/components/BIcon.vue'
import SecondaryPanel from '@/shared/components/SecondaryPanel.vue'

const { greater } = useBreakpoints(breakpointsTailwind)
const greaterSm = greater('sm')

const itemsMusic: SideMenuItem[] = [
  {
    label: 'Home',
    icon: 'house',
    to: { name: RouteName.HOME },
  },
  {
    label: 'Library',
    icon: 'book',
    to: { name: RouteName.LIBRARY },
  },
  {
    label: 'Playlists',
    icon: 'music-note-list',
    to: { name: RouteName.PLAYLISTS },
  },
  {
    label: 'Friends',
    icon: 'people',
    to: { name: RouteName.FRIENDS },
  },
]

const itemsControl: SideMenuItem[] = [
  {
    label: 'Themes',
    icon: 'palette',
    to: { name: RouteName.THEMES },
  },
  {
    label: 'Settings',
    icon: 'gear',
    to: { name: RouteName.SETTINGS },
  },
]

const { user } = useUser()
const { offline } = useOffline()
const avatar = computed(() => user.value?.url?.avatar ?? EmptyAvatarUrl)
const username = computed(() => user.value?.username ?? 'UNKNOWN')

const { playing, track } = usePlayer()
const listening = computed(
  () => track.value && `${track.value.title} - ${track.value.artist}`,
)

function goProfile() {
  const url = user.value?.url?.profile
  window.open(url, '_blank')?.focus()
}

const route = useRoute()
</script>

<template>
  <div class="side-menu-component">
    <RouterLink :to="{ name: RouteName.HOME }" class="logo">
      <img class="icon" alt="logo" src="../../shared/assets/logo.webp">
      <span class="label">Pulse</span>
    </RouterLink>

    <div class="user">
      <div class="avatar-wrap">
        <img class="avatar" alt="avatar" :src="avatar">
        <div v-if="user" class="overlay" @click="goProfile">
          <BIcon name="eye" class="icon" />
        </div>
      </div>

      <div class="info">
        <div class="title">
          <BIcon
            name="circle-fill"
            class="status"
            :class="offline ? '_offline' : '_online'"
          />

          <div class="name">
            {{ username }}
          </div>
        </div>

        <Transition>
          <div v-show="listening && playing" class="listening">
            <BIcon name="music-note-beamed" class="icon" />
            <Transition mode="out-in">
              <span :key="listening" class="text">{{ listening }}</span>
            </Transition>
          </div>
        </Transition>
      </div>
    </div>

    <template v-if="greaterSm">
      <div class="divider" />

      <div class="sections-list">
        <div
          v-for="item in itemsMusic"
          :key="item.label"
          class="section"
          :class="{ _active: item.to.name === route.name } "
        >
          <SecondaryPanel
            class="panel"
            :icon="item.icon"
            :label="item.label"
            :to="item.to"
            :active="item.to.name === route.name"
          />
        </div>
      </div>

      <div class="divider" />
    </template>

    <div class="sections-list">
      <div
        v-for="item in itemsControl"
        :key="item.label"
        class="section"
        :class="{ _active: item.to.name === route.name } "
      >
        <SecondaryPanel
          class="panel"
          :icon="item.icon"
          :label="item.label"
          :to="item.to"
          :active="item.to.name === route.name"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../src/shared/styles/mixins';
@use '../src/shared/styles/constants';
@use '../src/shared/styles/transitions';

@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.97);
  }
  35% {
    transform: scale(0.9);
  }
  45% {
    transform: scale(1.1);
  }
  55% {
    transform: scale(0.9);
  }
  65% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(1.03);
  }
  100% {
    transform: scale(1);
  }
}

.side-menu-component {
  min-width: max-content;
  width: 350px;
  overflow: auto;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  background-color: rgb(constants.$clr-background);
  box-shadow: constants.$cmn-shadow-block;
  transition: constants.$trn-normal-out;

  .logo {
    margin: 0 auto 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    .icon {
      width: 50px;
      animation: heartbeat 1.5s;
    }

    .label {
      color: rgb(constants.$clr-text);
      font-family: 'Michroma', sans-serif;
      font-size: 26px;
    }

    &:hover {
      .icon {
        animation: heartbeat 1.5s infinite;
      }
    }
  }

  .user {
    margin: 0 30px 20px;
    display: flex;
    gap: 15px;

    .avatar-wrap {
      @include mixins.size(70px);
      flex: none;
      position: relative;
      display: flex;
      border-radius: 10px;
      overflow: hidden;

      .avatar {
        object-fit: cover;
        object-position: center;
      }

      .overlay {
        @include mixins.size(fill);
        position: absolute;
        display: flex;
        background: rgba(black, 0.5);
        opacity: 0;
        transition: constants.$trn-normal-out;
        cursor: pointer;

        .icon {
          margin: auto;
          font-size: 30px;
          color: rgb(constants.$clr-background);
          opacity: 0.7;
          transform: scale(0.5);
          transition: constants.$trn-normal-out;
        }

        @mixin hovered {
          opacity: 1;

          .icon {
            transform: scale(1);
          }
        }

        @media (hover: hover) {
          &:hover {
            @include hovered;
          }
        }

        @media (hover: none) {
          &:active {
            @include hovered;
          }
        }
      }
    }

    .info {
      padding-top: 5px;
      flex: auto;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .title {
        display: flex;
        align-items: center;
        gap: 10px;

        .status {
          font-size: 10px;

          &._online {
            color: #78d17c;
          }

          &._offline {
            color: #b7b7b7;
          }
        }

        .name {
          color: rgb(constants.$clr-text);
          font-size: 20px;
          font-weight: bold;
          letter-spacing: 1px;
        }
      }

      .listening {
        @include transitions.fade();
        gap: 5px;
        overflow: hidden;
        display: flex;
        align-items: center;
        color: rgb(constants.$clr-text-inactive);
        font-size: 14px;

        .text {
          @include transitions.fade();
          flex: auto;
          width: 110px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }

  .divider {
    margin: 20px 70px;
    flex: none;
    height: 2px;
    background: linear-gradient(
        90deg,
        transparent 0%,
        rgb(constants.$clr-text-inactive) 40%,
        rgb(constants.$clr-text-inactive) 60%,
        transparent 100%
    );
  }

  .sections-list {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5px;

    .section {
      padding-left: 30px;
      display: flex;
      gap: 30px;

      .panel {
        flex: auto;
      }

      &::after {
        @include mixins.pseudo();
        position: static;
        width: 10px;
        border-radius: 10px 0 0 10px;
        background-color: rgb(constants.$clr-primary);
        transform: scaleX(0);
        transform-origin: right;
        transition: constants.$trn-fast-out;
      }

      &._active {
        pointer-events: none;

        &::after {
          transform: none;
          transition: constants.$trn-normal-out;
        }
      }
    }
  }
}

@media (max-width: constants.$bpt-2xl) and (min-width: constants.$bpt-xl - 1px) {
  .side-menu-component {
    width: 300px;
  }
}

@media (max-width: constants.$bpt-xl) and (min-width: constants.$bpt-sm - 1px) {
  .side-menu-component {
    width: 80px;

    .logo {
      margin-bottom: 20px;

      .icon {
        margin: auto;
      }

      .label {
        display: none;
      }
    }

    .user {
      margin: 0 0 10px;

      .avatar-wrap {
        @include mixins.size(50px);
        margin: auto;

        .overlay {
          .icon {
            font-size: 20px;
          }
        }
      }

      .info {
        display: none;
      }
    }

    .divider {
      margin: 10px 20px;
    }

    .sections-list {
      .section {
        padding: 0 15px;
        gap: 15px;

        .panel {
          padding: 15px;

          ::v-deep(.label) {
            display: none;
          }
        }

        &::after {
          display: none;
        }
      }
    }
  }
}

@media (max-width: constants.$bpt-sm) {
  .side-menu-component {
    padding: 30px 50px 0;
    width: unset;
    box-shadow: none;

    .logo {
      margin-bottom: 40px;
    }

    .user {
      margin: 0 0 40px;
    }

    .sections-list {
      .section {
        padding: 0;

        &::after {
          display: none;
        }
      }
    }
  }
}
</style>
