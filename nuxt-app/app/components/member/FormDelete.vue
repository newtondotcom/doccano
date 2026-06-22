<template>
  <confirm-form
    :items="selected"
    :title="$t('members.removeMember')"
    :message="$t('members.removePrompt')"
    item-key="username"
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
