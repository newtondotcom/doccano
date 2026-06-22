<template>
  <v-stage ref="stageRef" :config="{ ...configStage, dragBoundFunc }" @mousedown="onMouseDown">
    <v-layer>
      <TasksImageBaseImage :image-url="imageUrl" @loaded="imageLoaded" />
    </v-layer>
    <v-layer>
      <TasksSegmentationVEditingRegion
        v-if="!!editingPolygon"
        :polygon="editingPolygon"
        :color="editingPolygon.getColor(labels)"
        :max-width="imageSize.width"
        :max-height="imageSize.height"
        :scale="scale"
        @drag-end-polygon="translatePolygon"
        @mouse-over-start-point="onMouseOverStartPoint"
        @mouse-out-start-point="onMouseOutStartPoint"
        @drag-point="movePoint"
        @double-click-point="removePoint"
      />
    </v-layer>
    <v-layer>
      <TasksSegmentationVRegion
        v-for="(polygon, index) in readonlyPolygons"
        :key="`polygon-${index}`"
        :polygon="polygon"
        :highlight-id="highlightId"
        :is-selected="polygon.id === selectedPolygon"
        :selected-point="selectedPoint"
        :max-width="imageSize.width"
        :max-height="imageSize.height"
        :scale="scale"
        :color="polygon.getColor(labels)"
        @click-point="updateSelectedPoint"
        @click-line="insertPoint"
        @click-polygon="updateSelectedPolygon"
        @drag-end-polygon="translatePolygon"
        @drag-end-point="movePoint"
        @double-click-point="removePoint"
      />
    </v-layer>
  </v-stage>
</template>

<script setup lang="ts">
import Konva from 'konva'
import Polygon from '@/domain/models/tasks/segmentation/Polygon'
import PolygonProps from '@/domain/models/tasks/segmentation/PolygonProps'
import LabelProps from '@/domain/models/tasks/shared/LabelProps'
import { transform } from '@/domain/models/tasks/shared/Scaler'

const props = withDefaults(
  defineProps<{
    imageUrl: string
    labels: LabelProps[]
    polygons: PolygonProps[]
    selectedLabel?: LabelProps
    scale?: number
    highlightId?: string
  }>(),
  {
    selectedLabel: undefined,
    scale: 1,
    highlightId: 'uuid'
  }
)

const emit = defineEmits<{
  'add-polygon': [props: PolygonProps]
  'select-polygon': [id: string | null]
  'update-polygon': [props: PolygonProps]
  'delete-polygon': [id: string]
  'update-scale': [scale: number]
}>()

const imageSize = reactive({
  width: 0,
  height: 0
})
const editingPolygon = ref<Polygon | null>(null)
const isMouseOverStartPoint = ref(false)
const selectedPolygon = ref<string | null>(null)
const selectedPoint = ref(-1)
const configStage = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
  draggable: true
})
const stageRef = ref<{ getNode: () => Konva.Stage }>()
const stage = ref({} as Konva.Stage)

const readonlyPolygons = computed(() =>
  props.polygons.map((p: PolygonProps) => new Polygon(p.label, p.points, p.id))
)

const rootEl = computed(() => (stageRef.value as any)?.$el as HTMLElement | undefined)

watch(
  () => props.scale,
  () => {
    setZoom()
  }
)

onMounted(() => {
  document.addEventListener('keydown', removePointOrPolygon)
  window.addEventListener('resize', setZoom)
  stage.value = stageRef.value!.getNode()
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', removePointOrPolygon)
  window.removeEventListener('resize', setZoom)
})

function onMouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
  if (e.target instanceof Konva.Image) {
    selectedPolygon.value = null
  }
  if (!props.selectedLabel) {
    return
  }
  if (e.target instanceof HTMLCanvasElement) {
    return
  }
  if (e.target instanceof Konva.Line) {
    return
  }
  if (e.target instanceof Konva.Circle) {
    if (isMouseOverStartPoint.value && editingPolygon.value && editingPolygon.value.canBeClosed()) {
      emit('add-polygon', editingPolygon.value.toProps())
      editingPolygon.value = null
    }
    return
  }

  const pos = stage.value.getPointerPosition()!
  const { x: stageX = 0, y: stageY = 0 } = stage.value.attrs
  pos.x = transform(pos.x, stageX, props.scale)
  pos.y = transform(pos.y, stageY, props.scale)
  if (!editingPolygon.value) {
    editingPolygon.value = new Polygon(props.selectedLabel.id, [pos.x, pos.y])
  } else {
    editingPolygon.value.addPoint(pos.x, pos.y)
  }
}

