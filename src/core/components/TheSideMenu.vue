<script lang="ts" setup>
import type { SideMenuItem } from '~/core/types/SideMenuItem';

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
];

const itemsControl: SideMenuItem[] = [
  {
    label: 'Devices',
    icon: BIconCast,
    to: { name: RouteName.DEVICES },
  },
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
];

const isOnline = ref(true);
const avatar = ref<string>('https://a.ppy.sh/22339657?1671484060.jpeg');
const listening = ref<string>('Time Is Ticking Out - TheCranberries');
</script>

<template>
  <div class="side-component">
    <RouterLink :to="{ name: RouteName.HOME }" class="logo">
      <img class="icon" alt="logo" src="../assets/osu-logo.webp" />
      <span class="label">Pulse</span>
    </RouterLink>

    <div class="user">
      <img
        class="avatar"
        alt="avatar"
        :src="avatar ?? require('../../shared/assets/empty-avatar.webp')"
      />

      <div class="info">
        <div class="title">
          <BIconCircleFill
            class="status"
            :class="isOnline ? '_online' : '_offline'"
          />

          <div class="name">T1MON</div>
        </div>

        <div v-show="listening" class="listening">
          <BIconMusicNote class="icon" />
          <span class="text">Time Is Ticking Out - TheCranberries</span>
        </div>
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
          <div class="label">{{ item.label }}</div>
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
          <div class="label">{{ item.label }}</div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../src/shared/styles/mixins';
@use '../src/shared/styles/constants';

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

.side-menu {
  width: 300px;
  overflow: auto;
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  background-color: constants.$clr-background;
  box-shadow: constants.$cmn-shadow-block;

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
      color: constants.$clr-text;
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
    margin: 0 20px 20px;
    display: flex;
    gap: 15px;

    .avatar {
      @include mixins.size(73px);
      object-fit: cover;
      object-position: center;
      border-radius: constants.$cmn-border-radius;
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
            color: #f56767;
          }
        }

        .name {
          color: constants.$clr-text;
          font-size: 20px;
          font-weight: bold;
          letter-spacing: 1px;
        }
      }

      .listening {
        gap: 2px;
        overflow: hidden;
        display: flex;
        align-items: center;
        color: constants.$clr-inactive;

        .text {
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
      constants.$clr-inactive 40%,
      constants.$clr-inactive 60%,
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
      overflow: hidden;

      .section-inner {
        margin: 0 20px;
        flex: auto;
        padding: 20px;
        display: flex;
        align-items: center;
        gap: 22px;
        border-radius: constants.$cmn-border-radius;
        transition: constants.$trn-normal-out;

        .icon,
        .label {
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
        width: constants.$cmn-border-radius;
        border-top-left-radius: constants.$cmn-border-radius;
        border-bottom-left-radius: constants.$cmn-border-radius;
        background-color: constants.$clr-primary;
        transform: translateX(constants.$cmn-border-radius);
        transition: constants.$trn-fast-out;
      }

      &:hover {
        .section-inner {
          background-color: constants.$clr-secondary;
          cursor: pointer;
          transition: constants.$trn-fast-in;

          .icon {
            transform: scale(1.1);
          }

          .icon,
          .label {
            color: constants.$clr-text;
            transition: constants.$trn-fast-in;
          }
        }
      }

      &.router-link-active {
        .section-inner {
          background-color: constants.$clr-primary;

          .icon {
            transform: scale(1.1);
          }

          .icon,
          .label {
            color: constants.$clr-background;
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
</style>
