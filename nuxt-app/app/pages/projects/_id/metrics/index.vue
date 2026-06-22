<template>
  <v-row>
    <v-col cols="12">
      <MetricsMemberProgress />
    </v-col>
    <v-col v-if="!!project.canDefineCategory" cols="12">
      <MetricsLabelDistribution
        title="Category Distribution"
        :distribution="categoryDistribution"
        :label-types="categoryTypes"
      />
    </v-col>
    <v-col v-if="!!project.canDefineSpan" cols="12">
      <MetricsLabelDistribution
        title="Span Distribution"
        :distribution="spanDistribution"
        :label-types="spanTypes"
      />
    </v-col>
    <v-col v-if="!!project.canDefineRelation" cols="12">
      <MetricsLabelDistribution
        title="Relation Distribution"
        :distribution="relationDistribution"
        :label-types="relationTypes"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import { useMainStore as useProjectsStore } from '@/store/projects'

definePageMeta({
  layout: 'project',
  middleware: ['check-auth', 'auth', 'setCurrentProject', 'isProjectAdmin'],
  validate(route) {
    return /^\d+$/.test(route.params.id)
  }
})

const route = useRoute()
const { $services, $repositories } = useNuxtApp()
const projectsStore = useProjectsStore()

const categoryTypes = ref([])
const categoryDistribution = ref({})
const relationTypes = ref([])
const relationDistribution = ref({})
const spanTypes = ref([])
const spanDistribution = ref({})

const project = computed(() => projectsStore.project)
const projectId = computed(() => route.params.id)

onMounted(async () => {
  if (project.value.canDefineCategory) {
    categoryTypes.value = await $services.categoryType.list(projectId.value)
    categoryDistribution.value = await $repositories.metrics.fetchCategoryDistribution(
      projectId.value
    )
  }
  if (project.value.canDefineSpan) {
    spanTypes.value = await $services.spanType.list(projectId.value)
    spanDistribution.value = await $repositories.metrics.fetchSpanDistribution(projectId.value)
  }
  if (project.value.canDefineRelation) {
    relationTypes.value = await $services.relationType.list(projectId.value)
    relationDistribution.value = await $repositories.metrics.fetchRelationDistribution(
      projectId.value
    )
  }
})
</script>
