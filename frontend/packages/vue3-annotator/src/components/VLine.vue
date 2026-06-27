<template>
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    :direction="direction"
    :id="svgId"
    width="100%"
  >
    <g :transform="translate">
      <BaseRelation
        v-for="relation in lineRelations"
        :key="relation.relation.id"
        :dark="dark"
        :font-size="font.fontSize"
        :x1="relation.x1"
        :x2="relation.x2"
        :level="relation.level"
        :label="relation.label"
        :label-width="relation.labelWidth"
        :marker="relation.marker"
        :max-level="maxRelationLevel"
        :openLeft="relation.openLeft"
        :openRight="relation.openRight"
        :rtl="rtl"
        :margin="left"
        :selected="isSelectedRelation(relation.relation)"
        @click:relation="$emit('click:relation', $event, relation.relation)"
        @contextmenu:relation="$emit('contextmenu:relation', relation.relation)"
        @mouseover="$emit('setSelectedRelation', relation.relation)"
        @mouseleave="$emit('setSelectedRelation', null)"
      />
      <g :transform="translateEntity">
        <BaseText :id="basetextId" :text-line="textLine" :text="text" :x="baseX" />
        <BaseEntity
          v-for="gEntity in geometricEntities"
          :key="gEntity.entity.id"
          :ranges="gEntity.ranges"
          :color="color(gEntity.entity)"
          :label="labelText(gEntity.entity)"
          :no-text="noText(gEntity.entity)"
          :rtl="rtl"
          :margin="left"
          :level="gEntity.level"
          :font-size="font.fontSize"
          :selected="isSelectedEntity(gEntity.entity)"
          @click:entity="$emit('click:entity', $event, gEntity.entity)"
          @contextmenu:entity="$emit('contextmenu:entity', gEntity.entity)"
          @mouseover="$emit('setSelectedEntity', gEntity.entity)"
          @mouseleave="$emit('setSelectedEntity', null)"
        />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { Entity } from '@/domain/models/Label/Entity'
import type { RelationListItem } from '@/domain/models/Label/Relation'
import type { Font } from '@/domain/models/Line/Font'
import type { LabelList } from '@/domain/models/Label/Label'
import type { TextLine } from '@/domain/models/Line/LineText'
import BaseEntity from './BaseEntity.vue'
import BaseText from './BaseText.vue'
import BaseRelation from './BaseRelation.vue'
import { EntityLine, type GeometricEntity } from '@/domain/models/Line/LineEntity'
import { RelationLine, type LineRelation } from '@/domain/models/Line/LineRelation'

const props = withDefaults(
  defineProps<{
    annotatorUuid: string
    entities: Entity[]
    relations?: RelationListItem[]
    textLine: TextLine
    dark?: boolean
    font: Font
    text: string
    entityLabels: LabelList
    relationLabels?: LabelList
    rtl?: boolean
    baseX?: number
    left?: number
    right?: number
    selectedEntities?: Entity[]
    selectedRelation?: RelationListItem | null
  }>(),
  {
    relations: () => [],
    dark: false,
    relationLabels: undefined,
    rtl: false,
    baseX: 0,
    left: 0,
    right: 0,
    selectedEntities: () => [],
    selectedRelation: null,
  },
)

const emit = defineEmits<{
  'click:entity': [event: Event, entity: Entity]
  'click:relation': [event: Event, relation: RelationListItem]
  'contextmenu:entity': [entity: Entity]
  'contextmenu:relation': [relation: RelationListItem]
  setSelectedEntity: [entity: Entity | null]
  setSelectedRelation: [relation: RelationListItem | null]
  'update:height': [id: string, height: number]
}>()

const element = ref<SVGTextElement | null>(null)

onMounted(() => {
  setElement()
})

watch(
  () => props.textLine,
  () => {
    setElement()
  },
  { deep: true },
)

watch(
  () => props.entities,
  () => {
    nextTick(() => {
      const svg = document.getElementById(svgId.value) as unknown as SVGSVGElement | null
      if (!svg) {
        return
      }
      const height = svg.getBBox().height + 30
      svg.setAttribute('style', `height: ${height}px`)
      emit('update:height', id.value, height)
    })
  },
  { deep: true, immediate: true },
)

const translate = computed(() => `translate(0, ${props.font.lineHeight})`)
const geometricEntities = computed<GeometricEntity[]>(() => {
  if (element.value) {
    const view = new EntityLine(props.textLine, props.rtl)
    return view.render(element.value, props.entities, props.entityLabels)
  } else {
    return []
  }
})
const lineRelations = computed<LineRelation[]>(() => {
  const view = new RelationLine(
    props.relations,
    props.relationLabels,
    props.textLine,
    props.left,
    props.right,
  )
  return view.render(geometricEntities.value, props.rtl)
})
const maxRelationLevel = computed(() => Math.max(...lineRelations.value.map((r) => r.level), 0))
const y = computed(() => {
  const level = Math.max(...lineRelations.value.map((item) => item.level))
  if (level < 0) {
    return 0
  } else {
    return 20 + props.font.fontSize * (level + 1.5)
  }
})
const translateEntity = computed(() => `translate(0, ${y.value})`)
const direction = computed(() => (props.rtl ? 'rtl' : 'ltr'))
const id = computed(() => `${props.textLine.startOffset}:${props.textLine.endOffset}`)
const basetextId = computed(() => `basetext-${props.annotatorUuid}-${id.value}`)
const svgId = computed(() => `svg-${props.annotatorUuid}-${id.value}`)

function noText(entity: Entity): boolean {
  // Do not show a label text if the entity continues from the previous line.
  return entity.startOffset < props.textLine.startOffset
}

function setElement() {
  nextTick(() => {
    element.value = document.getElementById(basetextId.value) as unknown as SVGTextElement | null
  })
}

function color(entity: Entity): string {
  return props.entityLabels.getColor(entity.label)!
}

function labelText(entity: Entity): string {
  return props.entityLabels.getText(entity.label)!
}

function isSelectedRelation(relation: RelationListItem): boolean {
  return props.selectedRelation === relation
}

function isSelectedEntity(entity: Entity): boolean {
  if (props.selectedRelation) {
    return props.selectedRelation.consistOf(entity)
  } else {
    return props.selectedEntities.filter((e) => e.id === entity.id).length > 0
  }
}
</script>

<style scoped>
svg {
  overflow-wrap: normal;
}
</style>
