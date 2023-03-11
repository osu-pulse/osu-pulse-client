<script lang="ts" setup>
import { ref } from 'vue'
import { useSearchTracks } from '@/library/stores/search-tracks'
import { useDebounceRef } from '@/shared/hooks/debounce-ref'
import BIcon from '@/shared/components/BIcon.vue'
import SecondaryButton from '@/shared/components/SecondaryButton.vue'

const { search, loading } = useSearchTracks()
const searchDebounced = useDebounceRef(search, { debounce: 200 })
function handleInput(event: InputEvent) {
  const target = event.target as HTMLInputElement
  searchDebounced.value = target.value
}

const focused = ref(false)
</script>

<template>
  <div class="search-tracks-field-component" :class="{ _active: focused || searchDebounced }">
    <BIcon class="search-icon" name="search" />

    <div class="input-container">
      <Transition>
        <label v-show="!searchDebounced" class="label">Search songs...</label>
      </Transition>

      <input
        v-model="searchDebounced"
        class="input"
        @focus="focused = true"
        @blur="focused = false"
        @input="handleInput"
      >
    </div>

    <Transition>
      <SecondaryButton
        v-show="searchDebounced"
        :loading="loading"
        class="clear-btn"
        icon="x-lg"
        @click="searchDebounced = ''"
      />
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '../../shared/styles/mixins';
@use '../../shared/styles/constants';
@use '../../shared/styles/transitions';

.search-tracks-field-component {
  flex: none;
  height: 44px;
  padding: 0 12px 0 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: constants.$cmn-border-radius;
  transition: constants.$trn-normal-out;

  .input-container {
    position: relative;
    flex: 1;

    .label {
      @include transitions.fade();
      position: absolute;
      left: 10px;
      font-size: 18px;
      color: rgb(constants.$clr-text-inactive);
      pointer-events: none;
      transition: constants.$trn-fast-out;

      &.v-leave-to {
        transform: translateX(10px);
      }
    }

    .input {
      @include mixins.size(fill);
      font-size: 18px;
      background: none;
      border: none;
      outline: none;
    }
  }

  .search-icon {
    font-size: 18px;
    color: rgb(constants.$clr-text-inactive);
    transition: constants.$trn-fast-out;
  }

  .clear-btn {
    @include transitions.fade();
  }

  &._active {
    background: rgb(constants.$clr-background);
    box-shadow: constants.$cmn-shadow-block;

    .search-icon {
      color: rgb(constants.$clr-text);
    }

  }
}
</style>
