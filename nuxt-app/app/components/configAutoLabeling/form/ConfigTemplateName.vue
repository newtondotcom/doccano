<template>
  <v-stepper-content step="1">
    <v-card>
      <v-card-text class="pa-0">
        <v-form ref="form" v-model="valid">
          <h4 class="text-h6">Select a config template</h4>
          <p class="font-weight-regular body-1">
            You can select the template to create the auto-labeling configuration.{{ valid }}
          </p>
          <v-select v-model="selectedTask" :items="taskNames" label="Select a task name" outlined />
          <v-select
            v-model="templateName"
            :items="templateNames"
            :rules="templateNameRules()"
            label="Select a config template"
            outlined
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="pa-0">
        <v-spacer />
        <v-btn :disabled="!valid" color="primary" class="text-capitalize" @click="$emit('next')">
          Next
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-stepper-content>
</template>

<script setup lang="ts">
import { templateNameRules } from '@/rules/index'
import type { Project } from '@/domain/models/project/project'

const route = useRoute()
const { $repositories, $services } = useNuxtApp()

const emit = defineEmits(['input', 'next'])

const project = ref({} as Project)
const selectedTask = ref('')
const templateName = ref<string | null>(null)
const templateNames = ref<string[]>([])
const valid = ref(false)
const form = ref()

const projectId = computed(() => route.params.id as string)
const taskNames = computed(() => project.value.taskNames)
const taskType = computed(
  () =>
    ({
      DocumentClassification: 'Category',
      SequenceLabeling: 'Span',
      Seq2seq: 'Text',
      ImageClassification: 'Category',
      Speech2text: 'Text'
    })[selectedTask.value]!
)

watch(templateName, async (val) => {
  if (val) {
    const response = await $repositories.template.find(projectId.value, val)
    const field = response.toObject()
    field.taskType = taskType.value
    emit('input', field)
  }
})

watch(selectedTask, async () => {
  templateName.value = null
  await fetchTemplateNames()
  form.value?.resetValidation()
})

async function fetchTemplateNames() {
  templateNames.value = await $repositories.template.list(projectId.value, selectedTask.value)
}

project.value = await $services.project.findById(projectId.value)
selectedTask.value = taskNames.value[0]
await fetchTemplateNames()
</script>
