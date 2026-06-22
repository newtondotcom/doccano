<template>
  <v-stage
    ref="stageRef"
    :config="{ ...configStage, dragBoundFunc }"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @mousemove="onMouseMove"
  >
    <v-layer>
      <TasksImageBaseImage :image-url="imageUrl" @loaded="imageLoaded" />
    </v-layer>
    <v-layer>
      <TasksBoundingBoxVRectangle
        v-for="rect in annotationsToDraw"
        :key="rect.id"
        :rect="rect"
        :color="rect.getColor(labels)"
        :highlight-id="highlightId"
        :max-width="imageSize.width"
        :max-height="imageSize.height"
        :scale="scale"
        @dragend="onDragEnd"
        @transformend="handleTransformEnd"
      />
      <v-transformer
        ref="transformerRef"
        :config="{
          rotateEnabled: false,
          flipEnabled: false,
          keepRatio: false,
          boundBoxFunc
        }"
      />
    </v-layer>
  </v-stage>
</template>

<script setup lang="ts">
import Konva from 'konva'
import { Box } from 'konva/lib/shapes/Transformer.d'
import Rectangle from '@/domain/models/tasks/boundingbox/Rectangle'
import RectangleProps from '@/domain/models/tasks/boundingbox/RectangleProps'
import LabelProps from '@/domain/models/tasks/shared/LabelProps'
import { inverseTransform, transform } from '@/domain/models/tasks/shared/Scaler'

const props = withDefaults(
  defineProps<{
    imageUrl: string
    labels: LabelProps[]
    rectangles: RectangleProps[]
    selectedLabel?: LabelProps
    scale: number
    highlightId?: string
  }>(),
  {
    selectedLabel: undefined,
    highlightId: 'uuid'
  }
)

const emit = defineEmits<{
  'select-rectangle': [id: string | null]
  'add-rectangle': [props: RectangleProps]
  'update-rectangle': [props: RectangleProps]
  'delete-rectangle': [id: string]
  'update-scale': [scale: number]
}>()

const selectedRectangle = ref<string | null>(null)
const newRectangle = ref<Rectangle | null>(null)
const imageSize = reactive({
  width: 0,
  height: 0
})
const configStage = reactive({
  width: window.innerWidth,
  height: window.innerHeight,
  draggable: true
})
const stageRef = ref<{ getNode: () => Konva.Stage; $el: HTMLElement }>()
const transformerRef = ref<{ getNode: () => Konva.Transformer }>()
const stage = ref({} as Konva.Stage)

const annotations = computed(() =>
  props.rectangles.map((r) => new Rectangle(r.label, r.x, r.y, r.width, r.height, r.id))
)

const transformer = computed(() => transformerRef.value!.getNode())

const annotationsToDraw = computed(() => {
  if (newRectangle.value) {
    return annotations.value.concat(newRectangle.value)
  }
  return annotations.value
})

const rootEl = computed(() => stageRef.value?.$el)

watch(
  () => props.scale,
  () => {
    setZoom()
  }
)

watch(
  () => props.imageUrl,
  () => {
    selectedRectangle.value = null
    updateTransformer()
  }
)

onMounted(() => {
  document.addEventListener('keydown', removeRectangle)
  window.addEventListener('resize', setZoom)
  stage.value = stageRef.value!.getNode()
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', removeRectangle)
  window.removeEventListener('resize', setZoom)
})

function updateTransformer() {
  const selectedNode = stage.value.findOne(`#${selectedRectangle.value}`)
  if (selectedNode === transformer.value.getNode()) {
    return
  }

  if (selectedNode) {
    transformer.value.nodes([selectedNode])
  } else {
    transformer.value.nodes([])
  }
  emit('select-rectangle', selectedRectangle.value)
}

