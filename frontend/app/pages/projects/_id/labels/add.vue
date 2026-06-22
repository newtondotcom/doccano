<template>
  <LabelFormCreate
    v-slot="slotProps"
    v-model:text="editedItem.text"
    v-model:suffix-key="editedItem.suffixKey"
    v-model:background-color="editedItem.backgroundColor"
    :items="items"
  >
    <v-btn :disabled="!slotProps.valid" color="primary" class="text-capitalize" @click="save">
      Save
    </v-btn>

    <v-btn
      :disabled="!slotProps.valid"
      color="primary"
      style="text-transform: none"
      outlined
      @click="saveAndAnother"
    >
      Save and add another
    </v-btn>
  </LabelFormCreate>
</template>

<script setup lang="ts">
import { LabelDTO } from '@/services/application/label/labelData'

definePageMeta({
  layout: 'project',
  middleware: ['check-auth', 'auth', 'setCurrentProject', 'can-define-label'],
  validate(route) {
    return /^\d+$/.test(route.params.id as string)
  }
})

const route = useRoute()
const router = useRouter()
const { $services } = useNuxtApp()

const editedItem = ref({
  text: '',
  prefixKey: null,
  suffixKey: null,
  backgroundColor: '#73D8FF',
  textColor: '#ffffff'
} as LabelDTO)

const defaultItem = {
  text: '',
  prefixKey: null,
  suffixKey: null,
  backgroundColor: '#73D8FF',
  textColor: '#ffffff'
} as LabelDTO

const items = ref([] as LabelDTO[])

const projectId = computed(() => route.params.id as string)

const service = computed(() => {
  const type = route.query.type
  if (type === 'category') {
    return $services.categoryType
  }
  if (type === 'span') {
    return $services.spanType
  }
  return $services.relationType
})

onMounted(async () => {
  items.value = await service.value.list(projectId.value)
})

async function save() {
  await service.value.create(projectId.value, editedItem.value)
  router.push(`/projects/${projectId.value}/labels`)
}

async function saveAndAnother() {
  await service.value.create(projectId.value, editedItem.value)
  editedItem.value = Object.assign({}, defaultItem)
  items.value = await service.value.list(projectId.value)
}
</script>
