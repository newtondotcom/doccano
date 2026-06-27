<template>
  <v-rect
    :config="{
      id: rect.id,
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      opacity: 0.6,
      stroke: strokeColor,
      fill: color,
      strokeWidth,
      draggable: true,
      dragBoundFunc,
    }"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @transformend="$emit('transformend', $event)"
  />
</template>

<script setup lang="ts">
import Konva from "konva";
import { inverseTransform, transform } from "@/domain/models/tasks/shared/Scaler";
import Rectangle from "@/domain/models/tasks/boundingbox/Rectangle";

const props = withDefaults(
  defineProps<{
    rect: Rectangle;
    color?: string;
    draggable?: boolean;
    highlightId?: string;
    opacity?: number;
    scale: number;
    maxWidth: number;
    maxHeight: number;
  }>(),
  {
    color: "#00FF00",
    draggable: true,
    highlightId: "uuid",
    opacity: 0.6,
  },
);

const emit = defineEmits<{
  dragend: [rect: Rectangle];
  transformend: [event: Konva.KonvaEventObject<Event>];
}>();

const stageX = ref(0);
const stageY = ref(0);
const originX = ref(0);
const originY = ref(0);

const strokeColor = computed(() =>
  props.rect.id === props.highlightId ? "#ff0000" : `${props.color}CC`,
);

const strokeWidth = computed(() => (props.rect.id === props.highlightId ? 5 : 1));

function dragBoundFunc(pos: { x: number; y: number }) {
  const [minX, minY, maxX, maxY] = props.rect.minMaxPoints();
  let x = transform(pos.x, stageX.value, props.scale);
  let y = transform(pos.y, stageY.value, props.scale);
  x -= originX.value;
  y -= originY.value;
  if (minY + y < 0) y = -minY;
  if (minX + x < 0) x = -minX;
  if (maxY + y > props.maxHeight) y = props.maxHeight - maxY;
  if (maxX + x > props.maxWidth) x = props.maxWidth - maxX;
  x += originX.value;
  y += originY.value;
  x = inverseTransform(x, stageX.value, props.scale);
  y = inverseTransform(y, stageY.value, props.scale);
  return { x, y };
}

function onDragStart(e: Konva.KonvaEventObject<DragEvent>) {
  originX.value = e.target.attrs.x;
  originY.value = e.target.attrs.y;
  const { x = 0, y = 0 } = e.target.getStage()!.attrs;
  stageX.value = x;
  stageY.value = y;
}

function onDragEnd(e: Konva.KonvaEventObject<DragEvent>) {
  const { x, y } = e.target.attrs;
  const newRect = props.rect.transform(x, y, props.rect.width, props.rect.height);
  emit("dragend", newRect);
}
</script>
