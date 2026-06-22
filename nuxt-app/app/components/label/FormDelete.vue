<template>
  <confirm-form
    :items="selected"
    title="Delete Label"
    :message="$t('labels.deleteMessage')"
    item-key="text"
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
  }
})
</script>
