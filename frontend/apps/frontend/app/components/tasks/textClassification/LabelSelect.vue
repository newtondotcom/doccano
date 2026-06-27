<template>
  <TasksTextClassificationSingleLabelSelect
    v-if="singleLabel"
    :annotations="annotations"
    :labels="labels"
    @add="$emit('add', $event)"
    @remove="$emit('remove', $event)"
  />
  <TasksTextClassificationMultiLabelSelect
    v-else
    :annotations="annotations"
    :labels="labels"
    @add="$emit('add', $event)"
    @remove="$emit('remove', $event)"
  />
</template>

<script setup>
defineProps({
  labels: {
    type: Array,
    default: () => [],
    required: true,
  },
  annotations: {
    type: Array,
    default: () => [],
    required: true,
  },
  singleLabel: {
    type: Boolean,
    default: false,
    required: true,
  },
});

defineEmits(["add", "remove"]);
</script>
