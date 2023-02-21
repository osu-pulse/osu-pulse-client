<script lang="ts" setup>
import {
  BIconBook,
  BIconCircleFill,
  BIconEye,
  BIconGear,
  BIconHouse,
  BIconMusicNoteBeamed,
  BIconMusicNoteList,
  BIconPalette,
  BIconPeople,
} from 'bootstrap-icons-vue'
import { computed } from 'vue'
import EmptyAvatarUrl from '../../shared/assets/empty-avatar.webp?url'
import type { SideMenuItem } from '@/core/types/side-menu-item'
import { useUser } from '@/core/stores/user'
import { useOffline } from '@/core/stores/offline'
import { RouteName } from '@/shared/constants/route-name'
import { usePlayer } from '@/core/stores/player'
import { useCurrentTrack } from '@/core/stores/current-track'

const itemsMusic: SideMenuItem[] = [
  {
    label: 'Home',
    icon: BIconHouse,
    to: { name: RouteName.HOME },
  },
  {
    label: 'Library',
    icon: BIconBook,
    to: { name: RouteName.LIBRARY },
  },
  {
    label: 'Playlists',
    icon: BIconMusicNoteList,
    to: { name: RouteName.PLAYLISTS },
  },
  {
    label: 'Friends',
    icon: BIconPeople,
    to: { name: RouteName.FRIENDS },
  },
]

const itemsControl: SideMenuItem[] = [
  {
    label: 'Themes',
    icon: BIconPalette,
    to: { name: RouteName.THEMES },
  },
  {
    label: 'Settings',
    icon: BIconGear,
    to: { name: RouteName.SETTINGS },
  },
]

const { user } = useUser()
const { offline } = useOffline()
const avatar = computed(() => user.value?.url?.avatar ?? EmptyAvatarUrl)
const username = computed(() => user.value?.username ?? 'UNKNOWN')

const { playing } = usePlayer()
const { currentTrack } = useCurrentTrack()
const listening = computed(
  () => currentTrack.value && `${currentTrack.value.title} - ${currentTrack.value.artist}`,
)

function goProfile() {
  const url = user.value?.url?.profile
  window.open(url, '_blank')?.focus()
}
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
          <BIconEye class="icon" />
        </div>
      </div>

      <div class="info">
        <div class="title">
          <BIconCircleFill
            class="status"
            :class="offline ? '_offline' : '_online'"
          />

          <div class="name">
            {{ username }}
          </div>
        </div>

        <Transition>
          <div v-show="listening && playing" class="listening">
            <BIconMusicNoteBeamed class="icon" />
            <Transition mode="out-in">
              <span :key="listening" class="text">{{ listening }}</span>
            </Transition>
          </div>
        </Transition>
      </div>
    </div>

    <div class="divider" />

    <div class="sections-list">
      <RouterLink
        v-for="item in itemsMusic"
        :key="item.label"
        :to="item.to"
        class="section"
      >
        <div class="section-inner">
          <Component :is="item.icon" class="icon" />
          <div class="label">
            {{ item.label }}
          </div>
        </div>
      </RouterLink>
    </div>

    <div class="divider" />

    <div class="sections-list">
      <RouterLink
        v-for="item in itemsControl"
        :key="item.label"
        :to="item.to"
        class="section"
      >
        <div class="section-inner">
          <Component :is="item.icon" class="icon" />
          <div class="label">
            {{ item.label }}
          </div>
        </div>
      </RouterLink>
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

        &:hover {
          opacity: 1;

          .icon {
            transform: scale(1);
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
      display: flex;

      .section-inner {
        margin: 0 30px;
        flex: auto;
        padding: 20px;
        overflow: hidden;
        display: flex;
        align-items: center;
        gap: 20px;
        border-radius: 10px;
        transition: constants.$trn-normal-out;

        .icon,
        .label {
          color: rgb(constants.$clr-text-inactive);
          transition: constants.$trn-normal-out;
        }

        .icon {
          font-size: 22px;
          transition: constants.$trn-normal-out;
        }

        .label {
          font-size: 18px;
          font-weight: bold;
          transition: constants.$trn-normal-out;
        }
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

      &:hover {
        &:not(.router-link-active) {
          .section-inner {
            box-shadow: constants.$cmn-shadow-element;
            transform: scale(1.01);
            background: rgb(constants.$clr-secondary);
            transition: constants.$trn-fast-in;

            .icon,
            .label {
              color: rgb(constants.$clr-text);
              transition: constants.$trn-fast-in;
            }

            .icon {
              transform: scale(1.1);
            }
          }
        }
      }

      &.router-link-active {
        .section-inner {
          background-color: rgb(constants.$clr-primary);

          .icon {
            transform: scale(1.1);
          }

          .icon,
          .label {
            color: rgb(constants.$clr-background);
          }
        }

        &::after {
          transform: none;
          transition: constants.$trn-normal-out;
        }
      }
    }
  }
}

@media (max-width: constants.$bpt-xxl) {
  .side-menu-component {
    width: 300px;
  }
}

@media (max-width: constants.$bpt-xl) {
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
        .section-inner {
          margin: 0 15px;
          padding: 15px;

          .label {
            display: none;
          }
        }

        &::after {
          display: none;
        }

        &:hover {
          &:not(.router-link-active) {
            .section-inner {
              transform: scale(1.05);
            }
          }
        }
      }
    }
  }
}
</style>
