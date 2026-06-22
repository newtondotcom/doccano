<template>
  <v-card>
    <v-card-title v-text="title" />
    <v-divider />
    <v-tabs v-model="tab" show-arrows>
      <v-tab
        v-for="(value, user) in chartJSFormat"
        :key="user"
        :value="user"
        class="text-capitalize"
      >
        {{ user }}
      </v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item v-for="(value, user) in chartJSFormat" :key="user" :value="user">
        <v-card-text>
          <MetricsChartBar :chart-data="value" />
        </v-card-text>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed } from 'vue'
import { Distribution } from '@/domain/models/metrics/metrics'
import { LabelDTO } from '@/services/application/label/labelData'

const props = defineProps({
  title: {
    type: String,
    required: true,
    default: 'Distribution'
  },
  distribution: {
    type: Object as PropType<Distribution>,
    required: true
  },
  labelTypes: {
    type: Array as PropType<LabelDTO[]>,
    default: () => [],
    required: true
  }
})

const tab = ref<string | null>(null)

const colorMapping = computed((): { [text: string]: string } => {
  return Object.fromEntries(
    props.labelTypes.map((labelType) => [labelType.text, labelType.backgroundColor])
  )
})

const chartJSFormat = computed((): any => {
  const data: { [user: string]: { labels: string[]; datasets: any[] } } = {}
  for (const user in props.distribution) {
    const labels = Object.keys(props.distribution[user])
    labels.sort()
    const counts = labels.map((label) => props.distribution[user][label])
    const colors = labels.map((label) =>
      label in colorMapping.value ? colorMapping.value[label] : '#00d1b2'
    )
    data[user] = {
      labels,
      datasets: [
        {
          title: props.title,
          backgroundColor: colors,
          data: counts
        }
      ]
    }
  }
  return data
})

watch(
  chartJSFormat,
  (format) => {
    const users = Object.keys(format)
    if (users.length && !tab.value) {
      tab.value = users[0]
    }
  },
  { immediate: true }
)
</script>
