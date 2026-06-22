<template>
  <v-card>
    <v-card-title>Edit Text</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-textarea
          v-model="editedItem.text"
          autofocus
          auto-grow
          counter
          outlined
          :rules="[rules.required]"
        />
        <v-btn :disabled="!valid" color="primary" class="text-capitalize" @click="save">
          Save
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ExampleDTO } from '@/services/application/example/exampleData'

definePageMeta({
  layout: 'project',
  middleware: ['check-auth', 'auth', 'setCurrentProject', 'isProjectAdmin', 'is-text-project'],
  validate(route) {
    return (
      /^\d+$/.test(route.params.id as string) && /^\d+$/.test(route.params.example_id as string)
    )
  }
})

const route = useRoute()
const router = useRouter()
const { $services } = useNuxtApp()

const editedItem = ref({} as ExampleDTO)
const valid = ref(true)
const rules = {
  required: (v: string) => !!v || 'Required'
}

const projectId = computed(() => route.params.id as string)

onMounted(async () => {
  const exampleId = parseInt(route.params.example_id as string, 10)
  editedItem.value = await $services.example.findById(projectId.value, exampleId)
})

async function save() {
  await $services.example.update(projectId.value, editedItem.value)
  router.push(`/projects/${projectId.value}/dataset`)
}
</script>
