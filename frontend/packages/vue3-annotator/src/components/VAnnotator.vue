<template>
  <div :id="`container-${uuid}`" @click="open" @touchend="open">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="0" height="0">
      <defs>
        <marker
          id="v-annotator-arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" stroke="#74b8dc" fill="#74b8dc" />
        </marker>
      </defs>
    </svg>
    <RecycleScroller page-mode class="scroller" :items="items">
      <template v-slot="{ item, index }">
        <v-line
          :annotator-uuid="uuid"
          :dark="dark"
          :entities="entityList.filterByRange(item.textLine.startOffset, item.textLine.endOffset)"
          :entityLabels="entityLabelList"
          :relations="
            relationList.filterByRange(item.textLine.startOffset, item.textLine.endOffset)
          "
          :maxLabelLength="maxLabelLength"
          :relationLabels="relationLabelList"
          :font="font"
          :rtl="rtl"
          :selected-entities="highlightedEntities"
          :selected-relation="selectedRelation"
          :text="text"
          :textLine="item.textLine"
          :base-x="baseX"
          :left="left"
          :right="right"
          :key="`${index}:${rtl}`"
          @click:entity="clicked"
          @click:relation="onRelationClicked"
          @contextmenu:entity="$emit('contextmenu:entity', $event)"
          @contextmenu:relation="$emit('contextmenu:relation', $event)"
          @update:height="updateHeight"
          @setSelectedEntity="selectedEntity = $event"
          @setSelectedRelation="selectedRelation = $event"
        />
      </template>
    </RecycleScroller>
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
      <text :id="`text-${uuid}`" style="white-space: pre" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { debounce } from '@/utils/debounce'
import { v4 as uuidv4 } from 'uuid'
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import VLine from './VLine.vue'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { RecycleScroller } from 'vue-virtual-scroller'
import { Text } from '@/domain/models/Label/Text'
import {
  type Label,
  LabelList,
  EntityLabelListItem,
  RelationLabelListItem,
} from '@/domain/models/Label/Label'
import { Entities, type Entity } from '@/domain/models/Label/Entity'
import { Font } from '@/domain/models/Line/Font'
import { widthOf } from '@/domain/models/Line/Utils'
import { LineWidthManager } from '../domain/models/Line/WidthManager'
import type { TextLine } from '@/domain/models/Line/LineText'
import { TextLineSplitter } from '@/domain/models/Line/LineSplitter'
import { TextSelector } from '@/domain/models/EventHandler/TextSelectionHandler'
import { RelationList, type Relation, type RelationListItem } from '@/domain/models/Label/Relation'

interface ViewLine {
  id: string
  textLine: TextLine
  size: number
}

const props = withDefaults(
  defineProps<{
    maxLabelLength?: number
    text: string
    entities: Entity[]
    entityLabels: Label[]
    relations?: Relation[]
    relationLabels?: Label[]
    allowOverlapping?: boolean
    rtl?: boolean
    graphemeMode?: boolean
    dark?: boolean
    selectedEntities?: Entity[]
  }>(),
  {
    maxLabelLength: 12,
    text: '',
    entities: () => [],
    entityLabels: () => [],
    relations: () => [],
    relationLabels: () => [],
    allowOverlapping: false,
    rtl: false,
    graphemeMode: true,
    dark: false,
    selectedEntities: () => [],
  },
)

const emit = defineEmits<{
  'add:entity': [event: Event, startOffset: number, endOffset: number]
  'click:entity': [event: Event, id: number]
  'click:relation': [event: Event, relation: RelationListItem]
  'contextmenu:entity': [entity: Entity]
  'contextmenu:relation': [relation: RelationListItem]
}>()

const uuid = uuidv4()
const font = ref<Font | null>(null)
const heights = reactive<{ [id: string]: number }>({})
const maxWidth = ref(-1)
const baseX = ref(0)
const left = ref(0)
const right = ref(0)
const textElement = ref<SVGTextElement | null>(null)
const selectedRelation = ref<RelationListItem | null>(null)
const selectedEntity = ref<Entity | null>(null)

