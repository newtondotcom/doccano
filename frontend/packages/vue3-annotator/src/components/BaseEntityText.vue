<template>
  <g
    style="cursor: pointer; user-select: none"
    @click="$emit('click:entity', $event)"
    @contextmenu.prevent="$emit('contextmenu:entity')"
  >
    <circle :r="r" :fill="color" :cx="cx" :cy="y" />
    <text :x="x" :y="y" fill="currentColor" :dx="dx" dy="0.35em" v-text="text" />
  </g>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    r: number
    x: number
    y: number
    dx: number
    color: string
    text: string
    rtl?: boolean
  }>(),
  {
    rtl: false,
  },
)

defineEmits<{
  'click:entity': [event: Event]
  'contextmenu:entity': []
}>()

const cx = computed(() => (props.rtl ? props.x - props.r : props.x + props.r))
</script>
