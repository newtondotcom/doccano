<template>
  <UtilsConfirmForm
    :title="$t('dataset.deleteDocumentsTitle')"
    :message="$t('dataset.deleteDocumentsMessage', { number: selected.length })"
    @ok="$emit('remove')"
    @cancel="$emit('cancel')"
  />
</template>

<script setup lang="ts">
defineProps({
  selected: {
    type: Array,
    default: () => []
  },
  itemKey: {
    type: String,
    default: 'text'
  }
})

defineEmits<{
  remove: []
  cancel: []
}>()
</script>
