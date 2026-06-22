<template>
  <v-card>
    <v-card-title>Progress</v-card-title>
    <v-card-text>
      <v-list class="pt-0" dense>
        <v-list-item class="pa-0">
          <v-list-item-title>Total</v-list-item-title>
          <v-list-item-subtitle class="text-right" v-text="progress.total" />
        </v-list-item>
        <v-list-item class="pa-0">
          <v-list-item-title>Complete</v-list-item-title>
          <v-list-item-subtitle class="text-right" v-text="progress.complete" />
        </v-list-item>
      </v-list>
      <v-progress-linear :value="percentage" color="success" height="25">
        <template #default="{ value }">
          <strong>{{ value }}%</strong>
        </template>
      </v-progress-linear>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { MyProgress } from '@/domain/models/metrics/metrics'

const props = defineProps({
  progress: {
    type: Object as PropType<MyProgress>,
    required: true
  }
})

const percentage = computed(() => Math.ceil((props.progress.complete / props.progress.total) * 100))
</script>
