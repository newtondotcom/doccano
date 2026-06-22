<template>
  <confirm-form
    :items="selected"
    :title="$t('comments.removeComment')"
    :message="$t('comments.removePrompt')"
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
