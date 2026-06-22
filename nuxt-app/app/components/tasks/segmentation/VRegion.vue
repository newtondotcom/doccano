<template>
  <v-group>
    <TasksSegmentationVPolygon
      :polygon="writablePolygon"
      :closed="true"
      :color="color"
      :draggable="true"
      :highlight-id="highlightId"
      :max-height="maxHeight"
      :max-width="maxWidth"
      :scale="scale"
      @click="$emit('click-polygon', writablePolygon)"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
    />
    <v-circle
      ref="anchorRef"
      :config="{
        x: -10,
        y: -10,
        radius: 5,
        fill: 'white',
        stroke: 'black',
        scaleX: 1 / (scale || 1),
        scaleY: 1 / (scale || 1)
      }"
    />
    <template v-if="isSelected && !isMoving">
      <v-line
        v-for="(lineSegment, insertIndex) in writablePolygon.lineSegments"
        :key="insertIndex"
        :config="{
          draggable: false,
          hitStrokeWidth: 10,
          lineJoin: 'round',
          opacity: 1,
          points: lineSegment.points,
          stroke: 'transparent',
          strokeWidth: 5,
          strokeScaleEnabled: false
        }"
        @mousemove="onMouseMoveLine($event, lineSegment)"
        @mouseleave="hideAnchorPoint"
        @click="handleClickLine($event, writablePolygon, insertIndex + 1)"
      />
      <TasksSegmentationVPoint
        v-for="(point, index) in writablePolygon.toPoints()"
        :key="`${writablePolygon.id}-${index}`"
        :color="index === selectedPoint ? color : 'white'"
        :point="point"
        :index="index"
        :max-width="maxWidth"
        :max-height="maxHeight"
        :scale="scale"
        @click="$emit('click-point', index)"
        @dragstart="hideAnchorPoint"
        @dragmove="handleDragMovePoint"
        @dragend="handleDragEndPoint"
        @dblclick="handleDoubleClickPoint"
      />
    </template>
  </v-group>
</template>

<script setup lang="ts">
import Konva from 'konva'
import Flatten from '@flatten-js/core'
import Polygon from '@/domain/models/tasks/segmentation/Polygon'
import LineSegment from '@/domain/models/tasks/segmentation/LineSegment'
import { transform } from '@/domain/models/tasks/shared/Scaler'
import Point = Flatten.Point

const props = withDefaults(
  defineProps<{
    polygon: Polygon
    color?: string
    maxWidth?: number
    maxHeight?: number
    scale?: number
    highlightId?: string
    isSelected?: boolean
    selectedPoint?: number
  }>(),
  {
    color: '#00FF00',
    maxWidth: 0,
    maxHeight: 0,
    scale: 1,
    highlightId: '',
    isSelected: false,
    selectedPoint: -1
  }
)

const emit = defineEmits<{
  'click-polygon': [polygon: Polygon]
  'click-point': [index: number]
  'drag-end-polygon': [polygon: Polygon, dx: number, dy: number]
  'drag-end-point': [polygon: Polygon, index: number, x: number, y: number]
  'double-click-point': [polygon: Polygon, index: number]
  'click-line': [polygon: Polygon, index: number, x: number, y: number]
}>()

const isMoving = ref(false)
const writablePolygon = ref(props.polygon)
const anchorRef = ref<{ getNode: () => Konva.Shape }>()

const anchor = computed(() => anchorRef.value!.getNode())

watch(
  () => props.polygon,
  (newPolygon: Polygon) => {
    writablePolygon.value = newPolygon
  },
  { immediate: true, deep: true }
)

function onDragStart() {
  isMoving.value = true
}

function onDragEnd(polygon: Polygon, dx: number, dy: number) {
  isMoving.value = false
  emit('drag-end-polygon', polygon, dx, dy)
}

function handleDragMovePoint(index: number, x: number, y: number) {
  writablePolygon.value.movePoint(index, x, y)
  writablePolygon.value = writablePolygon.value.clone()
}

function handleDragEndPoint(index: number, x: number, y: number) {
  emit('drag-end-point', props.polygon, index, x, y)
}

function handleDoubleClickPoint(index: number) {
  emit('double-click-point', props.polygon, index)
}

function onMouseMoveLine(e: Konva.KonvaEventObject<MouseEvent>, lineSegment: LineSegment) {
  const { offsetX, offsetY } = e.evt
  const { x: stageX = 0, y: stageY = 0 } = e.target.getStage()!.attrs
  const x = transform(offsetX, stageX, props.scale)
  const y = transform(offsetY, stageY, props.scale)
  const point = new Point(x, y)
  const closestPoint = lineSegment.getClosestPoint(point)
  showAnchorPoint(closestPoint.x, closestPoint.y)
}

function handleClickLine(e: Konva.KonvaEventObject<MouseEvent>, polygon: Polygon, index: number) {
  const { offsetX, offsetY } = e.evt
  const { x: stageX = 0, y: stageY = 0 } = e.target.getStage()!.attrs
  const x = transform(offsetX, stageX, props.scale)
  const y = transform(offsetY, stageY, props.scale)
  hideAnchorPoint()
  emit('click-line', polygon, index, x, y)
}

function showAnchorPoint(x: number, y: number) {
  anchor.value.to({ x, y, duration: 0 })
  anchor.value.show()
}

function hideAnchorPoint() {
  anchor.value.to({ x: -10, y: -10, duration: 0 })
  anchor.value.hide()
}
</script>
