<template>
  <confirm-form
    :title="$t('dataset.deleteDocumentsTitle')"
    :message="$t('dataset.deleteDocumentsMessage', { number: selected.length })"
    @ok="$emit('remove')"
    @cancel="$emit('cancel')"
  />
</template>

<script setup lang="ts">
import ConfirmForm from '@/components/utils/ConfirmForm.vue'

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
</script>
