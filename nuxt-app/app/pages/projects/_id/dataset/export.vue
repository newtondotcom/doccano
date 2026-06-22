<template>
  <v-card>
    <v-card-title>
      {{ $t('dataset.exportDataTitle') }}
    </v-card-title>
    <v-card-text>
      <v-overlay :value="isProcessing">
        <v-progress-circular indeterminate size="64" />
      </v-overlay>
      <v-form ref="form" v-model="valid">
        <v-select
          v-model="selectedFormat"
          :items="formats"
          hide-details="auto"
          item-text="name"
          label="File format"
          outlined
          :rules="fileFormatRules(tm('rules.fileFormatRules'))"
        />
        <v-sheet
          v-if="selectedFormat"
          :dark="!$vuetify.theme.dark"
          :light="$vuetify.theme.dark"
          class="mt-2 pa-5"
        >
          <pre>{{ example }}</pre>
        </v-sheet>
        <v-checkbox v-model="exportApproved" label="Export only approved documents" hide-details />
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn class="text-capitalize ms-2 primary" :disabled="!valid" @click="downloadRequest">
        {{ $t('generic.export') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { fileFormatRules } from '@/rules/index'
import { Format } from '@/domain/models/download/format'

definePageMeta({
  layout: 'project',
  middleware: ['check-auth', 'auth', 'setCurrentProject', 'isProjectAdmin'],
  validate(route) {
    return /^\d+$/.test(route.params.id)
  }
})

const route = useRoute()
const { tm } = useI18n()
const { $repositories } = useNuxtApp()

const exportApproved = ref(false)
const formats = ref([] as Format[])
const isProcessing = ref(false)
const polling = ref<ReturnType<typeof setInterval> | null>(null)
const selectedFormat = ref(null as any)
const taskId = ref('')
const valid = ref(false)
const form = ref()

const projectId = computed(() => route.params.id)

const example = computed(() => {
  const item = formats.value.find((item: Format) => item.name === selectedFormat.value)
  return item!.example.trim()
})

onMounted(async () => {
  formats.value = await $repositories.downloadFormat.list(projectId.value)
})

onBeforeUnmount(() => {
  if (polling.value) {
    clearInterval(polling.value)
  }
})

function reset() {
  form.value.reset()
  taskId.value = ''
  exportApproved.value = false
  selectedFormat.value = null
  isProcessing.value = false
}

async function downloadRequest() {
  isProcessing.value = true
  taskId.value = await $repositories.download.prepare(
    projectId.value,
    selectedFormat.value,
    exportApproved.value
  )
  pollData()
}

function pollData() {
  polling.value = setInterval(async () => {
    if (taskId.value) {
      const res = await $repositories.taskStatus.get(taskId.value)
      if (res.ready) {
        $repositories.download.download(projectId.value, taskId.value)
        reset()
      }
    }
  }, 1000)
}
</script>
