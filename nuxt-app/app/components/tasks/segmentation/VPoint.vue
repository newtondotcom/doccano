<template>
  <v-circle
    :config="{
      x: point.x,
      y: point.y,
      radius: 5,
      fill: color,
      stroke: 'black',
      draggable: true,
      scaleX: 1 / (scale || 1),
      scaleY: 1 / (scale || 1),
      dragBoundFunc
    }"
    v-on="
      index === 0
        ? {
            hitStrokeWidth: 12,
            mouseover: onMouseOverStartPoint,
            mouseout: onMouseOutStartPoint
          }
        : {}
    "
    @click="onClick"
    @dblclick="onDoubleClick"
    @dragstart="onDragStart"
    @dragmove="onDragMove"
    @dragend="onDragEnd"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  />
</template>

<script setup lang="ts">
import Konva from 'konva'
import Flatten from '@flatten-js/core'
import { transform, inverseTransform } from '@/domain/models/tasks/shared/Scaler'
import Point = Flatten.Point

const props = withDefaults(
  defineProps<{
    color?: string
    point: Point
    index: number
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
  click: [index: number]
  dblclick: [index: number]
  dragstart: [index: number]
  dragmove: [index: number, x: number, y: number]
  dragend: [index: number, x: number, y: number]
  mouseover: []
  mouseout: []
}>()

const stageX = ref(0)
const stageY = ref(0)

function dragBoundFunc(pos: { x: number; y: number }) {
  let x = transform(pos.x, stageX.value, props.scale)
  let y = transform(pos.y, stageY.value, props.scale)
  if (x < 0) x = 0
  if (y < 0) y = 0
  if (x > props.maxWidth) x = props.maxWidth
  if (y > props.maxHeight) y = props.maxHeight
  x = inverseTransform(x, stageX.value, props.scale)
  y = inverseTransform(y, stageY.value, props.scale)
  return { x, y }
}

function onClick() {
  emit('click', props.index)
}

function onDoubleClick() {
  emit('dblclick', props.index)
}

function onDragStart(e: Konva.KonvaEventObject<DragEvent>) {
  const { x = 0, y = 0 } = e.target.getStage()!.attrs
  stageX.value = x
  stageY.value = y
  emit('dragstart', props.index)
}

function onDragMove(e: Konva.KonvaEventObject<DragEvent>) {
  const { x, y } = e.target.attrs
  emit('dragmove', props.index, x, y)
}

function onDragEnd(e: Konva.KonvaEventObject<DragEvent>) {
  const { x, y } = e.target.attrs
  emit('dragend', props.index, x, y)
}

function onMouseEnter(e: Konva.KonvaEventObject<MouseEvent>) {
  e.target.getStage()!.container().style.cursor = 'crosshair'
}

function onMouseLeave(e: Konva.KonvaEventObject<MouseEvent>) {
  e.target.getStage()!.container().style.cursor = 'default'
}

function onMouseOverStartPoint(e: Konva.KonvaEventObject<MouseEvent>) {
  e.target.scale({ x: 2 / props.scale, y: 2 / props.scale })
  emit('mouseover')
}

function onMouseOutStartPoint(e: Konva.KonvaEventObject<MouseEvent>) {
  e.target.scale({ x: 1 / props.scale, y: 1 / props.scale })
  emit('mouseout')
}
</script>
