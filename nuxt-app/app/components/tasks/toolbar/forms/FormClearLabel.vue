<template>
  <confirm-form
    title="Clear annotations"
    message="Are you sure you want to delete all annotations?"
    :button-true-text="$t('generic.yes')"
    :button-false-text="$t('generic.cancel')"
    @ok="$emit('click:ok')"
    @cancel="$emit('click:cancel')"
  />
</template>

<script setup lang="ts">
import ConfirmForm from '@/components/utils/ConfirmForm.vue'
</script>
