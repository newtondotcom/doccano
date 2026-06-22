<template>
  <v-card>
    <v-card-title>Member's Progress</v-card-title>
    <v-divider />
    <v-card-text>
      <div v-for="(item, index) in stats.progress" :key="index" class="mb-2">
        <span class="font-weight-medium">{{ item.user }}</span>
        <span class="font-weight-medium">{{ item.done }} / {{ stats.total }}</span>
        <v-progress-linear :value="rate(item.done, stats.total)" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { Progress } from '@/domain/models/metrics/metrics'

const route = useRoute()
const { $repositories } = useNuxtApp()

const stats = ref({} as Progress)

function rate(done: number, total: number) {
  return (done / total) * 100
}

onBeforeMount(async () => {
  stats.value = await $repositories.metrics.fetchMemberProgress(route.params.id as string)
})
</script>
