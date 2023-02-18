<script lang="ts" setup>
import { BIconArrowsAngleContract, BIconArrowsAngleExpand, BIconCaretDown, BIconXLg } from 'bootstrap-icons-vue'
import { ref } from 'vue'

const isMaximized = ref(false)

function handleMinimize() {
  window.electron.minimize()
}

function handleMaximize() {
  window.electron.maximize()
  isMaximized.value = true
}
function handleUnmaximize() {
  window.electron.unmaximize()
  isMaximized.value = false
}

function handleClose() {
  window.electron.close()
}
</script>

<template>
  <div class="title-bar-component">
    <div class="title">
      osu
    </div>

    <div class="controls">
      <button class="button" @click="handleMinimize">
        <BIconCaretDown class="icon" />
      </button>

      <button v-if="isMaximized" class="button" @click="handleUnmaximize">
        <BIconArrowsAngleContract class="icon" />
      </button>
      <button v-else class="button" @click="handleMaximize">
        <BIconArrowsAngleExpand class="icon" />
      </button>

      <button class="button close" @click="handleClose">
        <BIconXLg class="icon" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../src/shared/styles/constants';
@use '../src/shared/styles/mixins';

.title-bar-component {
  min-width: max-content;
  display: flex;
  background: rgb(constants.$clr-primary);
  user-select: none;
  -webkit-app-region: drag;

  .title {
    margin: auto 0 auto 15px;
    height: 20px;
    color: rgb(constants.$clr-background);
    font-weight: bold;
    font-size: 14px;
    letter-spacing: 1px;
  }

  .controls {
    margin-left: auto;
    padding: 5px 5px;
    display: flex;
    gap: 10px;

    .button {
      display: flex;
      font-size: 12px;
      padding: 3px 10px;
      border: none;
      background: transparent;
      border-radius: 6px;
      outline: none;
      transition: constants.$trn-normal-out;
      -webkit-app-region: no-drag;

      .icon {
        color: rgb(constants.$clr-background);
        transition: constants.$trn-normal-out;
      }

      &:hover {
        background: rgb(constants.$clr-background);
        transform: scale(1.1);
        box-shadow: constants.$cmn-shadow-element;
        transition: constants.$trn-fast-out;

        .icon {
          color: constants.$clr-primary;
          transition: constants.$trn-fast-out;
        }
      }

      &.close {
        &:hover {
          background: rgba(red, 0.7);
        }
      }
    }
  }

  @media (max-width: constants.$bpt-sm) {
    .title {
      .text {
        width: 250px;
      }
    }
  }
}
</style>
