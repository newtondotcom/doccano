<template>
  <line
    :x1="_x1"
    :y1="y"
    :x2="_x2"
    :y2="y"
    :stroke="color"
    :stroke-width="height"
    stroke-linecap="round"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    x1?: number
    x2?: number
    y?: number
    height?: number
    color?: string
  }>(),
  {
    x1: 0,
    x2: 0,
    y: 0,
    height: 5,
    color: '',
  },
)

const _x1 = computed(() => {
  const x = props.x1 < props.x2 ? props.x1 : props.x2
  return x + props.height / 2
})

const _x2 = computed(() => {
  const x = props.x1 < props.x2 ? props.x2 : props.x1
  return x - props.height / 2
})
</script>
