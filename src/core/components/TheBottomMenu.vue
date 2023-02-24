<script lang="ts" setup>
import {
  useVModel,
} from '@vueuse/core'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import { RouteName } from '@/shared/constants/route-name'
import type { BottomMenuItem } from '@/core/types/bottom-menu-item'
import SecondaryPanel from '@/shared/components/SecondaryPanel.vue'

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
    <SecondaryPanel
      v-for="item in items"
      :key="item.to.name"
      class="panel"
      :icon="item.icon"
      :to="item.to"
      :active="item.to.name === route.name"
    />

    <SecondaryPanel class="panel" icon="list" @click="menuShowed = !menuShowed" />
  </div>
</template>

<style lang="scss" scoped>
@use '../src/shared/styles/mixins';
@use '../src/shared/styles/constants';
@use '../src/shared/styles/transitions';

.bottom-menu-component {
  min-width: max-content;
  padding: 10px 20px 0;
  display: flex;
  justify-content: space-around;
  gap: 10px;
  box-shadow: constants.$cmn-shadow-block;
  overflow-y: hidden;
  background-color: rgb(constants.$clr-background);

  .panel {
    padding: 16px;
    border-radius: 10px 10px 0 0;

    &._active {
      pointer-events: none;
    }

    ::v-deep(.icon) {
      font-size: 18px;
    }
  }
}
</style>
