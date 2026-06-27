<template>
  <v-line
    :config="{
      id: polygon.id,
      points: polygon.flattenedPoints,
      closed: closed,
      draggable: true,
      opacity: 0.6,
      stroke: strokeColor,
      strokeWidth,
      fill: color,
      dragBoundFunc,
    }"
    @click="click"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @mouseenter="mouseEnter"
    @mouseleave="mouseLeave"
  />
</template>

<script setup lang="ts">
import Konva from "konva";
import Polygon from "@/domain/models/tasks/segmentation/Polygon";
import { transform, inverseTransform } from "@/domain/models/tasks/shared/Scaler";

const props = withDefaults(
  defineProps<{
    polygon: Polygon;
    color?: string;
    closed?: boolean;
    draggable?: boolean;
    opacity?: number;
    scale?: number;
    maxWidth?: number;
    maxHeight?: number;
    highlightId?: string;
  }>(),
  {
    color: "#00FF00",
    closed: false,
    draggable: false,
    opacity: 0.6,
    scale: 1,
    maxWidth: 0,
    maxHeight: 0,
    highlightId: "uuid",
  },
);

const emit = defineEmits<{
  dragstart: [];
  dragend: [polygon: Polygon, dx: number, dy: number];
  click: [id: string];
}>();

const stageX = ref(0);
const stageY = ref(0);
const originX = ref(0);
const originY = ref(0);

const strokeColor = computed(() =>
  props.polygon.id === props.highlightId ? "#ff0000" : `${props.color}CC`,
);

const strokeWidth = computed(() => (props.polygon.id === props.highlightId ? 5 : 1));

function onDragStart(e: Konva.KonvaEventObject<DragEvent>) {
  originX.value = e.target.x();
  originY.value = e.target.y();
  const { x = 0, y = 0 } = e.target.getStage()!.attrs;
  stageX.value = x;
  stageY.value = y;
  emit("dragstart");
}

function dragBoundFunc(pos: { x: number; y: number }) {
  let x = transform(pos.x, stageX.value, props.scale);
  let y = transform(pos.y, stageY.value, props.scale);
  const [minX, minY, maxX, maxY] = props.polygon.minMaxPoints();
  if (minY + y < 0) y = -1 * minY;
  if (minX + x < 0) x = -1 * minX;
  if (maxY + y > props.maxHeight) y = props.maxHeight - maxY;
  if (maxX + x > props.maxWidth) x = props.maxWidth - maxX;
  x = inverseTransform(x, stageX.value, props.scale);
  y = inverseTransform(y, stageY.value, props.scale);
  return { x, y };
}

function onDragEnd(e: Konva.KonvaEventObject<DragEvent>) {
  const dx = e.target.x() - originX.value;
  const dy = e.target.y() - originY.value;
  e.target.move({ x: -dx, y: -dy });
  emit("dragend", props.polygon, dx, dy);
}

function click(id: string) {
  emit("click", id);
}

function mouseEnter(e: Konva.KonvaEventObject<MouseEvent>) {
  e.target.getStage()!.container().style.cursor = "pointer";
}

function mouseLeave(e: Konva.KonvaEventObject<MouseEvent>) {
  e.target.getStage()!.container().style.cursor = "default";
}
</script>
