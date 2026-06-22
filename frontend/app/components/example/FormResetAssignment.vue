<template>
  <UtilsConfirmForm
    title="Reset assignment"
    message="Are you sure you want to reset all the assignments?"
    @ok="$emit('reset')"
    @cancel="$emit('cancel')"
  />
</template>

<script setup lang="ts">
defineEmits<{
  reset: []
  cancel: []
}>()
</script>
