<template>
  <UtilsConfirmForm
    :items="selected"
    :title="$t('comments.removeComment')"
    :message="$t('comments.removePrompt')"
    item-key="text"
    @ok="$emit('remove')"
    @cancel="$emit('cancel')"
  />
</template>

<script setup lang="ts">
defineProps({
  selected: {
    type: Array,
    default: () => [],
  },
});

defineEmits<{
  remove: [];
  cancel: [];
}>();
</script>
