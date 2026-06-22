<template>
  <LabelFormImport :error-message="errorMessage" @clear="clearErrorMessage" @upload="upload" />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'project',
  middleware: ['check-auth', 'auth', 'setCurrentProject', 'isProjectAdmin', 'can-define-label'],
  validate(route) {
    return /^\d+$/.test(route.params.id as string)
  }
})

const route = useRoute()
const router = useRouter()
const { $services } = useNuxtApp()

const errorMessage = ref('')

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

async function upload(file: File) {
  try {
    await service.value.upload(projectId.value, file)
    router.push(`/projects/${projectId.value}/labels`)
  } catch (e: any) {
    errorMessage.value = e.message
  }
}

function clearErrorMessage() {
  errorMessage.value = ''
}
</script>
