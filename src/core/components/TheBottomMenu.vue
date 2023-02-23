<script lang="ts" setup>
import {
  useVModel,
} from '@vueuse/core'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import { RouteName } from '@/shared/constants/route-name'
import type { BottomMenuItem } from '@/core/types/bottom-menu-item'
import BIcon from '@/shared/components/BIcon.vue'

const props = defineProps<{
  menuShowed: boolean
}>()

const emits = defineEmits<{
  (e: 'update:menuShowed', value: boolean): void
}>()

const menuShowed = useVModel(props, 'menuShowed', emits)
const route = useRoute()
watch(route, () => (menuShowed.value = false))

const items: BottomMenuItem[] = [
  {
    icon: 'house',
    to: { name: RouteName.HOME },
  },
  {
    icon: 'book',
    to: { name: RouteName.LIBRARY },
  },
  {
    icon: 'music-note-list',
    to: { name: RouteName.PLAYLISTS },
  },
  {
    icon: 'people',
    to: { name: RouteName.FRIENDS },
  },
]
</script>

<template>
  <div class="bottom-menu-component">
    <RouterLink
      v-for="item in items"
      :key="item.to.name"
      :to="item.to"
      class="section"
    >
      <BIcon :name="item.icon" class="icon" />
    </RouterLink>

    <div class="section" @click="menuShowed = !menuShowed">
      <BIcon name="list" class="icon" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '../src/shared/styles/mixins';
@use '../src/shared/styles/constants';
@use '../src/shared/styles/transitions';

.bottom-menu-component {
  padding: 10px 20px 0;
  display: flex;
  justify-content: center;
  gap: 10px;
  box-shadow: constants.$cmn-shadow-block;
  overflow: hidden;
  background-color: rgb(constants.$clr-background);

  .section {
    padding: 20px;
    display: flex;
    border-radius: 10px 10px 0 0;
    transition: constants.$trn-normal-out;

    .icon {
      margin: auto;
      font-size: 22px;
      color: rgb(constants.$clr-text-inactive);
      transition: constants.$trn-normal-out;
    }

    &:not(.router-link-active) {
      @mixin hovered {
        box-shadow: constants.$cmn-shadow-element;
        transform: scale(1.01);
        background: rgb(constants.$clr-secondary);
        transition: constants.$trn-fast-in;

        .icon {
          transform: scale(1.1);
          color: rgb(constants.$clr-text);
          transition: constants.$trn-fast-in;
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

    &.router-link-active {
      background: rgb(constants.$clr-primary);

      .icon {
        transform: scale(1.1);
        color: rgb(constants.$clr-background);
      }
    }
  }
}
</style>