const setMaxWidthDebounced = debounce(() => {
  const containerElement = document.getElementById(`container-${uuid}`)!
  maxWidth.value = containerElement.clientWidth
  const rect = containerElement.getBoundingClientRect()
  left.value = rect.left
  right.value = rect.right - rect.left
  baseX.value = !props.rtl ? 0 : right.value
}, 500)

onMounted(() => {
  textElement.value = document.getElementById(`text-${uuid}`) as unknown as SVGTextElement
  window.addEventListener('resize', setMaxWidth)
  setMaxWidth()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', setMaxWidth)
  setMaxWidthDebounced.cancel()
})

watch(
  () => props.text,
  () => {
    for (const id of Object.keys(heights)) {
      delete heights[id]
    }
    nextTick(() => {
      textElement.value ||= document.getElementById(`text-${uuid}`) as unknown as SVGTextElement
      if (!textElement.value) {
        return
      }
      font.value = Font.create(props.text, textElement.value!)
    })
  },
  { immediate: true },
)

watch(
  () => props.rtl,
  () => {
    setMaxWidth()
  },
)

const _text = computed(() => new Text(props.text))
const entityLabelList = computed<LabelList | null>(() => {
  if (textElement.value) {
    const widths = props.entityLabels.map((label) => widthOf(label.text, textElement.value!))
    return LabelList.valueOf(props.maxLabelLength, props.entityLabels, widths, EntityLabelListItem)
  } else {
    return null
  }
})
const relationLabelList = computed<LabelList | null>(() => {
  if (textElement.value) {
    const widths = props.relationLabels.map((label) => widthOf(label.text, textElement.value!))
    return LabelList.valueOf(
      props.maxLabelLength,
      props.relationLabels,
      widths,
      RelationLabelListItem,
    )
  } else {
    return null
  }
})
const items = computed<ViewLine[]>(() => {
  const viewLines: ViewLine[] = []
  for (let i = 0; i < textLines.value.length; i++) {
    const id = `${textLines.value[i].startOffset}:${textLines.value[i].endOffset}`
    viewLines.push({
      id,
      textLine: textLines.value[i],
      size: heights[id] || 64,
    })
  }
  return viewLines
})
const entityList = computed<Entities>(() => {
  resetSelection()
  if (props.graphemeMode) {
    return Entities.valueOf(props.entities, _text.value)
  } else {
    return Entities.valueOf(props.entities)
  }
})
const relationList = computed<RelationList>(() => {
  resetSelection()
  return new RelationList(props.relations, entityList.value)
})
const textLines = computed<TextLine[]>(() => {
  if (!font.value || !entityLabelList.value || maxWidth.value === -1) {
    return []
  } else {
    const maxLabelWidth = entityLabelList.value.maxLabelWidth
    const calculator = new LineWidthManager(maxWidth.value, maxLabelWidth)
    const splitter = new TextLineSplitter(calculator, font.value)
    return splitter.split(_text.value)
  }
})
const highlightedEntities = computed<Entity[]>(() => {
  if (selectedEntity.value) {
    return props.selectedEntities.concat(selectedEntity.value)
  } else {
    return props.selectedEntities
  }
})

function clicked(event: Event, entity: Entity) {
  emit('click:entity', event, entity.id)
}

function onRelationClicked(event: Event, relation: RelationListItem) {
  emit('click:relation', event, relation)
}

function setMaxWidth() {
  nextTick(setMaxWidthDebounced)
}

function updateHeight(id: string, height: number) {
  heights[id] = height
}

function resetSelection() {
  selectedRelation.value = null
  selectedEntity.value = null
}

function open(event: Event): void {
  try {
    const selector = new TextSelector(props.allowOverlapping, props.graphemeMode)
    const [startOffset, endOffset] = selector.getOffsets(entityList.value, _text.value)
    emit('add:entity', event, startOffset, endOffset)
  } catch (e) {
    return
  }
}
</script>

<style scoped>
#container {
  width: 100%;
  height: 100vh;
}
.scroller >>> .vue-recycle-scroller__item-wrapper {
  height: 100vh;
}
</style>
