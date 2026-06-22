<template>
  <v-checkbox
    v-bind="$attrs"
    :value="value"
    :label="$t('overview.shareAnnotations')"
    @change="$emit('input', $event === true)"
  />
</template>

<script setup lang="ts">
defineProps({
  value: {
    type: Boolean,
    default: false,
    required: true,
  },
});

defineEmits<{
  input: [value: boolean];
}>();
</script>
