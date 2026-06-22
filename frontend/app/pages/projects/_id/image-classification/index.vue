<template>
  <TasksLayoutText v-if="image.id">
    <template #header>
      <TasksToolbarLaptop
        :doc-id="image.id"
        :enable-auto-labeling.sync="enableAutoLabeling"
        :guideline-text="project.guideline"
        :is-reviewd="image.isConfirmed"
        :total="images.count"
        class="d-none d-sm-block"
        @click:clear-label="clear"
        @click:review="confirm"
      >
        <v-btn-toggle v-model="labelOption" mandatory class="ms-2">
          <v-btn icon>
            <v-icon>{{ mdiFormatListBulleted }}</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>{{ mdiText }}</v-icon>
          </v-btn>
        </v-btn-toggle>
      </TasksToolbarLaptop>
      <TasksToolbarMobile :total="images.count" class="d-flex d-sm-none" />
    </template>
    <template #content>
      <v-card v-shortkey="shortKeys" @shortkey="addOrRemove">
        <v-card-title>
          <TasksTextClassificationLabelGroup
            v-if="labelOption === 0"
            :labels="labels"
            :annotations="annotations"
            :single-label="project.exclusiveCategories"
            @add="add"
            @remove="remove"
          />
          <TasksTextClassificationLabelSelect
            v-else
            :labels="labels"
            :annotations="annotations"
            :single-label="project.exclusiveCategories"
            @add="add"
            @remove="remove"
          />
        </v-card-title>
        <v-divider />
        <v-img contain :src="image.url" :max-height="imageSize.height" class="grey lighten-2" />
      </v-card>
    </template>
    <template #sidebar>
      <TasksSidebarAnnotationProgress :progress="progress" />
      <TasksMetadataListMetadata :metadata="image.meta" class="mt-4" />
    </template>
  </TasksLayoutText>
</template>

<script setup>
import { mdiFormatListBulleted, mdiText } from '@mdi/js'
import _ from 'lodash'
import { useLabelList } from '@/composables/useLabelList'
import { Category } from '@/domain/models/tasks/category'

definePageMeta({
  layout: 'workspace',
  validate(route) {
    return /^\d+$/.test(route.params.id) && /^\d+$/.test(route.query.page)
  }
})

const route = useRoute()
const { $services, $repositories } = useNuxtApp()

const { state: labelState, getLabelList, shortKeys } = useLabelList($services.categoryType)
const { labels } = toRefs(labelState)

const annotations = ref([])
const images = ref([])
const project = ref({})
const enableAutoLabeling = ref(false)
const labelOption = ref(0)
const imageSize = reactive({
  height: 0,
  width: 0
})
const progress = ref({})

const projectId = computed(() => route.params.id)

const image = computed(() => {
  if (_.isEmpty(images.value) || images.value.items.length === 0) {
    return {}
  }
  return images.value.items[0]
})

async function load() {
  images.value = await $services.example.fetchOne(
    projectId.value,
    route.query.page,
    route.query.q,
    route.query.isChecked,
    route.query.ordering
  )
  const currentImage = images.value.items[0]
  setImageSize(currentImage)
  if (enableAutoLabeling.value) {
    await autoLabel(currentImage.id)
  }
  await list(currentImage.id)
}

watch(() => route.query, load, { immediate: true, deep: true })
watch(enableAutoLabeling, async (val) => {
  if (val && !image.value.isConfirmed) {
    await autoLabel(image.value.id)
    await list(image.value.id)
  }
})

onMounted(async () => {
  getLabelList(projectId.value)
  project.value = await $services.project.findById(projectId.value)
  progress.value = await $repositories.metrics.fetchMyProgress(projectId.value)
})

async function list(imageId) {
  annotations.value = await $repositories.category.list(projectId.value, imageId)
}

async function remove(id) {
  await $repositories.category.delete(projectId.value, image.value.id, id)
  await list(image.value.id)
}

async function add(labelId) {
  const category = Category.create(labelId)
  await $repositories.category.create(projectId.value, image.value.id, category)
  await list(image.value.id)
}

async function addOrRemove(event) {
  const labelId = parseInt(event.srcKey, 10)
  const annotation = annotations.value.find((item) => item.label === labelId)
  if (annotation) {
    await remove(annotation.id)
  } else {
    await add(labelId)
  }
}

async function clear() {
  await $repositories.category.clear(projectId.value, image.value.id)
  await list(image.value.id)
}

async function autoLabel(imageId) {
  try {
    await $repositories.category.autoLabel(projectId.value, imageId)
  } catch (e) {
    console.log(e.response.data.detail)
  }
}

async function updateProgress() {
  progress.value = await $repositories.metrics.fetchMyProgress(projectId.value)
}

async function confirm() {
  await $services.example.confirm(projectId.value, image.value.id)
  await load()
  updateProgress()
}

function setImageSize(val) {
  const img = new Image()
  img.onload = function () {
    imageSize.height = this.height
    imageSize.width = this.width
  }
  img.src = val.url
}
</script>

<style scoped>
.text-pre-wrap {
  white-space: pre-wrap !important;
}
</style>
