<template>
  <v-stepper v-model="step.count">
    <v-overlay :value="isLoading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <ConfigAutoLabelingFormConfigHeader :step="step.count" />
    <ConfigAutoLabelingFormConfigTemplateName v-model="fields" @next="step.next()" />
    <ConfigAutoLabelingFormConfigParameters
      v-if="fields.modelAttrs !== undefined"
      v-model="fields.modelAttrs"
      :is-passed="passTesting.parameter"
      :error-messages="errors"
      :response="response.parameter"
      @prev="step.prev()"
      @next="step.next()"
      @onTest="testParameters"
    />

    <ConfigAutoLabelingFormConfigTemplate
      v-model="fields.template"
      :is-passed="passTesting.template"
      :error-messages="errors"
      :response="response.parameter"
      :result="response.template"
      @prev="step.prev()"
      @next="step.next()"
      @onTest="testTemplate"
    />

    <ConfigAutoLabelingFormConfigLabelMapping
      v-model="fields.labelMapping"
      :is-passed="passTesting.mapping"
      :error-messages="errors"
      :response="response.template"
      :result="response.mapping"
      @prev="step.prev()"
      @next="saveConfig"
      @onTest="testMapping"
    />
  </v-stepper>
</template>

<script setup lang="ts">
import { StepCounter } from '@/domain/models/utils/stepper'
import { ConfigItem, type Fields } from '@/domain/models/autoLabeling/config'

const route = useRoute()
const { $repositories } = useNuxtApp()

const emit = defineEmits(['onCreate'])

const errors = ref([] as string[])
const fields = ref({} as Fields)
const isLoading = ref(false)
const step = ref(new StepCounter())
const passTesting = ref({
  parameter: false,
  template: false,
  mapping: false
})
const response = ref({
  parameter: [] as unknown[],
  template: [] as unknown[],
  mapping: [] as unknown[]
})

watch(
  () => fields.value.modelName,
  () => {
    passTesting.value = { parameter: false, template: false, mapping: false }
  }
)

watch(
  () => fields.value.modelAttrs,
  () => {
    passTesting.value = {
      parameter: false,
      template: false,
      mapping: false
    }
  },
  { deep: true }
)

watch(
  () => fields.value.template,
  () => {
    passTesting.value = { parameter: true, template: false, mapping: false }
  }
)

watch(
  () => fields.value.labelMapping,
  () => {
    passTesting.value = { parameter: true, template: true, mapping: false }
  },
  { deep: true }
)

function testConfig(promise: Promise<unknown>, key: 'parameter' | 'template' | 'mapping') {
  isLoading.value = true
  promise
    .then((value) => {
      response.value[key] = value as never
      passTesting.value[key] = true
      errors.value = []
    })
    .catch((error) => {
      errors.value = [error.response.data]
    })
    .finally(() => {
      isLoading.value = false
    })
}

function testParameters(text: string) {
  const projectId = route.params.id as string
  const item = ConfigItem.parseFromUI(fields.value)
  const promise = $repositories.config.testParameters(projectId, item, text)
  testConfig(promise, 'parameter')
}

function testTemplate() {
  const projectId = route.params.id as string
  const item = ConfigItem.parseFromUI(fields.value)
  const promise = $repositories.config.testTemplate(
    projectId,
    response.value.parameter,
    item
  )
  testConfig(promise, 'template')
}

function testMapping() {
  const projectId = route.params.id as string
  const item = ConfigItem.parseFromUI(fields.value)
  const promise = $repositories.config.testMapping(projectId, item, response.value.template)
  testConfig(promise, 'mapping')
}

function saveConfig() {
  const projectId = route.params.id as string
  const item = ConfigItem.parseFromUI(fields.value)
  isLoading.value = true
  $repositories.config
    .create(projectId, item)
    .then(() => {
      step.value.first()
      emit('onCreate')
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>
