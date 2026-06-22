<template>
  <UtilsConfirmForm
    :title="$t('dataset.deleteBulkDocumentsTitle')"
    :message="$t('dataset.deleteBulkDocumentsMessage')"
    item-key="text"
    @ok="$emit('remove')"
    @cancel="$emit('cancel')"
  />
</template>

<script setup lang="ts">
defineEmits<{
  remove: []
  cancel: []
}>()
</script>
