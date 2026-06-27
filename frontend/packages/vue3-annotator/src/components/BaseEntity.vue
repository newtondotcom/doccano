<template>
  <g @mouseover="$emit('mouseover')" @mouseleave="$emit('mouseleave')">
    <BaseEntityLine
      v-for="([x1, x2], index) in coordinates"
      :key="index"
      :x1="x1"
      :x2="x2"
      :y="lineY"
      :color="color"
      :height="height"
    />
    <BaseEntityText
      v-if="!noText"
      :r="r"
      :x="textX"
      :y="textY"
      :dx="dx"
      :rtl="rtl"
      :text="label"
      :color="color"
      @click:entity="$emit('click:entity', $event)"
      @contextmenu:entity="$emit('contextmenu:entity')"
    />
  </g>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseEntityText from './BaseEntityText.vue'
import BaseEntityLine from './BaseEntityLine.vue'
import type { Ranges } from '@/domain/models/Line/LineEntity'
import config from '@/domain/models/Config/Config'

const props = withDefaults(
  defineProps<{
    ranges: Ranges
    color: string
    noText?: boolean
    label: string
    rtl?: boolean
    margin?: number
    level?: number
    fontSize?: number
    selected?: boolean
  }>(),
  {
    noText: false,
    rtl: false,
    margin: 0,
    level: 0,
    fontSize: 17,
    selected: false,
  },
)

defineEmits<{
  'click:entity': [event: Event]
  'contextmenu:entity': []
  mouseover: []
  mouseleave: []
}>()

const x = (x: number) => x - props.margin

const dx = computed(() => (props.rtl ? -config.labelMargin : config.labelMargin))
const r = computed(() => config.radius)
const height = computed(() => (props.selected ? config.lineWidth * 1.5 : config.lineWidth))
const textX = computed(() => (props.rtl ? x(props.ranges.first.x2) : x(props.ranges.first.x1)))
const textY = computed(() => {
  const marginTop = 5
  return lineY.value + props.fontSize / 2 + marginTop
})
const lineY = computed(() => {
  const marginBottom = 8
  return config.lineWidth + (config.lineWidth + props.fontSize + marginBottom) * props.level
})
const coordinates = computed<[number, number][]>(() =>
  props.ranges.items.map((range) => [x(range.x1), x(range.x2)]),
)
</script>
