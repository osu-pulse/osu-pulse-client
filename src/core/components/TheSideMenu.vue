<script lang="ts" setup>
import {
  BIconBook,
  BIconCast,
  BIconCircleFill,
  BIconGear,
  BIconHouse,
  BIconMusicNoteList,
  BIconPalette,
  BIconPeople,
} from 'bootstrap-icons-vue';
import type { SideMenuItem } from '~/core/types/SideMenuItem';

const menuMusicItems: SideMenuItem[] = [
  {
    label: 'Home',
    icon: BIconHouse,
    to: RouteName.HOME,
  },
  {
    label: 'Library',
    icon: BIconBook,
    to: RouteName.LIBRARY,
  },
  {
    label: 'Playlists',
    icon: BIconMusicNoteList,
    to: RouteName.PLAYLISTS,
  },
  {
    label: 'Friends',
    icon: BIconPeople,
    to: RouteName.FRIENDS,
  },
];

const menuControlItems: SideMenuItem[] = [
  {
    label: 'Devices',
    icon: BIconCast,
    to: RouteName.DEVICES,
  },
  {
    label: 'Themes',
    icon: BIconPalette,
    to: RouteName.THEMES,
  },
  {
    label: 'Settings',
    icon: BIconGear,
    to: RouteName.SETTINGS,
  },
];

const userAvatar = ref<boolean>(false);
const isUserOnline = ref<boolean>(true);
const userStatus = computed(() => (isUserOnline.value ? 'online' : 'offline'));
</script>

<template>
  <div class="side-menu-component">
    <div class="logo">
      <img class="logo-img" alt="logo" src="../assets/osulogo.png" />
      <p>Pulse</p>
    </div>

    <div class="user">
      <div class="user-img-container">
        <img
          v-if="!userAvatar"
          class="user-avatar"
          alt="avatar"
          src="../../shared/assets/empty-avatar.jpg"
        />
        <img v-else class="user-avatar" alt="avatar" src="" />
      </div>
      <div class="user-info">
        <div class="user-name">Unknown</div>
        <div class="user-status" :class="{ _online: isUserOnline }">
          <BIconCircleFill class="status-icon" />
          <div>{{ userStatus }}</div>
        </div>
      </div>
    </div>

    <div class="menu-sections">
      <div class="section-label">Music</div>
      <router-link
        v-for="item in menuMusicItems"
        :key="item"
        :to="item.to"
        class="side-menu-item"
      >
        <div class="icon-container">
          <Component :is="item.icon" class="item-icon" />
        </div>
        <div class="item-label">{{ item.label }}</div>
      </router-link>

      <div class="section-label">Control</div>
      <router-link
        v-for="item in menuControlItems"
        :key="item"
        :to="item.to"
        class="side-menu-item"
      >
        <div class="icon-container">
          <Component :is="item.icon" class="item-icon" />
        </div>
        <div class="item-label">{{ item.label }}</div>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../src/shared/styles/constants';

.side-menu-component {
  padding: 20px;
  width: 22%;
  min-width: 200px;
  max-width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: constants.$clr-side-menu;

  .logo {
    margin-bottom: 30px;
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;

    .logo-img {
      width: 50px;
      height: 50px;
    }

    p {
      font-size: 25px;
      font-weight: 500;
    }
  }

  .user {
    margin-bottom: 20px;
    display: flex;
    gap: 15px;

    .user-img-container {
      width: 73px;

      .user-avatar {
        width: 100%;
        border-radius: 10px;
      }
    }

    .user-info {
      flex: auto;
      align-self: center;

      .user-name {
        font-size: 15px;
        font-weight: bold;
      }

      .user-status {
        margin-top: 8px;
        display: flex;
        gap: 5px;
        color: #f56767;

        .status-icon {
          width: 7px;
          height: auto;
        }

        &._online {
          color: #78d17c;
        }
      }
    }
  }

  .menu-sections {
    display: flex;
    flex-direction: column;
    gap: 5px;

    .section-label {
      margin-top: 10px;
      padding-left: 10px;
      font-size: 12px;
      color: #c4c3c3;
    }

    .side-menu-item {
      display: flex;
      align-items: center;
      border-radius: 10px;

      .icon-container {
        padding: 10px;
        display: flex;
        justify-content: center;
        width: 20%;

        .item-icon {
          width: 24px;
          height: 24px;
          color: #767676;
        }
      }

      .item-label {
        padding: 10px;
        flex: auto;
        font-size: 18px;
        color: #606060;
      }

      &:hover {
        background-color: constants.$clr-main-section;
        cursor: pointer;

        .item-icon,
        .item-label {
          color: #000000;
        }
      }

      &.router-link-active {
        background-color: #2f2f2f;

        .item-icon,
        .item-label {
          color: #fff;
        }
      }
    }
  }
}
</style>
