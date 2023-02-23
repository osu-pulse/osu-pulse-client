<script setup lang="ts">
import { computed } from 'vue'
import SpritePath from 'bootstrap-icons/bootstrap-icons.svg?url'

const props = defineProps<{
  name: string
}>()

const path = computed(() => `${SpritePath}#${props.name}`)
</script>

<template>
  <svg class="b-icon-component" width="1em" height="1em" fill="currentColor">
    <use :xlink:href="path" />
  </svg>
</template>
