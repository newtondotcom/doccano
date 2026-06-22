<template>
  <v-btn-toggle v-model="option" mandatory>
    <v-btn icon>
      <v-icon>{{ mdiFormatListBulleted }}</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>{{ mdiText }}</v-icon>
    </v-btn>
  </v-btn-toggle>
</template>

<script setup>
import { mdiFormatListBulleted, mdiText } from '@mdi/js'

const emit = defineEmits(['change'])

const option = ref(0)

watch(option, (val) => {
  if (val === 0) {
    emit('change', 'TasksTextClassificationLabelGroup')
  } else {
    emit('change', 'TasksTextClassificationLabelSelect')
  }
})
</script>
