<template>
  <v-stepper v-model="step.count">
    <v-overlay :value="isLoading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <config-header :step="step.count" />
    <config-template-name v-model="fields" @next="step.next()" />
    <config-parameters
      v-if="fields.modelAttrs !== undefined"
      v-model="fields.modelAttrs"
      :is-passed="passTesting.parameter"
      :error-messages="errors"
      :response="response.parameter"
      @prev="step.prev()"
      @next="step.next()"
      @onTest="testParameters"
    />

    <config-template
      v-model="fields.template"
      :is-passed="passTesting.template"
      :error-messages="errors"
      :response="response.parameter"
      :result="response.template"
      @prev="step.prev()"
      @next="step.next()"
      @onTest="testTemplate"
    />

    <config-label-mapping
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
import { computed, reactive, ref, watch } from 'vue'
import ConfigHeader from './form/ConfigHeader.vue'
import ConfigLabelMapping from './form/ConfigLabelMapping.vue'
import ConfigParameters from './form/ConfigParameters.vue'
import ConfigTemplate from './form/ConfigTemplate.vue'
import ConfigTemplateName from './form/ConfigTemplateName.vue'
import { StepCounter } from '@/domain/models/utils/stepper'
import { ConfigItem, Fields } from '@/domain/models/autoLabeling/config'

const emit = defineEmits(['onCreate'])
const route = useRoute()
const { $repositories } = useNuxtApp() as any

const config = ref({} as ConfigItem)
const errors = ref<string[]>([])
const fields = ref({} as Fields)
const isLoading = ref(false)
const step = reactive(new StepCounter())
const passTesting = ref({
  parameter: false,
  template: false,
  mapping: false
})
const response = ref({
  parameter: [],
  template: [],
  mapping: []
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
    passTesting.value = { parameter: false, template: false, mapping: false }
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

const testConfig = (promise: Promise<any>, key: 'parameter' | 'template' | 'mapping') => {
  isLoading.value = true
  promise
    .then((value) => {
      response.value[key] = value
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

const testParameters = (text: string) => {
  const projectId = route.params.id
  const item = ConfigItem.parseFromUI(fields.value)
  const promise = $repositories.config.testParameters(projectId, item, text)
  testConfig(promise, 'parameter')
}

const testTemplate = () => {
  const projectId = route.params.id
  const item = ConfigItem.parseFromUI(fields.value)
  const promise = $repositories.config.testTemplate(
    projectId,
    response.value.parameter,
    item
  )
  testConfig(promise, 'template')
}

const testMapping = () => {
  const projectId = route.params.id
  const item = ConfigItem.parseFromUI(fields.value)
  const promise = $repositories.config.testMapping(projectId, item, response.value.template)
  testConfig(promise, 'mapping')
}

const saveConfig = () => {
  const projectId = route.params.id
  const item = ConfigItem.parseFromUI(fields.value)
  isLoading.value = true
  $repositories.config
    .create(projectId, item)
    .then(() => {
      step.first()
      emit('onCreate')
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>
