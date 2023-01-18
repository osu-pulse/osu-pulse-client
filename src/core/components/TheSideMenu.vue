<script lang="ts" setup>
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faBookOpen,
  faCircle,
  faGear,
  faHouse,
  faListUl,
  faPaintRoller,
  faShareNodes,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faHouse,
  faListUl,
  faBookOpen,
  faUserGroup,
  faShareNodes,
  faGear,
  faPaintRoller,
  faCircle,
);

const menuMusicItems = [
  {
    label: 'Home',
    icon: 'fa-solid fa-house',
  },
  {
    label: 'Library',
    icon: 'fa-solid fa-book-open',
  },
  {
    label: 'Playlists',
    icon: 'fa-solid fa-list-ul',
  },
  {
    label: 'Friends',
    icon: 'fa-solid fa-user-group',
  },
];

const menuControlItems = [
  {
    label: 'Devices',
    icon: 'fa-solid fa-share-nodes',
  },
  {
    label: 'Themes',
    icon: 'fa-solid fa-paint-roller',
  },
  {
    label: 'Settings',
    icon: 'fa-solid fa-gear',
  },
];

const isSelected = ref<boolean>(false);
const userAvatar = ref<boolean>(false);
const isUserOnline = ref<boolean>(true);
const userStatus = computed(() => (isUserOnline.value ? 'online' : 'offline'));
</script>

<template>
  <div class="side-menu-component">
    <div class="logo">
      <img alt="logo" src="../assets/logo/osulogo.png" />
      <p>Pulse</p>
    </div>

    <div class="user">
      <div class="user-img-container">
        <img v-if="!userAvatar" alt="avatar" src="../assets/empty-avatar.jpg" />
        <img v-else alt="avatar" src="" />
      </div>
      <div class="user-info">
        <div class="user-name">Unknown</div>
        <div class="user-status" :class="{ _online: isUserOnline }">
          <FontAwesomeIcon class="status-icon" icon="fa solid fa-circle" />
          <div>{{ userStatus }}</div>
        </div>
      </div>
    </div>

    <div class="menu-sections">
      <div class="section-label">Music</div>
      <div
        v-for="item in menuMusicItems"
        :key="item"
        class="side-menu-item"
        :class="{ _selected: isSelected }"
      >
        <div class="icon-container">
          <FontAwesomeIcon
            :icon="item.icon"
            class="item-icon"
          ></FontAwesomeIcon>
        </div>
        <div class="item-label">{{ item.label }}</div>
      </div>

      <div class="section-label">Control</div>
      <div
        v-for="item in menuControlItems"
        :key="item"
        class="side-menu-item"
        :class="{ _selected: isSelected }"
      >
        <div class="icon-container">
          <FontAwesomeIcon
            :icon="item.icon"
            class="item-icon"
          ></FontAwesomeIcon>
        </div>
        <div class="item-label">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  font-size: 10px;
  margin: 0;
  padding: 0;
}

.side-menu-component {
  padding: 20px;
  width: 22%;
  min-width: 150px;
  max-width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;

  .logo {
    margin-bottom: 30px;
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;

    img {
      width: 50px;
      height: 50px;
    }

    p {
      font-size: 2.5em;
      font-weight: 500;
    }
  }

  .user {
    margin-bottom: 20px;
    display: flex;
    gap: 1.5em;

    .user-img-container {
      width: 50px;

      img {
        width: 100%;
        border-radius: 10px;
      }
    }

    .user-info {
      flex: auto;
      align-self: center;

      .user-name {
        font-size: 1.5em;
        font-weight: bold;
      }

      .user-status {
        margin-top: 0.2em;
        display: flex;
        gap: 0.5em;
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
      margin-top: 1em;
      padding-left: 10px;
      color: #c4c3c3;
      font-size: 1.2em;
    }

    .side-menu-item {
      display: flex;
      align-items: center;
      border-radius: 10px;

      .icon-container {
        width: 20%;
        display: flex;
        justify-content: center;
        padding: 10px;

        .item-icon {
          color: #767676;
          width: 1.6em;
          height: 1.6em;
        }
      }

      .item-label {
        flex: auto;
        padding: 10px;
        color: #606060;
        font-size: 1.3em;
      }

      &:hover {
        background-color: #f4f5fe;
        cursor: pointer;

        .item-icon,
        .item-label {
          color: #000000;
        }
      }

      &._selected {
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
