<template>
  <UtilsConfirmForm
    :items="selected"
    title="Delete Label"
    :message="$t('labels.deleteMessage')"
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
