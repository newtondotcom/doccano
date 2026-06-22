<template>
  <UtilsConfirmForm
    :items="selected"
    :title="$t('members.removeMember')"
    :message="$t('members.removePrompt')"
    item-key="username"
    @ok="$emit('remove')"
    @cancel="$emit('cancel')"
  />
</template>

<script setup lang="ts">
defineProps({
  selected: {
    type: Array,
    default: () => []
  }
})

defineEmits<{
  remove: []
  cancel: []
}>()
</script>