function boundBoxFunc(_: Box, newBoundBox: Box) {
  const box = { ...newBoundBox }
  const { x: stageX = 0, y: stageY = 0 } = stage.value.attrs
  box.x = transform(box.x, stageX, props.scale)
  box.y = transform(box.y, stageY, props.scale)
  box.width = transform(box.width, 0, props.scale)
  box.height = transform(box.height, 0, props.scale)
  if (box.x < 0) {
    box.width += box.x
    box.x = 0
  }
  if (box.y < 0) {
    box.height += box.y
    box.y = 0
  }
  if (box.x + box.width > imageSize.width) box.width = imageSize.width - box.x
  if (box.y + box.height > imageSize.height) box.height = imageSize.height - box.y
  box.x = inverseTransform(box.x, stageX, props.scale)
  box.y = inverseTransform(box.y, stageY, props.scale)
  box.width = inverseTransform(box.width, 0, props.scale)
  box.height = inverseTransform(box.height, 0, props.scale)
  return box
}

function onMouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
  if (e.target instanceof Konva.Image) {
    const clickedOutsideOfRectangle = !!selectedRectangle.value
    selectedRectangle.value = null
    updateTransformer()
    if (clickedOutsideOfRectangle) {
      return
    }
  }
  if (e.target instanceof HTMLCanvasElement) {
    return
  }

  const clickedOnTransformer = e.target.getParent().className === 'Transformer'
  if (clickedOnTransformer) {
    return
  }

  if (e.target instanceof Konva.Rect) {
    const rectId = e.target.id()
    const rect = annotations.value.find((r) => r.id === rectId)
    if (rect && !selectedRectangle.value) {
      selectedRectangle.value = rectId
    } else {
      selectedRectangle.value = null
    }
    updateTransformer()
    return
  }

  if (!newRectangle.value && !!props.selectedLabel) {
    configStage.draggable = false
    const pos = stage.value.getPointerPosition()!
    const { x: stageX = 0, y: stageY = 0 } = stage.value.attrs
    pos.x = transform(pos.x, stageX, props.scale)
    pos.y = transform(pos.y, stageY, props.scale)
    newRectangle.value = new Rectangle(props.selectedLabel.id, pos.x, pos.y, 0, 0)
  }
}

function onMouseUp() {
  if (newRectangle.value && newRectangle.value.exists()) {
    const pos = stage.value.getPointerPosition()!
    const { x: stageX = 0, y: stageY = 0 } = stage.value.attrs
    pos.x = transform(pos.x, stageX, props.scale)
    pos.y = transform(pos.y, stageY, props.scale)
    let x = newRectangle.value.x
    let y = newRectangle.value.y
    let width = pos.x - x
    let height = pos.y - y
    if (width < 0) {
      x += width
      width = -width
    }
    if (height < 0) {
      y += height
      height = -height
    }
    const annotationToAdd = newRectangle.value.transform(x, y, width, height)
    newRectangle.value = null
    configStage.draggable = true
    emit('add-rectangle', annotationToAdd.toProps())
  }
}

function onMouseMove() {
  if (newRectangle.value) {
    const sx = newRectangle.value.x
    const sy = newRectangle.value.y
    const pos = stage.value.getPointerPosition()!
    const { x: stageX = 0, y: stageY = 0 } = stage.value.attrs
    pos.x = transform(pos.x, stageX, props.scale)
    pos.y = transform(pos.y, stageY, props.scale)
    newRectangle.value = newRectangle.value.transform(sx, sy, pos.x - sx, pos.y - sy)
  }
}

function handleTransformEnd(e: Konva.KonvaEventObject<MouseEvent>) {
  const rect = annotations.value.find((r) => r.id === selectedRectangle.value)
  if (rect) {
    const x = e.target.x()
    const y = e.target.y()
    const width = rect.width * e.target.scaleX()
    const height = rect.height * e.target.scaleY()
    const newRect = rect.transform(x, y, width, height)
    e.target.scaleX(1)
    e.target.scaleY(1)
    emit('update-rectangle', newRect.toProps())
  }
}

function onDragEnd(rect: Rectangle) {
  emit('update-rectangle', rect.toProps())
}

function removeRectangle(e: KeyboardEvent) {
  if (e.key === 'Backspace' || e.key === 'Delete') {
    if (selectedRectangle.value !== null) {
      emit('delete-rectangle', selectedRectangle.value)
      selectedRectangle.value = null
      updateTransformer()
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
