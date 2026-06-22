<template>
  <v-group>
    <TasksSegmentationVPolygon
      :polygon="polygon"
      :closed="false"
      :color="color"
      :draggable="true"
      :max-height="maxHeight"
      :max-width="maxWidth"
      :scale="scale"
      @dragend="onDragEnd"
    />
    <TasksSegmentationVPoint
      v-for="(point, index) in polygon.toPoints()"
      :key="index"
      color="white"
      :point="point"
      :index="index"
      :max-width="maxWidth"
      :max-height="maxHeight"
      :scale="scale"
      @mouseover="onMouseOverStartPoint"
      @mouseout="onMouseOutStartPoint"
      @dragmove="handleDragMovePoint"
      @dblclick="handleDoubleClickPoint"
    />
  </v-group>
</template>

<script setup lang="ts">
import Polygon from '@/domain/models/tasks/segmentation/Polygon'

const props = withDefaults(
  defineProps<{
    polygon: Polygon
    color?: string
    maxWidth?: number
    maxHeight?: number
    scale?: number
  }>(),
  {
    color: '#00FF00',
    maxWidth: 0,
    maxHeight: 0,
    scale: 1
  }
)

const emit = defineEmits<{
  'drag-end-polygon': [polygon: Polygon, dx: number, dy: number]
  'mouse-over-start-point': []
  'mouse-out-start-point': []
  'drag-point': [polygon: Polygon, index: number, x: number, y: number]
  'double-click-point': [polygon: Polygon, index: number]
}>()

function onDragEnd(polygon: Polygon, dx: number, dy: number) {
  emit('drag-end-polygon', polygon, dx, dy)
}

function onMouseOverStartPoint() {
  if (!props.polygon.canBeClosed()) return
  emit('mouse-over-start-point')
}

function onMouseOutStartPoint() {
  emit('mouse-out-start-point')
}

function handleDragMovePoint(index: number, x: number, y: number) {
  emit('drag-point', props.polygon, index, x, y)
}

function handleDoubleClickPoint(index: number) {
  emit('double-click-point', props.polygon, index)
}
</script>
