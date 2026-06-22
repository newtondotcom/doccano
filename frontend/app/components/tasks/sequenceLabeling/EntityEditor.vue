<template>
  <div v-shortkey="['esc']" @shortkey="cleanUp">
    <VAnnotator
      :dark="theme.global.current.value.dark"
      :rtl="rtl"
      :text="text"
      :entities="entities"
      :entity-labels="entityLabels"
      :relations="relations"
      :relation-labels="relationLabels"
      :allow-overlapping="allowOverlapping"
      :grapheme-mode="graphemeMode"
      :selected-entities="selectedEntities"
      @add:entity="handleAddEvent"
      @click:entity="onEntityClicked"
      @click:relation="onRelationClicked"
      @contextmenu:entity="deleteEntity"
      @contextmenu:relation="deleteRelation"
    />
    <TasksSequenceLabelingMenu
      :opened="entityMenuOpened"
      :x="x"
      :y="y"
      :selected-label="currentLabel"
      :labels="entityLabels"
      @close="cleanUp"
      @click:label="addOrUpdateEntity"
    />
    <TasksSequenceLabelingMenu
      :opened="relationMenuOpened"
      :x="x"
      :y="y"
      :selected-label="currentRelationLabel"
      :labels="relationLabels"
      @close="cleanUp"
      @click:label="addOrUpdateRelation"
    />
  </div>
</template>

<script setup lang="ts">
import { VAnnotator } from 'vue3-annotator'
import 'vue3-annotator/dist/vue3-annotator.css'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { SpanDTO } from '@/services/application/tasks/sequenceLabeling/sequenceLabelingData'
import { useTheme } from 'vuetify';

const theme = useTheme()

const props = withDefaults(
  defineProps<{
    dark?: boolean
    rtl?: boolean
    text: string
    entities: SpanDTO[]
    entityLabels: any[]
    relations?: any[]
    relationLabels?: any[]
    allowOverlapping?: boolean
    graphemeMode?: boolean
    selectedLabel?: any
    relationMode?: boolean
  }>(),
  {
    dark: false,
    rtl: false,
    relations: () => [],
    relationLabels: () => [],
    allowOverlapping: false,
    graphemeMode: false,
    relationMode: false
  }
)

const emit = defineEmits<{
  addEntity: [startOffset: number, endOffset: number, labelId: number]
  'click:entity': [entityId: number, labelId: number]
  'contextmenu:entity': [entityId: number]
  addRelation: [fromEntityId: number, toEntityId: number, labelId: number]
  'click:relation': [relationId: number, labelId: number]
  'contextmenu:relation': [relationId: number]
}>()

const entityMenuOpened = ref(false)
const relationMenuOpened = ref(false)
const x = ref(0)
const y = ref(0)
const startOffset = ref(0)
const endOffset = ref(0)
const entity = ref<any>(null)
const relation = ref<any>(null)
const selectedEntities = ref<SpanDTO[]>([])

const currentLabel = computed(() => {
  if (entity.value) {
    return props.entityLabels.find((label: any) => label.id === entity.value!.label)
  }
  return null
})

const currentRelationLabel = computed(() => {
  if (relation.value) {
    return props.relationLabels.find((label: any) => label.id === relation.value.labelId)
  }
  return null
})

function setOffset(newStartOffset: number, newEndOffset: number) {
  startOffset.value = newStartOffset
  endOffset.value = newEndOffset
}

function setEntity(entityId: number) {
  entity.value = props.entities.find((e: any) => e.id === entityId)
}

function setRelation(relationId: number) {
  relation.value = props.relations.find((r: any) => r.id === relationId)
}

function setEntityForRelation(e: Event, entityId: number) {
  const foundEntity = props.entities.find((ent) => ent.id === entityId)!
  const index = selectedEntities.value.findIndex((ent) => ent.id === foundEntity.id)
  if (index === -1) {
    selectedEntities.value.push(foundEntity)
  } else {
    selectedEntities.value.splice(index, 1)
  }
  if (selectedEntities.value.length === 2) {
    if (props.selectedLabel) {
      addRelation(props.selectedLabel.id)
      cleanUp()
    } else {
      showRelationLabelMenu(e)
    }
  }
}

function showEntityLabelMenu(e: any) {
  e.preventDefault()
  entityMenuOpened.value = false
  x.value = e.clientX || e.changedTouches[0].clientX
  y.value = e.clientY || e.changedTouches[0].clientY
  nextTick(() => {
    entityMenuOpened.value = true
  })
}

function showRelationLabelMenu(e: any) {
  e.preventDefault()
  relationMenuOpened.value = false
  x.value = e.clientX || e.changedTouches[0].clientX
  y.value = e.clientY || e.changedTouches[0].clientY
  nextTick(() => {
    relationMenuOpened.value = true
  })
}

function handleAddEvent(e: any, newStartOffset: number, newEndOffset: number) {
  setOffset(newStartOffset, newEndOffset)
  if (props.selectedLabel) {
    addOrUpdateEntity(props.selectedLabel.id)
  } else {
    showEntityLabelMenu(e)
  }
}

function onEntityClicked(e: any, entityId: number) {
  if (props.relationMode) {
    setEntityForRelation(e, entityId)
  } else {
    setEntity(entityId)
    showEntityLabelMenu(e)
  }
}

function onRelationClicked(e: any, rel: any) {
  setRelation(rel.id)
  showRelationLabelMenu(e)
}

function addOrUpdateEntity(labelId: number) {
  if (labelId) {
    if (entity.value) {
      updateEntity(labelId)
    } else {
      addEntity(labelId)
    }
  } else {
    deleteEntity(entity.value)
  }
  cleanUp()
}

function addOrUpdateRelation(labelId: number) {
  if (labelId) {
    if (relation.value) {
      updateRelation(labelId)
    } else {
      addRelation(labelId)
    }
  } else {
    deleteRelation(relation.value)
  }
  cleanUp()
}

function addEntity(labelId: number) {
  emit('addEntity', startOffset.value, endOffset.value, labelId)
}

function updateEntity(labelId: number) {
  emit('click:entity', entity.value!.id, labelId)
}

function deleteEntity(ent: any) {
  emit('contextmenu:entity', ent.id)
  cleanUp()
}

function cleanUp() {
  entityMenuOpened.value = false
  relationMenuOpened.value = false
  entity.value = null
  relation.value = null
  startOffset.value = 0
  endOffset.value = 0
  selectedEntities.value = []
}

function addRelation(labelId: number) {
  const [fromEntity, toEntity] = selectedEntities.value
  emit('addRelation', fromEntity.id, toEntity.id, labelId)
}

function updateRelation(labelId: number) {
  emit('click:relation', relation.value.id, labelId)
}

function deleteRelation(rel: any) {
  emit('contextmenu:relation', rel.id)
}
</script>