function onMouseOverStartPoint() {
  isMouseOverStartPoint.value = true
}

function onMouseOutStartPoint() {
  isMouseOverStartPoint.value = false
}

function updateSelectedPolygon(polygon: Polygon) {
  selectedPoint.value = -1
  if (selectedPolygon.value === polygon.id) {
    selectedPolygon.value = null
  } else {
    selectedPolygon.value = polygon.id
  }
  emit('select-polygon', selectedPolygon.value)
}

function updateSelectedPoint(point: number) {
  if (selectedPoint.value === point) {
    selectedPoint.value = -1
  } else {
    selectedPoint.value = point
  }
}

function insertPoint(polygon: Polygon, index: number, x: number, y: number) {
  polygon.insertPoint(x, y, index)
  emit('update-polygon', polygon.toProps())
}

function translatePolygon(polygon: Polygon, dx: number, dy: number) {
  polygon.translate(dx, dy)
  emit('update-polygon', polygon.toProps())
}

function movePoint(polygon: Polygon, index: number, x: number, y: number) {
  polygon.movePoint(index, x, y)
  emit('update-polygon', polygon.toProps())
}

function removePoint(polygon: Polygon, index: number) {
  polygon.removePoint(index)
  emit('update-polygon', polygon.toProps())
}

function removePointOrPolygon(e: KeyboardEvent) {
  if (e.key === 'Backspace' || e.key === 'Delete') {
    if (selectedPoint.value !== -1) {
      const polygon = readonlyPolygons.value.find((p) => p.id === selectedPolygon.value)
      removePoint(polygon!, selectedPoint.value)
      selectedPoint.value = -1
      return
    }
    if (selectedPolygon.value !== null) {
      emit('delete-polygon', selectedPolygon.value)
      selectedPolygon.value = null
    }
  }
}

function dragBoundFunc(pos: { x: number; y: number }) {
  const { stageX = 0, stageY = 0 } = stage.value.attrs
  let x = pos.x - stageX
  let y = pos.y - stageY
  const paddingX = imageSize.width * props.scale - configStage.width
  const paddingY = imageSize.height * props.scale - configStage.height
  if (paddingX + x < 0) x = -paddingX
  if (paddingY + y < 0) y = -paddingY
  if (configStage.width + paddingX + x > imageSize.width * props.scale) x = 0
  if (configStage.height + paddingY + y > imageSize.height * props.scale) y = 0
  x += stageX
  y += stageY
  return { x, y }
}

function imageLoaded(width: number, height: number) {
  const maxScale = rootEl.value!.clientWidth / width
  const imageIsSmallerThanContainer = maxScale > 1
  imageSize.width = width
  imageSize.height = height
  if (imageIsSmallerThanContainer) {
    configStage.width = width
    configStage.height = height
    stage.value.scale({ x: 1, y: 1 })
    emit('update-scale', 1)
  } else {
    configStage.width = width * maxScale
    configStage.height = height * maxScale
    stage.value.scale({ x: maxScale, y: maxScale })
    emit('update-scale', maxScale)
  }
  stage.value.draw()
}

function setZoom() {
  if (props.scale < 0) {
    return
  }
  const maxScale = rootEl.value!.clientWidth / imageSize.width
  stage.value.scale({ x: props.scale, y: props.scale })
  if (props.scale <= maxScale) {
    configStage.width = imageSize.width * props.scale
  } else {
    configStage.width = imageSize.width * maxScale
  }
  configStage.height = imageSize.height * props.scale
  rootEl.value!.setAttribute('style', `min-height: ${configStage.height}px`)
}
</script>
