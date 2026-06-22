<template>
  <v-combobox
    v-bind="$attrs"
    :value="value"
    :items="value"
    label="Tags"
    multiple
    chips
    deletable-chips
    hide-selected
    hide-details
    @change="$emit('input', $event)"
  />
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

defineProps({
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
    required: true
  }
})

defineEmits<{
  input: [value: string[]]
}>()
</script>
