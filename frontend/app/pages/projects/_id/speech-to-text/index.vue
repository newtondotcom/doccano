<template>
  <TasksLayoutText v-if="example.id">
    <template #header>
      <TasksToolbarLaptop
        :doc-id="example.id"
        :enable-auto-labeling.sync="enableAutoLabeling"
        :guideline-text="project.guideline"
        :is-reviewd="example.isConfirmed"
        :total="totalExample"
        class="d-none d-sm-block"
        @click:clear-label="clear(example.id)"
        @click:review="confirm(projectId)"
      />
      <TasksToolbarMobile :total="totalExample" class="d-flex d-sm-none" />
    </template>
    <template #content>
      <v-overlay :value="isLoading">
        <v-progress-circular indeterminate size="64" />
      </v-overlay>
      <TasksAudioViewer :source="example.url" class="mb-5" />
      <TasksSeq2seqBox
        :text="example.text"
        :annotations="labels"
        @delete:annotation="(labelId) => remove(example.id, labelId)"
        @update:annotation="(labelId, text) => update(example.id, labelId, text)"
        @create:annotation="(text) => add(example.id, text)"
      />
    </template>
    <template #sidebar>
      <TasksSidebarAnnotationProgress :progress="progress" />
      <TasksMetadataListMetadata :metadata="example.meta" class="mt-4" />
    </template>
  </TasksLayoutText>
</template>

<script setup>
import { useExampleItem } from '@/composables/useExampleItem'
import { useProjectItem } from '@/composables/useProjectItem'
import { useTextLabel } from '@/composables/useTextLabel'

definePageMeta({
  layout: 'workspace',
  validate(route) {
    return /^\d+$/.test(route.params.id) && /^\d+$/.test(route.query.page)
  }
})

const route = useRoute()
const { $repositories } = useNuxtApp()
const projectId = route.params.id

const { state: projectState, getProjectById } = useProjectItem()
const { project } = toRefs(projectState)
const {
  state: labelState,
  autoLabel,
  list,
  clear,
  remove,
  add,
  update
} = useTextLabel($repositories.textLabel, projectId)
const { labels } = toRefs(labelState)
const { state: exampleState, confirm, getExample, updateProgress } = useExampleItem()
const { example, totalExample, progress } = toRefs(exampleState)
const enableAutoLabeling = ref(false)
const isLoading = ref(false)

getProjectById(projectId)
updateProgress(projectId)

async function load() {
  isLoading.value = true
  await getExample(projectId, route.query)
  if (enableAutoLabeling.value) {
    try {
      await autoLabel(projectId, exampleState.example.id)
    } catch (e) {
      enableAutoLabeling.value = false
    }
  } else {
    await list(exampleState.example.id)
  }
  isLoading.value = false
}

watch(() => route.query, load, { immediate: true, deep: true })
watch(enableAutoLabeling, async (val) => {
  if (val && !exampleState.example.isConfirmed) {
    await autoLabel(exampleState.example.id)
  }
})
</script>
